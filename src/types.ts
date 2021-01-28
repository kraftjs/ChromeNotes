export interface NoteRecord {
  date: string;
  note: string;
  url: string;
  id: string;
}

export interface SyncStorageData {
  notes?: NoteRecord[];
  [propName: string]: any;
}
