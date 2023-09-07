import { readLoop } from "./src/utils.ts";
import { dataType } from "./src/BinaryEncoder.ts";
import { Properties } from "./src/messages/BaseMessage.ts";
import { WireFormatInfo } from "./src/messages/WireFormatInfo.ts";

//Create socket connection to ActiveMQ server
const connection = await Deno.connect({
  port: 61616,
  hostname: "192.168.48.3",
});

export const uint8arrayToHexArray = (uint8array: Uint8Array): string[] => {
  return Array.from(uint8array).map((byte) =>
    `0x${byte.toString(16).padStart(2, "0")}`
  );
};

const exampleProperties: Properties = new Map([
  ["TcpNoDelayEnabled", {
    type: dataType.bool,
    value: true,
  }],
  ["SizePrefixDisabled", {
    type: dataType.bool,
    value: false,
  }],
  ["CacheSize", {
    type: dataType.int,
    value: 1024,
  }],
  ["ProviderName", {
    type: dataType.string,
    value: "ActiveMQ",
  }],
  ["StackTraceEnabled", {
    type: dataType.bool,
    value: true,
  }],
  ["PlatformDetails", {
    type: dataType.string,
    value: "Java",
  }],
  ["CacheEnabled", {
    type: dataType.bool,
    value: true,
  }],
  ["TightEncodingEnabled", {
    type: dataType.bool,
    value: false,
  }],
  ["MaxFrameSize", {
    type: dataType.long,
    value: 104857600n,
  }],
  ["MaxInactivityDuration", {
    type: dataType.long,
    value: 30000n,
  }],
  ["MaxInactivityDurationInitalDelay", {
    type: dataType.long,
    value: 10000n,
  }],
  ["ProviderVersion", {
    type: dataType.string,
    value: "5.15.8",
  }],
]);

const data = new WireFormatInfo(exampleProperties).encode();

await connection.write(data);

readLoop(connection);
