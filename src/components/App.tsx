import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NoteInfo, NoteRecord, SyncStorageData, EventMessages, UUID } from '../lib/types';
import isValidUrl from '../lib/url-validator';
import Heading from './Heading';
import NoteCount from './NoteCount';
import NoteForm from './NoteForm';
import NotesPanel from './NotesPanel';

import './App.css';

const NOTE_CHAR_LIMIT = 4000;

const App: React.FC = () => {
  const [notes, setNotes] = useState<NoteInfo[]>([]);
  const [url, setUrl] = useState('');
  const [showForm, setShowForm] = useState(false);

  chrome.runtime.onMessage.addListener((message: string) => {
    console.log(message);
    if (message === EventMessages.UpdateUrl) {
      chrome.tabs.query(
        { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
        (tabs) => {
          setUrl(tabs[0].url || '');
        },
      );
    }
  });

  useEffect(() => {
    chrome.storage.sync.get(null, (data: SyncStorageData) => {
      const notes: NoteInfo[] = Object.entries(data);
      setNotes(notes);
    });

    chrome.tabs.query(
      { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
      (tabs) => {
        setUrl(tabs[0].url || '');
      },
    );
  }, []);

  useEffect(() => {
    chrome.runtime.sendMessage(EventMessages.NoteChange);
  }, [notes]);

  function saveNote(text: string) {
    const uuid: UUID = uuidv4();
    const noteUrl = isValidUrl(url) ? url : '';
    const newNoteRecord: NoteRecord = {
      date: new Date().toLocaleString(),
      note: text,
      url: noteUrl,
    };

    chrome.storage.sync.set({ [uuid]: newNoteRecord }, () => {
      const noteInfo: NoteInfo = [uuid, newNoteRecord];
      setNotes([noteInfo, ...notes]);
      setShowForm(false);
    });
  }

  function deleteNote(uuid: UUID) {
    chrome.storage.sync.remove(uuid, () => {
      const filteredNotes = notes.filter(([id]) => id !== uuid);
      setNotes(filteredNotes);
    });
  }

  return (
    <React.Fragment>
      <Heading />
      {showForm ? (
        <NoteForm
          FORM_CHAR_LIMIT={NOTE_CHAR_LIMIT}
          onSaveNote={saveNote}
          onCancelNote={() => setShowForm(false)}
        />
      ) : (
        <NotesPanel
          notes={notes}
          url={url}
          onDeleteNote={deleteNote}
          onDraftNewNote={() => setShowForm(true)}
        />
      )}
      <NoteCount noteCount={notes.length} />
    </React.Fragment>
  );
};

export default App;
