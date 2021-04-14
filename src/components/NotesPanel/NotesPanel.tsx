import React, { useEffect, useState } from 'react';
import { NoteInfo, UUID } from '../../types';
import Note from './Note';

import './NotesPanel.css';

type NotesPanelProps = {
  notes: NoteInfo[];
  handleDelete(uuid: UUID): void;
  handleShowFormClick(e: React.MouseEvent<HTMLButtonElement>): void;
  handleFilterClick(e: React.MouseEvent<HTMLButtonElement>): void;
  isFiltered: boolean;
};

const NotesPanel: React.FC<NotesPanelProps> = ({
  notes,
  handleDelete,
  handleShowFormClick,
  handleFilterClick,
  isFiltered,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<NoteInfo[]>([]);

  useEffect(() => {
    console.log('searchQuery:', searchQuery);
    console.log('notes:', notes);
    const newFilteredNotes = notes.filter(([_uuid, noteRecord]) => {
      return noteRecord.url.includes(searchQuery);
    });
    setFilteredNotes(newFilteredNotes);
  }, [searchQuery, notes]);

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const normalizedQuery = e.target.value.trim().toLowerCase();
    setSearchQuery(normalizedQuery);
  }

  function createNotesElement(notes: NoteInfo[]) {
    const notesElement = notes.map(([uuid, noteRecord]) => (
      <Note
        key={uuid}
        noteRecord={noteRecord}
        handleDelete={() => handleDelete(uuid)}
      />
    ));

    return <ul>{notesElement}</ul>;
  }

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

export default NotesPanel;
