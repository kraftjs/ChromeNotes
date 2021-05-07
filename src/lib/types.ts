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

export const isNote = (object: any): object is Note =>
  !!object && 'date' in object && 'text' in object && 'url' in object;
