import { Opt, StableBTreeMap, stableJson } from "azle";

export interface DatabaseStorageInterface {
  get(): Promise<Uint8Array | undefined>;
  set(data: Uint8Array): Promise<Opt<Uint8Array>>;
}

export type DatabaseStorageOptions = {
  key?: string;
  index?: number;
};

export class DatabaseStorage implements DatabaseStorageInterface {
  private readonly STORAGE_KEY: string;
  private readonly STORAGE_INDEX: number;
  // TODO: Fix type
  private storage: any;

  constructor(options?: DatabaseStorageOptions) {
    this.STORAGE_KEY = options?.key || "DATABASE";
    this.STORAGE_INDEX = options?.index || 0;

    this.storage = StableBTreeMap<string, Uint8Array>(this.STORAGE_INDEX, stableJson, {
      toBytes: (data: Uint8Array) => data,
      fromBytes: (bytes: Uint8Array) => bytes,
    });
  }

  public async get() {
    return this.storage.get(this.STORAGE_KEY).Some;
  }

  public async set(data: Uint8Array) {
    return this.storage.insert(this.STORAGE_KEY, data);
  }
}
