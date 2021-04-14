export type UUID = string;

export type NoteRecord = {
  date: string;
  note: string;
  url: string;
}

export type SyncStorageData = Record<UUID, NoteRecord>;

export type NoteInfo = [uuid: UUID, noteRecord: NoteRecord];

export enum EventMessages {
  UpdateUrl = 'UPDATE_URL',
  NoteChange = 'NOTE_CHANGE'
}