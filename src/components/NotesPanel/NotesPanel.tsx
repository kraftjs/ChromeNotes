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
  console.log('URL:', url);
  const [searchQuery, setSearchQuery] = useState('');
  const [notesToDisplay, setNotesToDisplay] = useState<NoteRecord[]>([]);
  const [baseUrlOfCurrentTab, setBaseUrlOfCurrentTab] = useState('');

  useEffect(() => {
    if (isValidUrl(url)) {
      const updatedUrl = new URL(url);
      let protocol = updatedUrl.protocol ? updatedUrl.protocol + '//' : '';
      let hostname = updatedUrl.hostname;
      setSearchQuery(protocol + hostname);
      setBaseUrlOfCurrentTab(protocol + hostname);
    }
  }, [url]);

  useEffect(() => {
    const filteredNotes = noteRecords.filter(({ note }) => {
      return note.url.includes(searchQuery);
    });
    setNotesToDisplay(filteredNotes);
  }, [searchQuery, noteRecords]);

  function handleQueryChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    const normalizedQuery = target.value.trim().toLowerCase();
    setSearchQuery(normalizedQuery);
  }

  return (
    <section id='notesPanel'>
      <header>
        <input
          type='search'
          spellCheck={false}
          placeholder='Search notes by URL'
          value={searchQuery}
          onChange={handleQueryChange}
          className='query'
        />
        <button
          type='button'
          onClick={() => (searchQuery ? setSearchQuery('') : setSearchQuery(baseUrlOfCurrentTab))}>
          {searchQuery ? 'clear query' : 'reset filter'}
        </button>
      </header>

      <div className='notes-list-wrapper'>
        <NotesList noteRecords={notesToDisplay} onDeleteNote={onDeleteNote} />
      </div>

      <footer>
        <button type='button' onClick={onDraftNewNote}>
          Create note
        </button>
      </footer>
    </section>
  );
};

export default NotesPanel;
