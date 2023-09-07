import { BinaryDecoder } from "../BinaryDecoder.ts";
import { BinaryEncoder } from "../BinaryEncoder.ts";
import { BaseMessage, CommandType, Properties } from "./BaseMessage.ts";

export class WireFormatInfo extends BaseMessage {
  public magic: Uint8Array;
  public version: number;
  public data: boolean;

  constructor(properties?: Properties) {
    super();
    this.command = CommandType.WIREFORMAT_INFO;
    this.magic = new Uint8Array([
      0x41,
      0x63,
      0x74,
      0x69,
      0x76,
      0x65,
      0x4d,
      0x51,
    ]); //ActiveMQ
    this.version = 1;
    this.data = true;
    this.properties = properties ?? new Map();
  }

  public decode(decoder: BinaryDecoder): WireFormatInfo {
    this.magic = decoder.readRaw(8);
    this.version = decoder.readInt(true);
    this.data = decoder.readBoolean(true);

    const propertiesLength = decoder.readInt(true);
    if (decoder.getLength() !== propertiesLength) {
      console.log(
        `Data size mismatch, expected ${propertiesLength} but got ${decoder.getLength()}`,
      );
    }

    this.decodeProperties(decoder);

    return this;
  }

  public encode(): Uint8Array {
    const encoder = new BinaryEncoder();
    encoder.addByte(this.command, true).addRaw(this.magic)
      .addInt(
        this.version,
        true,
      )
      .addBoolean(true, true)
      .addRaw(this.encodeProperties()).prefixSize();

    return encoder.getBuffer();
  }
}
