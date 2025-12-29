import { AVMTracesEventData, TealSourcesDebugEventData } from './debugging'

export enum EventType {
  TxnGroupSimulated = 'TxnGroupSimulated',
  AppCompiled = 'AppCompiled',
}

export type EventDataMap = {
  [EventType.TxnGroupSimulated]: AVMTracesEventData
  [EventType.AppCompiled]: TealSourcesDebugEventData
}
