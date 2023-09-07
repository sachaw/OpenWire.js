import { BinaryEncoder, dataType } from "./BinaryEncoder.ts";

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

interface Property {
  value: boolean | number | bigint | string;
  type: dataType;
}

export type PropertiesTree = Set<([string, Property])>;

// export interface PropertiesTree {
//   [key: string]: Property;
// }

export class Packet {
  public littleEndian = false;
  public version: number;
  public command: CommandType;
  public properties: PropertiesTree;
  public magic = new Uint8Array([
    0x41,
    0x63,
    0x74,
    0x69,
    0x76,
    0x65,
    0x4d,
    0x51,
  ]); //ActiveMQ

  constructor(
    version: number,
    command: CommandType,
    properties: PropertiesTree,
  ) {
    this.version = version;
    this.command = command;
    this.properties = properties;
  }

  // public encode() {
  //   const header = new BinaryEncoder(false);

  //   header.addByte(this.command, true).addRaw(this.magic)
  //     .addInt(
  //       this.version,
  //       true,
  //     )
  //     .addByte(1, true);

  //   const objects = new BinaryEncoder();

  //   const objectLength = new Uint8Array(4);
  //   const objectLengthView = new DataView(objectLength.buffer);
  //   objectLengthView.setInt32(0, objects.getBuffer().length, this.littleEndian);

  //   const packet = new Uint8Array(
  //     [
  //       ...header.getBuffer(),
  //       ...objectLength,
  //       ...objects.getBuffer(),
  //     ],
  //   );

  //   //prepend packet length
  //   const packetLength = new Uint8Array(4);
  //   const packetLengthView = new DataView(packetLength.buffer);
  //   packetLengthView.setUint32(0, packet.length, this.littleEndian);

  //   return new Uint8Array([
  //     ...packetLength,
  //     ...packet,
  //   ]);
  // }
}
