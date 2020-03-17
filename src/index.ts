import { Storage, Bucket } from "@google-cloud/storage";
import { duplexify } from "@justinbeckwith/duplexify";
import {
  AbstractBlobStore,
  BlobKey,
  CreateCallback,
  ExistsCallback,
  RemoveCallback
} from "abstract-blob-store";

interface CloudStorageBlobOptions {
  bucket: string;
  keyFilename?: string;
  credentials?: {
    [key: string]: string;
    client_email: string;
    private_key: string;
  };
}

const KeyError = new Error("Must specify a key");

interface options {
  [name: string]: string;
  key: string;
}

const getOpts = (opts: BlobKey): options =>
  typeof opts === "string"
    ? { key: opts }
    : !opts.key && opts.name
    ? { key: opts.name }
    : opts;

export class CloudStorageBlob implements AbstractBlobStore {
  bucket: Bucket;
  storage: Storage;
  constructor(opts: CloudStorageBlobOptions) {
    const { bucket, keyFilename, credentials } = opts;
    if (!bucket) {
      throw new Error("Must specify bucket");
    } else if (!credentials && !keyFilename) {
      throw new Error("Must specifiy credentials or keyFilename");
    }
    this.storage = credentials
      ? new Storage({ credentials })
      : new Storage({ keyFilename });

    this.bucket = this.storage.bucket(bucket);
  }
  createWriteStream(
    opts: BlobKey,
    callback: CreateCallback
  ): NodeJS.WriteStream {
    const { key } = getOpts(opts);
    if (!key) {
      throw KeyError;
    }
    return this.bucket
      .file(key)
      .createWriteStream()
      .on("error", callback)
      .on("finish", () => callback(null, { key })) as NodeJS.WriteStream;
  }
  createReadStream(opts: BlobKey): NodeJS.ReadStream {
    const { key } = getOpts(opts);
    if (!key) {
      throw KeyError;
    }
    const proxy = duplexify();
    proxy.setWritable(null);
    this.bucket.file(key).get((err, file) => {
      if (err) {
        proxy.destroy(err);
      } else {
        proxy.setReadable(file.createReadStream());
      }
    });
    return (proxy as unknown) as NodeJS.ReadStream;
  }
  exists(opts: BlobKey, callback: ExistsCallback): void {
    const { key } = getOpts(opts);
    if (!key) {
      return callback(KeyError, false);
    }
    this.bucket.file(key).exists(callback);
  }
  remove(opts: BlobKey, callback: RemoveCallback): void {
    const { key } = getOpts(opts);
    if (!key) {
      return callback(KeyError);
    }
    this.bucket.file(key).delete(callback);
  }
}

export const gcs = (opts: CloudStorageBlobOptions) =>
  new CloudStorageBlob(opts);
