import * as React from 'react';

import { NoteInfo } from '../types';
import Note from './Note';

import './Notes.css';

const { useEffect, useState } = React;

type NotesProps = {
  notes: NoteInfo[];
  handleDelete(uuid: string): void;
  handleShowFormClick(e: React.MouseEvent<HTMLButtonElement>): void;
  handleFilterClick(e: React.MouseEvent<HTMLButtonElement>): void;
  isFiltered: boolean;
};

const Notes = ({
  notes,
  handleDelete,
  handleShowFormClick,
  handleFilterClick,
  isFiltered,
}: NotesProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<NoteInfo[]>([]);

  useEffect(() => {
    console.log('searchQuery:', searchQuery);
    console.log('notes:', notes);
    const newFilteredNotes = notes.filter(([uuid, noteRecord]) => {
      return noteRecord.url.includes(searchQuery);
    });
    setFilteredNotes(newFilteredNotes);
  }, [searchQuery, notes]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalizedQuery = e.target.value.trim().toLowerCase();
    setSearchQuery(normalizedQuery);
  };

  const createNotesElement = (notes: NoteInfo[]) => {
    return notes.map(([uuid, noteRecord]) => {
      return (
        <Note
          key={uuid}
          noteRecord={noteRecord}
          handleDelete={() => handleDelete(uuid)}
        />
      );
    });
  };

  return (
    <section id='notesDisplay'>
      <header>
        {isFiltered ? (
          <p>{'<NavBar />'}</p>
        ) : (
          <input
            type='search'
            placeholder='Search notes by URL'
            value={searchQuery}
            onChange={handleQueryChange}
          />
        )}
      </header>

      {filteredNotes.length ? (
        createNotesElement(filteredNotes)
      ) : (
        <p>{'NothingsHere.jpeg'}</p>
      )}

      <footer>
        <button type='button' onClick={handleShowFormClick}>
          Create note
        </button>
        <button type='button' onClick={handleFilterClick}>
          {isFiltered ? 'View all notes' : 'Filter notes'}
        </button>
      </footer>
    </section>
  );
};

export default Notes;
