import * as React from 'react';

import { NoteRecord } from '../types';
import { isValidUrl } from '../utils';
import Note from './Note';

type NotesProps = {
  notesCollection: NoteRecord[];
  url: string;
  handleDelete(id: string): void;
};

const Notes = ({ notesCollection, handleDelete, url }: NotesProps) => {
  let notesToProcess = notesCollection;

  if (isValidUrl(url)) {
    const processedURL = new URL(url);
    notesToProcess = notesToProcess.filter((note) => {
      const noteUrl = new URL(note.url);
      return processedURL.hostname === noteUrl.hostname;
    });
  }

  const processedNotesElement = notesToProcess.map((noteRecord) => (
    <Note noteRecord={noteRecord} handleDelete={handleDelete} />
  ));

  return <div>{processedNotesElement}</div>;
};

export default Notes;
