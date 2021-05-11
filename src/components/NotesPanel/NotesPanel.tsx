import React, { useEffect, useState } from 'react';
import { Note, NoteRecord, UUID } from '../../lib/types';
import isValidUrl from '../../lib/url-validator';
import NotesList from '../Notes';

import './NotesPanel.css';

type NotesPanelProps = {
  noteRecords: NoteRecord[];
  url: string;
  onEditNote: (uuid: UUID, note: Note) => void;
  onDeleteNote: (uuid: UUID) => void;
  onDraftNewNote: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const NotesPanel: React.FC<NotesPanelProps> = ({
  noteRecords,
  url,
  onEditNote,
  onDeleteNote,
  onDraftNewNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notesToDisplay, setNotesToDisplay] = useState<NoteRecord[]>([]);
  const [baseUrlOfCurrentTab, setBaseUrlOfCurrentTab] = useState('');
  const [hoveredUrl, setHoveredUrl] = useState<string>('');

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

  function detectHoveredUrl(url: string) {
    setHoveredUrl(url);
  }

  const HoveredUrlAddress: React.FC<{ hoveredUrl: string }> = ({ hoveredUrl }) => {
    useEffect(() => {
      const wrapper = document.querySelector<HTMLDivElement>('.url-address-wrapper');
      if (wrapper) {
        wrapper.style.backgroundColor = hoveredUrl ? '#747676' : 'initial';
      }
    }, [hoveredUrl]);

    return (
      <div className='url-address-wrapper'>
        <p className='url-address'>{hoveredUrl}</p>
      </div>
    );
  };

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
        <NotesList
          noteRecords={notesToDisplay}
          onEditNote={onEditNote}
          onDeleteNote={onDeleteNote}
          onHoveredUrl={detectHoveredUrl}
        />
      </div>

      <footer>
        <button type='button' className='primary' onClick={onDraftNewNote}>
          Create note
        </button>
      </footer>
      <HoveredUrlAddress hoveredUrl={hoveredUrl} />
    </section>
  );
};

export default NotesPanel;
