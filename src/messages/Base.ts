export abstract class Base {
  public abstract encode(value?: unknown): Uint8Array;
  public abstract decode(data: Uint8Array): unknown;
}
