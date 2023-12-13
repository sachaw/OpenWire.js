import { BinaryDecoder } from "../BinaryDecoder.js";
import { BinaryEncoder } from "../BinaryEncoder.js";
import { Base } from "./Base.js";
import { DataType, DataTypeMappings, Properties } from "./BaseMessage.js";

type Values<T extends Properties> = {
  [Key in keyof T]: DataTypeMappings[T[Key]];
};

export class PrimitiveMap<T extends Properties> extends Base {
  structure: Properties;
  values: Values<T>;

  constructor(structure: Properties, values: Values<T>) {
    super();
    this.structure = structure;
    this.values = values;
  }

  public encode(): Uint8Array {
    const encoder = new BinaryEncoder();

    encoder.addInt(Object.keys(this.values).length, true);

    for (const key in this.structure) {
      encoder.addString(key, true);
      switch (this.structure[key]) {
        case DataType.Bool: {
          encoder.addBoolean(this.values[key] as boolean);
          break;
        }
        case DataType.Byte: {
          encoder.addByte(this.values[key] as number);
          break;
        }
        case DataType.Char: {
          encoder.addChar(this.values[key] as string);
          break;
        }
        case DataType.Short: {
          encoder.addShort(this.values[key] as number);
          break;
        }
        case DataType.Int: {
          encoder.addInt(this.values[key] as number);
          break;
        }
        case DataType.Long: {
          encoder.addLong(this.values[key] as bigint);
          break;
        }
        case DataType.Float: {
          encoder.addFloat(this.values[key] as number);
          break;
        }
        case DataType.Double: {
          encoder.addDouble(this.values[key] as number);
          break;
        }
        case DataType.String: {
          encoder.addString(this.values[key] as string);
          break;
        }
        default: {
          console.log(this.values[key]);

          throw new Error("Invalid data type");
        }
      }
    }

    encoder.prefixSize();

    return encoder.getBuffer();
  }

  public decode(data: Uint8Array) {
    const decoder = new BinaryDecoder(data);
    throw new Error("Method not implemented.");
  }
}
