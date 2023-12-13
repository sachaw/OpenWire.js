import { Socket } from "node:net";
import { BinaryDecoder } from "./BinaryDecoder.js";
import { CommandType, DataType } from "./messages/BaseMessage.js";
import { BrokerInfo } from "./messages/old/BrokerInfo.js";
import { WireFormatInfo } from "./messages/old/WireFormatInfo.js";

export const readLoop = async (connection: Socket) => {
  while (false) {
    const packetLengthBuffer = await connection.read(4);
    const decoder = new BinaryDecoder(packetLengthBuffer);
    const packetLength = decoder.readInt(false);

    if (packetLength) {
      const response = await connection.read(packetLength);

      handlePacket(response);
    }

    packetLengthBuffer.fill(0);

    //delay for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

const handlePacket = (buffer: Uint8Array) => {
  const decoder = new BinaryDecoder(buffer);

  //get the command type
  const command = decoder.readByte(true) as CommandType;

  switch (command) {
    case CommandType.WireformatInfo: {
      console.log(`WireFormatInfo, size: ${buffer.length}`);
      // const packet =
      new WireFormatInfo().decode(decoder);
      // console.log(packet);

      break;
    }

    case CommandType.BrokerInfo: {
      console.log(`BrokerInfo, size: ${buffer.length}`);

      const packet = new BrokerInfo().decode(decoder);
      console.log(packet);
      break;
    }
    case CommandType.ConnectionInfo:
    case CommandType.SessionInfo:
    case CommandType.ConsumerInfo:
    case CommandType.ProducerInfo:
    case CommandType.TransactionInfo:
    case CommandType.DestinationInfo:
    case CommandType.RemoveSubscriptionInfo:
    case CommandType.KeepAliveInfo:
    case CommandType.ShutdownInfo:
    case CommandType.RemoveInfo:
    case CommandType.ControlCommand:
    case CommandType.FlushCommand:
    case CommandType.ConnectionError:
    case CommandType.ConsumerControl:
    case CommandType.ConnectionControl:
    case CommandType.MessageDispatch:
    case CommandType.MessageAck:
    case CommandType.ActiveMqMessage:
    case CommandType.ActiveMqBytesMessage:
    case CommandType.ActiveMqMapMessage:
    case CommandType.ActiveMqObjectMessage:
    case CommandType.ActiveMqStreamMessage:
    case CommandType.ActiveMqTextMessage:
    case CommandType.Response:
    case CommandType.ExceptionResponse:
    case CommandType.DataResponse:
    case CommandType.DataArrayResponse:
    case CommandType.IntegerResponse:
    case CommandType.DiscoveryEvent:
    case CommandType.JournalAck:
    case CommandType.JournalRemove:
    case CommandType.JournalTrace:
    case CommandType.JournalTransaction:
    case CommandType.DurableSubscriptionInfo:
    case CommandType.PartialCommand:
    case CommandType.PartialLastCommand:
    case CommandType.Replay:
    case CommandType.ByteType:
    case CommandType.CharType:
    case CommandType.ShortType:
    case CommandType.IntegerType:
    case CommandType.LongType:
    case CommandType.DoubleType:
    case CommandType.FloatType:
    case CommandType.StringType:
    case CommandType.BooleanType:
    case CommandType.ByteArrayType:
    case CommandType.MessageDispatchNotification:
    case CommandType.NetworkBridgeFilter:
    case CommandType.ActiveMqQueue:
    case CommandType.ActiveMqTopic:
    case CommandType.ActiveMqTempQueue:
    case CommandType.ActiveMqTempTopic:
    case CommandType.MessageId:
    case CommandType.ActiveMqLocalTransactionId:
    case CommandType.ActiveMqXaTransactionId:
    case CommandType.ConnectionId:
    case CommandType.SessionId:
    case CommandType.ConsimerId:
    case CommandType.ProducerId:
    case CommandType.BrokerId:
  }
};

type typeMap<T extends DataType> = T extends DataType.Bool
  ? boolean
  : T extends DataType.Byte
    ? number
    : T extends DataType.Char
      ? string
      : T extends DataType.Short
        ? number
        : T extends DataType.Int
          ? number
          : T extends DataType.Long
            ? bigint
            : T extends DataType.Float
              ? number
              : T extends DataType.Double
                ? number
                : T extends DataType.String
                  ? string
                  : never;

export const SerializeType = <T extends DataType>(
  type: T,
  data: typeMap<T>,
) => {
  switch (type) {
    /**
     * Boolean, 1 byte
     */
    case DataType.Bool:
      return new Uint8Array([data ? 1 : 0]);

    /**
     * Byte, 1 byte
     */
    case DataType.Byte:
      return new Uint8Array([data as number]);

    /**
     * Char, 2 bytes
     */
    case DataType.Char: {
      const buffer = new ArrayBuffer(2);
      const view = new DataView(buffer);
      view.setUint16(0, (data as string).charCodeAt(0), false);
      return new Uint8Array(buffer);
    }

    /**
     * Short, 2 bytes
     */
    case DataType.Short: {
      const buffer = new ArrayBuffer(2);
      const view = new DataView(buffer);
      view.setInt16(0, data as number, false);
      return new Uint8Array(buffer);
    }

    /**
     * Int, 4 bytes
     */
    case DataType.Int: {
      const buffer = new ArrayBuffer(4);
      const view = new DataView(buffer);
      view.setInt32(0, data as number, false);
      return new Uint8Array(buffer);
    }

    /**
     * Long, 8 bytes
     */
    case DataType.Long: {
      const buffer = new ArrayBuffer(8);
      const view = new DataView(buffer);
      view.setBigInt64(0, data as bigint, false);
      return new Uint8Array(buffer);
    }

    /**
     * Float, 4 bytes
     */
    case DataType.Float: {
      const buffer = new ArrayBuffer(4);
      const view = new DataView(buffer);
      view.setFloat32(0, data as number, false);
      return new Uint8Array(buffer);
    }

    /**
     * Double, 8 bytes
     */
    case DataType.Double: {
      const buffer = new ArrayBuffer(8);
      const view = new DataView(buffer);
      view.setFloat64(0, data as number, false);
      return new Uint8Array(buffer);
    }

    /**
     * String, 2 bytes + string length
     */
    case DataType.String: {
      const string = data as string;
      const buffer = new ArrayBuffer(2 + string.length);
      const view = new DataView(buffer);
      view.setInt16(0, string.length, false);

      for (let i = 0; i < string.length; i++) {
        view.setUint8(2 + i, string.charCodeAt(i));
      }

      return new Uint8Array(buffer);
    }

    /**
     * Sohould not be used
     */
    case DataType.external:
      throw new Error("External data type is not supported");
  }
};

export const DeserializeType = <T extends DataType>(
  type: T,
  data: Uint8Array,
): typeMap<T> => {
  const view = new DataView(data.buffer);

  switch (type) {
    /**
     * Boolean, 1 byte
     */
    case DataType.Bool:
      return (data[0] === 1) as typeMap<T>;

    /**
     * Byte, 1 byte
     */
    case DataType.Byte:
      return data[0] as typeMap<T>;

    /**
     * Char, 2 bytes
     */
    case DataType.Char: {
      return String.fromCharCode(view.getUint16(0, false)) as typeMap<T>;
    }

    /**
     * Short, 2 bytes
     */
    case DataType.Short: {
      return view.getInt16(0, false) as typeMap<T>;
    }

    /**
     * Int, 4 bytes
     */
    case DataType.Int: {
      return view.getInt32(0, false) as typeMap<T>;
    }

    /**
     * Long, 8 bytes
     */
    case DataType.Long: {
      return view.getInt32(0, false) as typeMap<T>;
    }

    /**
     * Float, 4 bytes
     */
    case DataType.Float: {
      return view.getFloat32(0, false) as typeMap<T>;
    }

    /**
     * Double, 8 bytes
     */
    case DataType.Double: {
      return view.getFloat64(0, false) as typeMap<T>;
    }

    /**
     * String, 2 bytes + string length
     */
    case DataType.String: {
      const length = view.getInt16(0, false);
      const string = new Uint8Array(data.buffer.slice(2, length + 2));
      return String.fromCharCode(...string) as typeMap<T>;
    }

    /**
     * Sohould not be used
     */
    case DataType.external:
      throw new Error("External data type is not supported");
  }

  throw new Error(`Invalid data type ${type}`);
};
