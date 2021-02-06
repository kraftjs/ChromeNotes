export interface NoteRecord {
  date: string;
  note: string;
  url: string;
}

export interface SyncStorageData {
  [uuid: string]: NoteRecord;
}

export type NoteInfo = [uuid: string, noteRecord: NoteRecord];
