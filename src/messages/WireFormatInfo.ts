import {
  BaseMessage,
  CommandType,
  Data,
  DataType,
  ExtendedDataType,
  MessageFields,
  Properties,
} from "./BaseMessage.js";

export const PropertiesType = {
  TcpNoDelayEnabled: DataType.Bool,
  SizePrefixDisabled: DataType.Bool,
  CacheSize: DataType.Int,
  ProviderName: DataType.String,
  StackTraceEnabled: DataType.Bool,
  PlatformDetails: DataType.String,
  CacheEnabled: DataType.Bool,
  TightEncodingEnabled: DataType.Bool,
  MaxFrameSize: DataType.Long,
  MaxInactivityDuration: DataType.Long,
  MaxInactivityDurationInitalDelay: DataType.Long,
  ProviderVersion: DataType.String,
} as const satisfies Properties;

export const WireFormatInfoFields = {
  magic: {
    version: 1,
    type: DataType.Raw,
  },
  version: {
    version: 1,
    type: DataType.Int,
  },
  data: {
    version: 1,
    type: DataType.Bool,
  },
  properties: {
    version: 1,
    type: ExtendedDataType.PrimitiveMap,
    auxilaryType: PropertiesType,
  },
} as const satisfies MessageFields<Properties>;

export class WireFormatInfo extends BaseMessage<typeof WireFormatInfoFields> {
  protected commandId = CommandType.WireformatInfo;
  protected responseRequired = false;

  constructor(values?: Data<typeof WireFormatInfoFields>) {
    super(WireFormatInfoFields, values);
  }
}
