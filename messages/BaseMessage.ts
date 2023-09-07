import { BinaryDecoder } from "../src/BinaryDecoder.ts";
import { BinaryEncoder, dataType } from "../src/BinaryEncoder.ts";

export type Properties = Map<string, Property>;

export interface Property {
  type: dataType;
  value: number | string | boolean | bigint;
}

export abstract class BaseMessage {
  public commandId: number;
  public responseRequired: boolean;
  public properties: Properties;

  public abstract encode(): Uint8Array;
  public abstract decode(decoder: BinaryDecoder): void;

  constructor() {
    this.commandId = 0;
    this.responseRequired = false;
    this.properties = new Map();
  }

  public decodeProperties(decoder: BinaryDecoder) {
    //read properties size
    const size = decoder.readInt(true);

    for (let i = 0; i < size; i++) {
      const name = decoder.readString(true);
      const type = decoder.sampleBytes(1)[0];

      switch (type) {
        case dataType.bool:
          this.properties.set(name, {
            type: dataType.bool,
            value: decoder.readBoolean(),
          });
          break;
        case dataType.byte:
          this.properties.set(
            name,
            {
              type: dataType.byte,
              value: decoder.readByte(),
            },
          );
          break;
        case dataType.char:
          this.properties.set(
            name,
            {
              type: dataType.char,
              value: decoder.readChar(),
            },
          );
          break;
        case dataType.short:
          this.properties.set(
            name,
            {
              type: dataType.short,
              value: decoder.readShort(),
            },
          );
          break;
        case dataType.int:
          this.properties.set(
            name,
            {
              type: dataType.int,
              value: decoder.readInt(),
            },
          );
          break;
        case dataType.long:
          this.properties.set(
            name,
            {
              type: dataType.long,
              value: decoder.readLong(),
            },
          );
          break;
        case dataType.float:
          this.properties.set(
            name,
            {
              type: dataType.float,
              value: decoder.readFloat(),
            },
          );
          break;
        case dataType.double:
          this.properties.set(
            name,
            {
              type: dataType.double,
              value: decoder.readDouble(),
            },
          );
          break;
        case dataType.string:
          this.properties.set(
            name,
            {
              type: dataType.string,
              value: decoder.readString(),
            },
          );
          break;
      }
    }
  }

  public encodeProperties(): Uint8Array {
    const encoder = new BinaryEncoder();
    encoder.addInt(this.properties.size, true);

    for (const property of this.properties) {
      const [name, value] = property;

      //write property name
      encoder.addString(name, true);

      switch (value.type) {
        case dataType.bool:
          encoder.addBoolean(value.value as boolean);
          break;
        case dataType.byte:
          encoder.addByte(value.value as number);
          break;
        case dataType.char:
          encoder.addChar(value.value as string);
          break;
        case dataType.short:
          encoder.addShort(value.value as number);
          break;
        case dataType.int:
          encoder.addInt(value.value as number);
          break;
        case dataType.long:
          encoder.addLong(value.value as bigint);
          break;
        case dataType.float:
          encoder.addFloat(value.value as number);
          break;
        case dataType.double:
          encoder.addDouble(value.value as number);
          break;
        case dataType.string:
          encoder.addString(value.value as string);
          break;
      }
    }

    encoder.prefixSize();

    return encoder.getBuffer();
  }
}
