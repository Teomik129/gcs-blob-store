import tape from "tape";
import abstractBlobTests from "abstract-blob-store/tests";
import { rewiremock } from "./rewiremock";
import { MockStorage } from "./MockStorage";

import { cloudStorage } from "./config.example.json";

rewiremock
  .module(
    () => import("./"),
    r => ({
      "@google-cloud/storage": r.with({
        Storage: MockStorage
      })
    })
  )
  .then(mock => {
    const { gcs } = mock;
    const { bucket, credentials } = cloudStorage;

    const common = {
      setup: function(t, cb) {
        const store = gcs({ credentials, bucket });
        cb(null, store);
      },
      teardown: function(t, store, blob, cb) {
        if (blob) store.remove(blob, cb);
        else cb();
      }
    };

    abstractBlobTests(tape, common);
  });
