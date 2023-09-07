import { dataType } from "./BinaryEncoder.ts";

export class BinaryDecoder {
  private buffer: Uint8Array;
  private littleEndian: boolean;

  constructor(buffer: Uint8Array, littleEndian = false) {
    this.buffer = buffer;
    this.littleEndian = littleEndian;
  }

  public getBuffer(): Uint8Array {
    return this.buffer;
  }

  public getLength(): number {
    return this.buffer.length;
  }

  public readBoolean(omitPrefix = false): boolean {
    const data = this.buffer[0];

    if (omitPrefix) {
      this.buffer = this.buffer.slice(1);
      return data === 1;
    }

    if (data === dataType.bool) {
      const value = this.buffer[1];
      this.buffer = this.buffer.slice(2);
      return value === 1;
    }

    throw new Error(
      `Invalid data type, expected ${dataType[dataType.bool]} but got ${
        dataType[data]
      }`,
    );
  }

  public readByte(omitPrefix = false): number {
    const data = this.buffer[0];

    if (omitPrefix) {
      this.buffer = this.buffer.slice(1);
      return data;
    }

    if (data === dataType.byte) {
      const value = this.buffer[1];
      this.buffer = this.buffer.slice(2);
      return value;
    }

    throw new Error(
      `Invalid data type, expected ${dataType[dataType.byte]} but got ${
        dataType[data]
      }`,
    );
  }

  public readChar(omitPrefix = false): string {
    const data = this.buffer[0];

    if (omitPrefix) {
      this.buffer = this.buffer.slice(1);
      return String.fromCharCode(data);
    }

    if (data === dataType.char) {
      const value = String.fromCharCode(this.buffer[1]);
      this.buffer = this.buffer.slice(3);
      return value;
    }

    throw new Error(
      `Invalid data type, expected ${dataType[dataType.char]} but got ${
        dataType[data]
      }`,
    );
  }

  public readShort(omitPrefix = false): number {
    const data = this.buffer[0];

    if (omitPrefix) {
      this.buffer = this.buffer.slice(2);
      return data;
    }

    if (data === dataType.short) {
      const view = new DataView(this.buffer.buffer);
      const value = view.getInt16(1, this.littleEndian);
      this.buffer = this.buffer.slice(3);
      return value;
    }

    throw new Error(
      `Invalid data type, expected ${dataType[dataType.short]} but got ${
        dataType[data]
      }`,
    );
  }

  public readInt(omitPrefix = false): number {
    const view = new DataView(this.buffer.buffer);

    if (omitPrefix) {
      const value = view.getInt32(0, this.littleEndian);
      this.buffer = this.buffer.slice(4);
      return value;
    }

    const type = this.buffer[0];

    if (type === dataType.int) {
      const value = view.getInt32(1, this.littleEndian);
      this.buffer = this.buffer.slice(5);
      return value;
    }

    throw new Error(
      `Invalid data type, expected ${dataType[dataType.int]} but got ${
        dataType[type]
      }`,
    );
  }

  public readLong(omitPrefix = false): bigint {
    const data = this.buffer[0];

    if (omitPrefix) {
      this.buffer = this.buffer.slice(1);
      return BigInt(data);
    }

    if (data === dataType.long) {
      const view = new DataView(this.buffer.buffer);
      const value = view.getBigInt64(1, this.littleEndian);
      this.buffer = this.buffer.slice(9);
      return value;
    }

    throw new Error(
      `Invalid data type, expected ${dataType[dataType.long]} but got ${
        dataType[data]
      }`,
    );
  }

  public readFloat(omitPrefix = false): number {
    const data = this.buffer[0];

    if (omitPrefix) {
      this.buffer = this.buffer.slice(1);
      return data;
    }

    if (data === dataType.float) {
      const view = new DataView(this.buffer.buffer);
      const value = view.getFloat32(1, this.littleEndian);
      this.buffer = this.buffer.slice(5);
      return value;
    }

    throw new Error(
      `Invalid data type, expected ${dataType[dataType.float]} but got ${
        dataType[data]
      }`,
    );
  }

  public readDouble(omitPrefix = false): number {
    const data = this.buffer[0];

    if (omitPrefix) {
      this.buffer = this.buffer.slice(1);
      return data;
    }

    if (data === dataType.double) {
      const view = new DataView(this.buffer.buffer);
      const value = view.getFloat64(1, this.littleEndian);
      this.buffer = this.buffer.slice(9);
      return value;
    }

    throw new Error(
      `Invalid data type, expected ${dataType[dataType.double]} but got ${
        dataType[data]
      }`,
    );
  }

  public readString(omitPrefix = false): string {
    const view = new DataView(this.buffer.buffer);

    if (omitPrefix) {
      const length = view.getInt16(0, this.littleEndian);
      const value = String.fromCharCode(...this.buffer.slice(2, 2 + length));
      this.buffer = this.buffer.slice(2 + length);
      return value;
    }

    const type = this.buffer[0];

    if (type === dataType.string) {
      const length = view.getInt16(1, this.littleEndian);
      const value = String.fromCharCode(
        ...this.buffer.slice(3, 3 + length),
      );
      this.buffer = this.buffer.slice(3 + length);
      return value;
    }

    throw new Error(
      `Invalid data type, expected ${dataType[dataType.string]} but got ${
        dataType[type]
      }`,
    );
  }

  public readRaw(size: number): Uint8Array {
    const value = this.buffer.slice(0, size);
    this.buffer = this.buffer.slice(size);
    return value;
  }

  public sampleBytes(size: number): Uint8Array {
    return this.buffer.slice(0, size);
  }
}
