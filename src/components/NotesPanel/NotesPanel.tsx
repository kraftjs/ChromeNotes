import React, { useEffect, useState } from 'react';
import { NoteRecord, UUID } from '../../lib/types';
import isValidUrl from '../../lib/url-validator';
import NotesList from '../Notes';

import './NotesPanel.css';

type NotesPanelProps = {
  noteRecords: NoteRecord[];
  url: string;
  onDeleteNote: (uuid: UUID) => void;
  onDraftNewNote: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const NotesPanel: React.FC<NotesPanelProps> = ({
  noteRecords,
  url,
  onDeleteNote,
  onDraftNewNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notesToDisplay, setNotesToDisplay] = useState<NoteRecord[]>([]);
  const [showOnlyRelatedNotes, toggleshowOnlyRelatedNotes] = useState(true);

  useEffect(() => {
    console.log('searchQuery:', searchQuery);
    console.log('notes:', noteRecords);
    if (showOnlyRelatedNotes && isValidUrl(url)) {
      const relatedNotes = noteRecords.filter(({ note }) => {
        return new URL(note.url).hostname === new URL(url).hostname;
      });
      setNotesToDisplay(relatedNotes);
    } else {
      const filteredNotes = noteRecords.filter(({ note }) => {
        return note.url.includes(searchQuery);
      });
      setNotesToDisplay(filteredNotes);
    }
  }, [searchQuery, showOnlyRelatedNotes, noteRecords, url]);

  function handleQueryChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    const normalizedQuery = target.value.trim().toLowerCase();
    setSearchQuery(normalizedQuery);
  }

  return (
    <section id='notesPanel'>
      <header>
        {showOnlyRelatedNotes ? (
          <p>{'<NavBar />'}</p>
        ) : (
          <input
            type='search'
            placeholder='Search notes by URL'
            value={searchQuery}
            onChange={handleQueryChange}
            className="query"
          />
        )}
      </header>

      <NotesList noteRecords={notesToDisplay} onDeleteNote={onDeleteNote} />

      <footer>
        <button type='button' onClick={onDraftNewNote}>
          Create note
        </button>
        <button type='button' onClick={() => toggleshowOnlyRelatedNotes(!showOnlyRelatedNotes)}>
          {showOnlyRelatedNotes ? 'View all notes' : 'Filter notes'}
        </button>
      </footer>
    </section>
  );
};

export default NotesPanel;
