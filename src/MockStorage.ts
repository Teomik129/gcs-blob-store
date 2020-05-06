import Mem, { ExistsCallback, RemoveCallback } from "abstract-blob-store";

const noop = () => {};
export class MockStorage {
  private store = new Mem();
  get metadata() {
    return this.store;
  }

  bucket() {
    const { store } = this;
    return {
      file: (key: string) => ({
        createWriteStream: () => store.createWriteStream({ key }, noop),
        createReadStream: () => store.createReadStream({ key }),
        get: (cb1: Function) =>
          store.exists({ key }, (_, ex) =>
            ex
              ? cb1(null, {
                  createReadStream: () => store.createReadStream({ key }),
                })
              : cb1("Not found")
          ),
        exists: (cb2: ExistsCallback) => store.exists({ key }, cb2),
        delete: (cb3: RemoveCallback) => store.remove({ key }, cb3),
      }),
    };
  }
}
