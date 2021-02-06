import * as React from 'react';

import { NoteInfo } from '../types';
import Note from './Note';

type NotesProps = {
  notes: NoteInfo[];
  handleDelete(uuid: string): void;
};

const Notes = ({ notes, handleDelete }: NotesProps) => {
  const noteElements = notes.map(([uuid, noteRecord]) => {
    return (
      <Note
        key={uuid}
        noteRecord={noteRecord}
        handleDelete={() => handleDelete(uuid)}
      />
    );
  });

  return <div id='notesDisplay'>{noteElements}</div>;
};

export default Notes;
