import { DataType } from "./messages/BaseMessage.js";

export class BinaryEncoder {
  private buffer: Uint8Array;
  private littleEndian: boolean;

  constructor(littleEndian = false) {
    this.buffer = new Uint8Array();
    this.littleEndian = littleEndian;
  }

  public getBuffer(): Uint8Array {
    return this.buffer;
  }

  public prefixSize() {
    const packetLength = new Uint8Array(4);
    new DataView(packetLength.buffer).setUint32(
      0,
      this.buffer.length,
      this.littleEndian,
    );

    this.buffer = new Uint8Array([...packetLength, ...this.buffer]);

    return this;
  }

  private allocateArray(size: number, omitPrefix: boolean, type?: DataType) {
    const arraySize =
      this.buffer.length +
      size +
      (omitPrefix ? 0 : 1) +
      (type === DataType.String ? 2 : 0);

    const newArray = new Uint8Array(arraySize);

    newArray.set(this.buffer);

    // Write dataType
    if (!omitPrefix && type) {
      const cursor =
        newArray.length -
        (size + (type === DataType.String ? 2 : 0) + (omitPrefix ? 0 : 1));

      newArray.set([type], cursor);
    }

    // Write size of string after the dataType
    if (type === DataType.String) {
      const cursor = newArray.length - (size + 2);
      const view = new DataView(newArray.buffer);
      view.setInt16(cursor, size, this.littleEndian);
    }

    return newArray;
  }

  public addBoolean(value: boolean, omitPrefix = false): BinaryEncoder {
    const newArray = this.allocateArray(1, omitPrefix, DataType.Bool);
    const view = new DataView(newArray.buffer);

    view.setUint8(newArray.length - 1, value ? 1 : 0);
    this.buffer = newArray;

    return this;
  }

  public addByte(value: number, omitPrefix = false): BinaryEncoder {
    if (value < 0 || value > 255 || !Number.isInteger(value)) {
      throw new Error("Value must be an integer between 0 and 255.");
    }

    const newArray = this.allocateArray(1, omitPrefix, DataType.Byte);
    const view = new DataView(newArray.buffer);

    const cursor = newArray.length ? newArray.length - 1 : 0;

    view.setUint8(cursor, value);
    this.buffer = newArray;

    return this;
  }

  public addChar(value: string, omitPrefix = false): BinaryEncoder {
    if (value.length !== 1) {
      throw new Error("Value must be a single-character string.");
    }

    const newArray = this.allocateArray(2, omitPrefix, DataType.Char);
    const view = new DataView(newArray.buffer);
    const codePoint = value.charCodeAt(0);

    view.setUint16(newArray.length - 2, codePoint, this.littleEndian);
    this.buffer = newArray;

    return this;
  }

  public addShort(value: number, omitPrefix = false): BinaryEncoder {
    if (value < -32768 || value > 32767 || !Number.isInteger(value)) {
      throw new Error("Value must be an integer between -32768 and 32767.");
    }

    const newArray = this.allocateArray(2, omitPrefix, DataType.Short);
    const view = new DataView(newArray.buffer);

    view.setInt16(newArray.length - 2, value, this.littleEndian);
    this.buffer = newArray;

    return this;
  }

  public addInt(value: number, omitPrefix = false): BinaryEncoder {
    const newArray = this.allocateArray(4, omitPrefix, DataType.Int);
    const view = new DataView(newArray.buffer);

    view.setInt32(newArray.length - 4, value, this.littleEndian);
    this.buffer = newArray;

    return this;
  }

  public addLong(value: bigint, omitPrefix = false): BinaryEncoder {
    const newArray = this.allocateArray(8, omitPrefix, DataType.Long);
    const view = new DataView(newArray.buffer);

    view.setBigInt64(newArray.length - 8, value, this.littleEndian);
    this.buffer = newArray;

    return this;
  }

  public addFloat(value: number, omitPrefix = false): BinaryEncoder {
    const newArray = this.allocateArray(4, omitPrefix, DataType.Float);
    const view = new DataView(newArray.buffer);

    view.setFloat32(newArray.length - 4, value, this.littleEndian);
    this.buffer = newArray;

    return this;
  }

  public addDouble(value: number, omitPrefix = false): BinaryEncoder {
    const newArray = this.allocateArray(8, omitPrefix, DataType.Double);
    const view = new DataView(newArray.buffer);

    view.setFloat64(newArray.length - 8, value, this.littleEndian);
    this.buffer = newArray;

    return this;
  }

  public addString(
    value: string,
    omitPrefix = false,
    omitStringSize = false,
  ): BinaryEncoder {
    const newArray = this.allocateArray(
      value.length,
      omitPrefix,
      DataType.String,
    );

    const view = new DataView(newArray.buffer);

    const cursor = newArray.length - value.length;

    for (let i = 0; i < value.length; i++) {
      view.setUint8(cursor + i, value.charCodeAt(i));
    }
    this.buffer = newArray;

    return this;
  }

  public addRaw(value: Uint8Array): BinaryEncoder {
    const newArray = new Uint8Array(this.buffer.length + value.length);
    newArray.set(this.buffer);
    newArray.set(value, newArray.length - value.length);
    this.buffer = newArray;

    return this;
  }
}
