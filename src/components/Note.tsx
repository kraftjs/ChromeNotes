import * as React from 'react';

import { NoteRecord } from '../types';

type NoteProps = {
  noteRecord: NoteRecord;
  handleDelete(): void;
};

const Note = ({ noteRecord, handleDelete }: NoteProps) => {
  const { date, note, url } = noteRecord;

  return (
    <div>
      <p>{note}</p>
      <div>
        <p>{date}</p>
        <p>{url}</p>
      </div>
      <button onClick={handleDelete}>Delete note</button>
    </div>
  );
};

export default Note;
