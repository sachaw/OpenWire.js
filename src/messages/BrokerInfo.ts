import {
  BaseMessage,
  CommandType,
  Data,
  DataType,
  ExtendedDataType,
  MessageFields,
  Properties,
} from "./BaseMessage";

export const BrokerInfoFields = {
  brokerId: {
    version: 1,
    type: ExtendedDataType.BrokerId,
    auxilaryType: BrokerId,
  },
  brokerURL: {
    version: 1,
    type: DataType.String,
  },
  peerBrokerInfos: {
    version: 1,
    type: DataType.BrokerInfo[],
    auxilaryType: BrokerInfo,
  },
  brokerName: {
    version: 1,
    type: DataType.String,
  },
  slaveBroker: {
    version: 1,
    type: DataType.Bool,
  },
  masterBroker: {
    version: 1,
    type: DataType.Bool,
  },
  faultTolerantConfiguration: {
    version: 1,
    type: DataType.Bool,
  },
  duplexConnection: {
    version: 2,
    type: DataType.Bool,
  },
  networkConnection: {
    version: 2,
    type: DataType.Bool,
  },
  connectionId: {
    version: 2,
    type: DataType.Long,
  },
  brokerUploadUrl: {
    version: 3,
    type: DataType.String,
  },
  networkProperties: {
    version: 3,
    type: DataType.String,
  },
} as const satisfies MessageFields<Properties>;


export class BrokerInfo extends BaseMessage<typeof BrokerInfoFields> {
  protected commandId = CommandType.BrokerInfo;
  protected responseRequired = false;

  constructor(values?: Data<typeof BrokerInfoFields>) {
    super(BrokerInfoFields, values);
  }
}




