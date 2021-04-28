export type UUID = string;

export type Note = {
  date: string;
  text: string;
  url: string;
};

export type SyncStorageData = Record<UUID, Note>;

export type NoteRecord = { uuid: UUID; note: Note };

export enum EventMessages {
  UpdateUrl = 'UPDATE_URL',
  NoteChange = 'NOTE_CHANGE',
}
