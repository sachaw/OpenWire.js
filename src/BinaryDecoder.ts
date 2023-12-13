import { DataType } from "./messages/BaseMessage.js";

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

    if (data === DataType.Bool) {
      const value = this.buffer[1];
      this.buffer = this.buffer.slice(2);
      return value === 1;
    }

    throw new Error(
      `Invalid data type, expected ${DataType[DataType.Bool]} but got ${
        DataType[data]
      }`,
    );
  }

  public readByte(omitPrefix = false): number {
    const data = this.buffer[0];

    if (omitPrefix) {
      this.buffer = this.buffer.slice(1);
      return data;
    }

    if (data === DataType.Byte) {
      const value = this.buffer[1];
      this.buffer = this.buffer.slice(2);
      return value;
    }

    throw new Error(
      `Invalid data type, expected ${DataType[DataType.Byte]} but got ${
        DataType[data]
      }`,
    );
  }

  public readChar(omitPrefix = false): string {
    const data = this.buffer[0];

    if (omitPrefix) {
      this.buffer = this.buffer.slice(1);
      return String.fromCharCode(data);
    }

    if (data === DataType.Char) {
      const value = String.fromCharCode(this.buffer[1]);
      this.buffer = this.buffer.slice(3);
      return value;
    }

    throw new Error(
      `Invalid data type, expected ${DataType[DataType.Char]} but got ${
        DataType[data]
      }`,
    );
  }

  public readShort(omitPrefix = false): number {
    const data = this.buffer[0];

    if (omitPrefix) {
      this.buffer = this.buffer.slice(2);
      return data;
    }

    if (data === DataType.Short) {
      const view = new DataView(this.buffer.buffer);
      const value = view.getInt16(1, this.littleEndian);
      this.buffer = this.buffer.slice(3);
      return value;
    }

    throw new Error(
      `Invalid data type, expected ${DataType[DataType.Short]} but got ${
        DataType[data]
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

    if (type === DataType.Int) {
      const value = view.getInt32(1, this.littleEndian);
      this.buffer = this.buffer.slice(5);
      return value;
    }

    throw new Error(
      `Invalid data type, expected ${DataType[DataType.Int]} but got ${
        DataType[type]
      }`,
    );
  }

  public readLong(omitPrefix = false): bigint {
    const data = this.buffer[0];

    if (omitPrefix) {
      this.buffer = this.buffer.slice(1);
      return BigInt(data);
    }

    if (data === DataType.Long) {
      const view = new DataView(this.buffer.buffer);
      const value = view.getBigInt64(1, this.littleEndian);
      this.buffer = this.buffer.slice(9);
      return value;
    }

    throw new Error(
      `Invalid data type, expected ${DataType[DataType.Long]} but got ${
        DataType[data]
      }`,
    );
  }

  public readFloat(omitPrefix = false): number {
    const data = this.buffer[0];

    if (omitPrefix) {
      this.buffer = this.buffer.slice(1);
      return data;
    }

    if (data === DataType.Float) {
      const view = new DataView(this.buffer.buffer);
      const value = view.getFloat32(1, this.littleEndian);
      this.buffer = this.buffer.slice(5);
      return value;
    }

    throw new Error(
      `Invalid data type, expected ${DataType[DataType.Float]} but got ${
        DataType[data]
      }`,
    );
  }

  public readDouble(omitPrefix = false): number {
    const data = this.buffer[0];

    if (omitPrefix) {
      this.buffer = this.buffer.slice(1);
      return data;
    }

    if (data === DataType.Double) {
      const view = new DataView(this.buffer.buffer);
      const value = view.getFloat64(1, this.littleEndian);
      this.buffer = this.buffer.slice(9);
      return value;
    }

    throw new Error(
      `Invalid data type, expected ${DataType[DataType.Double]} but got ${
        DataType[data]
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

    if (type === DataType.String) {
      const length = view.getInt16(1, this.littleEndian);
      const value = String.fromCharCode(...this.buffer.slice(3, 3 + length));
      this.buffer = this.buffer.slice(3 + length);
      return value;
    }

    throw new Error(
      `Invalid data type, expected ${DataType[DataType.String]} but got ${
        DataType[type]
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
