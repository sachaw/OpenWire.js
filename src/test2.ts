import { WireFormatInfo } from "./messages/WireFormatInfo.js";

const tmp = new WireFormatInfo({
  magic: new Uint8Array([0x41, 0x63, 0x74, 0x69, 0x76, 0x65, 0x4d, 0x51]), //ActiveMQ
  version: 12,
  data: true,
  properties: {
    TcpNoDelayEnabled: true,
    SizePrefixDisabled: false,
    CacheSize: 1024,
    ProviderName: "ActiveMQ",
    StackTraceEnabled: true,
    PlatformDetails: "Java",
    CacheEnabled: true,
    TightEncodingEnabled: true,
    MaxFrameSize: 104857600n,
    MaxInactivityDuration: 30000n,
    MaxInactivityDurationInitalDelay: 10000n,
    ProviderVersion: "5.15.8",
  },
});

const arrToHex = (arr: Uint8Array) => {
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
};

console.log(arrToHex(tmp.encode()));
