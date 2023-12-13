import { BinaryEncoder } from "../BinaryEncoder.js";
import { Base } from "./Base.js";
import { PrimitiveMap } from "./PrimitiveMap.js";
import { WireFormatInfo } from "./WireFormatInfo.js";

interface BaseOpenWireField<T extends DataType> {
  type: T;
  version: number;
}

interface ExtendedOpenWireField<T extends ExtendedDataType> {
  type: T;
  auxilaryType: Properties;
  version: number;
}

type OpenWireField<T extends CombinedDataType> = T extends DataType
  ? BaseOpenWireField<T>
  : T extends ExtendedDataType
    ? ExtendedOpenWireField<T>
    : never;

export enum CommandType {
  WireformatInfo = 1,
  BrokerInfo = 2,
  ConnectionInfo = 3,
  SessionInfo = 4,
  ConsumerInfo = 5,
  ProducerInfo = 6,
  TransactionInfo = 7,
  DestinationInfo = 8,
  RemoveSubscriptionInfo = 9,
  KeepAliveInfo = 10,
  ShutdownInfo = 11,
  RemoveInfo = 12,
  ControlCommand = 14,
  FlushCommand = 15,
  ConnectionError = 16,
  ConsumerControl = 17,
  ConnectionControl = 18,
  MessageDispatch = 21,
  MessageAck = 22,
  ActiveMqMessage = 23,
  ActiveMqBytesMessage = 24,
  ActiveMqMapMessage = 25,
  ActiveMqObjectMessage = 26,
  ActiveMqStreamMessage = 27,
  ActiveMqTextMessage = 28,
  Response = 30,
  ExceptionResponse = 31,
  DataResponse = 32,
  DataArrayResponse = 33,
  IntegerResponse = 34,
  DiscoveryEvent = 40,
  JournalAck = 50,
  JournalRemove = 52,
  JournalTrace = 53,
  JournalTransaction = 54,
  DurableSubscriptionInfo = 55,
  PartialCommand = 60,
  PartialLastCommand = 61,
  Replay = 65,
  ByteType = 70,
  CharType = 71,
  ShortType = 72,
  IntegerType = 73,
  LongType = 74,
  DoubleType = 75,
  FloatType = 76,
  StringType = 77,
  BooleanType = 78,
  ByteArrayType = 79,
  MessageDispatchNotification = 90,
  NetworkBridgeFilter = 91,
  ActiveMqQueue = 100,
  ActiveMqTopic = 101,
  ActiveMqTempQueue = 102,
  ActiveMqTempTopic = 103,
  MessageId = 110,
  ActiveMqLocalTransactionId = 111,
  ActiveMqXaTransactionId = 112,
  ConnectionId = 120,
  SessionId = 121,
  ConsimerId = 122,
  ProducerId = 123,
  BrokerId = 124,
}

export enum DataType {
  Bool = 0x01,
  Byte = 0x02,
  Char = 0x03,
  Short = 0x04,
  Int = 0x05,
  Long = 0x06,
  Float = 0x07,
  Double = 0x08,
  String = 0x09,
  Raw = 0x0a,
}

export enum ExtendedDataType {
  //start at 0x0b
  WireFormatInfo = 0x0b,
  PrimitiveMap = 0x0c,
}

export type CombinedDataType = DataType | ExtendedDataType;

export interface DataTypeMappings<T extends Properties = Properties> {
  [DataType.Bool]: boolean;
  [DataType.Byte]: number;
  [DataType.Char]: string;
  [DataType.Short]: number;
  [DataType.Int]: number;
  [DataType.Long]: bigint;
  [DataType.Float]: number;
  [DataType.Double]: number;
  [DataType.String]: string;
  [DataType.Raw]: Uint8Array;
  [ExtendedDataType.WireFormatInfo]: WireFormatInfo;
  [ExtendedDataType.PrimitiveMap]: Data<MessageFields<T>>;
}

export type MessageFields<T extends Properties> = {
  [Key in keyof T]: OpenWireField<T[Key]>;
};

export type Properties = Record<string, CombinedDataType>;

export type Data<T extends MessageFields<Properties>> = {
  [Key in keyof T]: T[Key] extends ExtendedOpenWireField<infer U>
    ? DataTypeMappings<T[Key]["auxilaryType"]>[U]
    : DataTypeMappings[T[Key]["type"]];
};

export abstract class BaseMessage<
  T extends MessageFields<Properties>,
> extends Base {
  structure: T;
  values?: Data<T>;
  protected abstract commandId: CommandType;
  protected abstract responseRequired: boolean;

  constructor(structure: T, values?: Data<T>) {
    super();
    this.structure = structure;
    this.values = values;
  }

  public encode(): Uint8Array {
    if (!this.values) {
      throw new Error("No values to encode");
    }
    const encoder = new BinaryEncoder();

    encoder.addByte(this.commandId, true);

    for (const field in this.structure) {
      const value = this.values[field];
      const fieldInfo = this.structure[field];

      switch (fieldInfo.type) {
        case DataType.Bool: {
          encoder.addBoolean(value as boolean, true);
          break;
        }

        case DataType.Byte: {
          encoder.addByte(value as number, true);
          break;
        }

        case DataType.Char: {
          encoder.addChar(value as string, true);
          break;
        }

        case DataType.Short: {
          encoder.addShort(value as number, true);
          break;
        }

        case DataType.Int: {
          encoder.addInt(value as number, true);
          break;
        }

        case DataType.Long: {
          encoder.addLong(value as bigint, true);
          break;
        }

        case DataType.Float: {
          encoder.addFloat(value as number, true);
          break;
        }

        case DataType.Double: {
          encoder.addDouble(value as number, true);
          break;
        }

        case DataType.String: {
          encoder.addString(value as string, true);
          break;
        }

        case DataType.Raw: {
          encoder.addRaw(value as Uint8Array);
          break;
        }

        case ExtendedDataType.PrimitiveMap: {
          const map = new PrimitiveMap(fieldInfo.auxilaryType, value);
          encoder.addRaw(map.encode());
          break;
        }

        default: {
          console.log(fieldInfo.type);

          throw new Error("Invalid data type");
        }
      }
    }
    return encoder.prefixSize().getBuffer();
  }

  public decode(data: Uint8Array): Data<T> {
    throw new Error("Method not implemented.");
  }
}
