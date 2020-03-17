import tape from "tape";
import abstractBlobTests from "abstract-blob-store/tests";
import { gcs } from "./";

import { cloudStorage } from "./config.test.json";

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
