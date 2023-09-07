import { BinaryDecoder } from "./BinaryDecoder.ts";
import { CommandType } from "./messages/BaseMessage.ts";
import { WireFormatInfo } from "./messages/WireFormatInfo.ts";

export const readLoop = async (connection: Deno.TcpConn) => {
  const packetLengthBuffer = new Uint8Array(4);

  while (true) {
    await connection.read(packetLengthBuffer);
    const decoder = new BinaryDecoder(packetLengthBuffer);
    const packetLength = decoder.readInt(true);

    if (packetLength) {
      const response = new Uint8Array(packetLength);

      await connection.read(response);

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
    case CommandType.WIREFORMAT_INFO: {
      const packet = new WireFormatInfo().decode(decoder);
      console.log(packet);
      break;
    }

    case CommandType.BROKER_INFO:
    case CommandType.CONNECTION_INFO:
    case CommandType.SESSION_INFO:
    case CommandType.CONSUMER_INFO:
    case CommandType.PRODUCER_INFO:
    case CommandType.TRANSACTION_INFO:
    case CommandType.DESTINATION_INFO:
    case CommandType.REMOVE_SUBSCRIPTION_INFO:
    case CommandType.KEEP_ALIVE_INFO:
    case CommandType.SHUTDOWN_INFO:
    case CommandType.REMOVE_INFO:
    case CommandType.CONTROL_COMMAND:
    case CommandType.FLUSH_COMMAND:
    case CommandType.CONNECTION_ERROR:
    case CommandType.CONSUMER_CONTROL:
    case CommandType.CONNECTION_CONTROL:
    case CommandType.MESSAGE_DISPATCH:
    case CommandType.MESSAGE_ACK:
    case CommandType.ACTIVEMQ_MESSAGE:
    case CommandType.ACTIVEMQ_BYTES_MESSAGE:
    case CommandType.ACTIVEMQ_MAP_MESSAGE:
    case CommandType.ACTIVEMQ_OBJECT_MESSAGE:
    case CommandType.ACTIVEMQ_STREAM_MESSAGE:
    case CommandType.ACTIVEMQ_TEXT_MESSAGE:
    case CommandType.RESPONSE:
    case CommandType.EXCEPTION_RESPONSE:
    case CommandType.DATA_RESPONSE:
    case CommandType.DATA_ARRAY_RESPONSE:
    case CommandType.INTEGER_RESPONSE:
    case CommandType.DISCOVERY_EVENT:
    case CommandType.JOURNAL_ACK:
    case CommandType.JOURNAL_REMOVE:
    case CommandType.JOURNAL_TRACE:
    case CommandType.JOURNAL_TRANSACTION:
    case CommandType.DURABLE_SUBSCRIPTION_INFO:
    case CommandType.PARTIAL_COMMAND:
    case CommandType.PARTIAL_LAST_COMMAND:
    case CommandType.REPLAY:
    case CommandType.BYTE_TYPE:
    case CommandType.CHAR_TYPE:
    case CommandType.SHORT_TYPE:
    case CommandType.INTEGER_TYPE:
    case CommandType.LONG_TYPE:
    case CommandType.DOUBLE_TYPE:
    case CommandType.FLOAT_TYPE:
    case CommandType.STRING_TYPE:
    case CommandType.BOOLEAN_TYPE:
    case CommandType.BYTE_ARRAY_TYPE:
    case CommandType.MESSAGE_DISPATCH_NOTIFICATION:
    case CommandType.NETWORK_BRIDGE_FILTER:
    case CommandType.ACTIVEMQ_QUEUE:
    case CommandType.ACTIVEMQ_TOPIC:
    case CommandType.ACTIVEMQ_TEMP_QUEUE:
    case CommandType.ACTIVEMQ_TEMP_TOPIC:
    case CommandType.MESSAGE_ID:
    case CommandType.ACTIVEMQ_LOCAL_TRANSACTION_ID:
    case CommandType.ACTIVEMQ_XA_TRANSACTION_ID:
    case CommandType.CONNECTION_ID:
    case CommandType.SESSION_ID:
    case CommandType.CONSUMER_ID:
    case CommandType.PRODUCER_ID:
    case CommandType.BROKER_ID:
  }
};
