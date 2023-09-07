import { BinaryDecoder } from "../BinaryDecoder.ts";
import { BinaryEncoder, dataType } from "../BinaryEncoder.ts";

export type Properties = Map<string, Property>;

export enum CommandType {
  WIREFORMAT_INFO = 1,
  BROKER_INFO = 2,
  CONNECTION_INFO = 3,
  SESSION_INFO = 4,
  CONSUMER_INFO = 5,
  PRODUCER_INFO = 6,
  TRANSACTION_INFO = 7,
  DESTINATION_INFO = 8,
  REMOVE_SUBSCRIPTION_INFO = 9,
  KEEP_ALIVE_INFO = 10,
  SHUTDOWN_INFO = 11,
  REMOVE_INFO = 12,
  CONTROL_COMMAND = 14,
  FLUSH_COMMAND = 15,
  CONNECTION_ERROR = 16,
  CONSUMER_CONTROL = 17,
  CONNECTION_CONTROL = 18,
  MESSAGE_DISPATCH = 21,
  MESSAGE_ACK = 22,
  ACTIVEMQ_MESSAGE = 23,
  ACTIVEMQ_BYTES_MESSAGE = 24,
  ACTIVEMQ_MAP_MESSAGE = 25,
  ACTIVEMQ_OBJECT_MESSAGE = 26,
  ACTIVEMQ_STREAM_MESSAGE = 27,
  ACTIVEMQ_TEXT_MESSAGE = 28,
  RESPONSE = 30,
  EXCEPTION_RESPONSE = 31,
  DATA_RESPONSE = 32,
  DATA_ARRAY_RESPONSE = 33,
  INTEGER_RESPONSE = 34,
  DISCOVERY_EVENT = 40,
  JOURNAL_ACK = 50,
  JOURNAL_REMOVE = 52,
  JOURNAL_TRACE = 53,
  JOURNAL_TRANSACTION = 54,
  DURABLE_SUBSCRIPTION_INFO = 55,
  PARTIAL_COMMAND = 60,
  PARTIAL_LAST_COMMAND = 61,
  REPLAY = 65,
  BYTE_TYPE = 70,
  CHAR_TYPE = 71,
  SHORT_TYPE = 72,
  INTEGER_TYPE = 73,
  LONG_TYPE = 74,
  DOUBLE_TYPE = 75,
  FLOAT_TYPE = 76,
  STRING_TYPE = 77,
  BOOLEAN_TYPE = 78,
  BYTE_ARRAY_TYPE = 79,
  MESSAGE_DISPATCH_NOTIFICATION = 90,
  NETWORK_BRIDGE_FILTER = 91,
  ACTIVEMQ_QUEUE = 100,
  ACTIVEMQ_TOPIC = 101,
  ACTIVEMQ_TEMP_QUEUE = 102,
  ACTIVEMQ_TEMP_TOPIC = 103,
  MESSAGE_ID = 110,
  ACTIVEMQ_LOCAL_TRANSACTION_ID = 111,
  ACTIVEMQ_XA_TRANSACTION_ID = 112,
  CONNECTION_ID = 120,
  SESSION_ID = 121,
  CONSUMER_ID = 122,
  PRODUCER_ID = 123,
  BROKER_ID = 124,
}

export interface Property {
  type: dataType;
  value: number | string | boolean | bigint;
}

export abstract class BaseMessage {
  public command: CommandType;
  public responseRequired: boolean;
  public properties: Properties;

  public abstract encode(): Uint8Array;
  public abstract decode(decoder: BinaryDecoder): void;

  constructor() {
    this.command = CommandType.WIREFORMAT_INFO;
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
