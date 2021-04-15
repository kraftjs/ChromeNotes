import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NoteInfo, NoteRecord, SyncStorageData, EventMessages, UUID } from '../types';
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
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [notesToShow, setNotesToShow] = useState<NoteInfo[]>([]);

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
    let filteredNotes = [...notes];
    if (!showAllNotes && isValidUrl(url)) {
      filteredNotes = notes.filter(([, noteRecord]) => {
        if (!noteRecord.url) {
          return false;
        }
        const tabUrl = new URL(url);
        const noteUrl = new URL(noteRecord.url);
        return noteUrl.hostname === tabUrl.hostname;
      });
    }
    setNotesToShow(filteredNotes);
  }, [notes, showAllNotes, url]);

  useEffect(() => {
    chrome.runtime.sendMessage(EventMessages.NoteChange);
  }, [notes]);

  // TODO: double check this, as well as fix types
  function addNote(text: string) {
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

  function deleteNote(uuid: string) {
    chrome.storage.sync.remove(uuid, () => {
      const filteredNotes = notes.filter(([id]) => id !== uuid);
      setNotes(filteredNotes);
    });
  }

  // TODO: Might not need preventDefault -- then we can inline this function
  function handleFilterNotes(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setShowAllNotes(!showAllNotes);
  }

  function handleShowNoteForm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setShowForm(true);
  }

  // TODO: Might not need preventDefault -- then we can inline this function
  return (
    <React.Fragment>
      <Heading />
      {showForm ? (
        <NoteForm
          FORM_CHAR_LIMIT={NOTE_CHAR_LIMIT}
          onAddNote={addNote}
          onCancelNote={() => setShowForm(false)}
        />
      ) : (
        <NotesPanel
          notes={notesToShow}
          onDeleteNote={deleteNote}
          handleShowFormClick={handleShowNoteForm}
          handleFilterClick={handleFilterNotes}
          isFiltered={!showAllNotes}
        />
      )}
      <NoteCount noteCount={notes.length} />
    </React.Fragment>
  );
};

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
  } catch (error) {
    return false;
  }
  return true;
}

export default App;
