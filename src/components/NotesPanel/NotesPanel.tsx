import React, { useEffect, useState } from 'react';
import { NoteInfo, UUID } from '../../lib/types';
import isValidUrl from '../../lib/url-validator';
import Note from './Note';

import './NotesPanel.css';

type NotesPanelProps = {
  notes: NoteInfo[];
  url: string;
  onDeleteNote: (uuid: UUID) => void;
  onDraftNewNote: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const NotesPanel: React.FC<NotesPanelProps> = ({
  notes,
  url,
  onDeleteNote,
  onDraftNewNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notesToDisplay, setNotesToDisplay] = useState<NoteInfo[]>([]);
  const [showOnlyRelatedNotes, toggleshowOnlyRelatedNotes] = useState(true);

  useEffect(() => {
    console.log('searchQuery:', searchQuery);
    console.log('notes:', notes);
    if (showOnlyRelatedNotes && isValidUrl(url)) {
      const relatedNotes = notes.filter(([, noteRecord]) => {
        return new URL(noteRecord.url).hostname === new URL(url).hostname;
      });
      setNotesToDisplay(relatedNotes);
    } else {
      const filteredNotes = notes.filter(([, noteRecord]) => {
        return noteRecord.url.includes(searchQuery);
      });
      setNotesToDisplay(filteredNotes);
    }
  }, [searchQuery, showOnlyRelatedNotes, notes, url]);

  function handleQueryChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    const normalizedQuery = target.value.trim().toLowerCase();
    setSearchQuery(normalizedQuery);
  }

  // TODO: Make a NotesList components
  function createNotesElement(notes: NoteInfo[]) {
    const notesElement = notes.map(([uuid, noteRecord]) => (
      <Note
        key={uuid}
        noteRecord={noteRecord}
        handleDeleteNote={() => onDeleteNote(uuid)}
      />
    ));

    return <ul>{notesElement}</ul>;
  }

  return (
    <section id='notesDisplay'>
      <header>
        {showOnlyRelatedNotes ? (
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

      {notesToDisplay ? (
        createNotesElement(notesToDisplay)
      ) : (
        <p>{'NothingsHere.jpeg'}</p>
      )}

      <footer>
        <button type='button' onClick={onDraftNewNote}>
          Create note
        </button>
        <button
          type='button'
          onClick={() => toggleshowOnlyRelatedNotes(!showOnlyRelatedNotes)}>
          {showOnlyRelatedNotes ? 'View all notes' : 'Filter notes'}
        </button>
      </footer>
    </section>
  );
};

export default NotesPanel;
