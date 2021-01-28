import * as React from 'react';

import { NoteRecord } from '../types';

type NoteProps = {
  noteRecord: NoteRecord;
  handleDelete(id: string): void;
};

const Note = ({ noteRecord, handleDelete }: NoteProps) => {
  const { date, note, url, id } = noteRecord;
  return (
    <div>
      <p>{note}</p>
      <div>
        <p>{date}</p>
        <p>{url}</p>
      </div>
      <button onClick={() => handleDelete(id)}></button>
    </div>
  );
};

export default Note;
