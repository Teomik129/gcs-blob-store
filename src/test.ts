import tape from "tape";
import abstractBlobTests from "abstract-blob-store/tests";
import { gcs } from "./";

if (!process.env.GCS_CONFIG) {
  throw new Error("Please provide a GCS_CONFIG env variable");
}

const { cloudStorage } = JSON.parse(process.env.GCS_CONFIG);

const { bucket, credentials } = cloudStorage;

const common = {
  setup: function(t, cb) {
    const store = gcs({ bucket, credentials });
    cb(null, store);
  },
  teardown: function(t, store, blob, cb) {
    if (blob) store.remove(blob, cb);
    else cb();
  }
};

abstractBlobTests(tape, common);
