# gcs-blob-store

A blob store backend for [Google Cloud Storage](https://developers.google.com/storage/docs/json_api/v1/)

Pretty much just a thin wrapper around [`@google-cloud/storage`](https://github.com/googleapis/nodejs-storage)

[![blob-store-compatible](https://raw.githubusercontent.com/maxogden/abstract-blob-store/master/badge.png)](https://github.com/maxogden/abstract-blob-store)

![Node.js CI](https://github.com/Teomik129/gcs-blob-store/workflows/Node.js%20CI/badge.svg)

## Usage

```js
const { gcs } = require("gcs-blob-store");
// Use a service account credentials object
const credentials = require("./credentials.json");
const bucket = "my-gcs-bucket";
const blobs1 = gcs({ bucket, credentials });
// Or specify an absolute path to a service account key file
const keyFilename = "/home/user/.config/keyfile.json";
const blobs2 = gcs({ bucket, keyFilename });
```

## License

[MIT](LICENSE)
