import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NoteInfo, NoteRecord, SyncStorageData, EventMessages } from '../types';
import Heading from './Heading';
import NoteCount from './NoteCount';
import NoteForm from './NoteForm';
import NotesPanel from './NotesPanel';

import './App.css';

const FORM_CHAR_LIMIT = 4000;

const App: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [notes, setNotes] = useState<NoteInfo[]>([]);
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
    if (!showAll && isValidUrl(url)) {
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
  }, [notes, showAll, url]);

  useEffect(() => {
    chrome.runtime.sendMessage(EventMessages.NoteChange);
  }, [notes]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (text.length > FORM_CHAR_LIMIT) {
      return;
    } else if (text.length === 0 || text.replace(/\s/g, '').length === 0) {
      setText('');
      const textarea = (e.target as HTMLFormElement).querySelector('textarea');
      textarea?.classList.add('invalidInput');
      textarea?.setAttribute('placeholder', 'The form is blank');
      textarea?.addEventListener(
        'focus',
        () => {
          textarea?.classList.remove('invalidInput');
          textarea?.removeAttribute('placeholder');
        },
        { once: true },
      );
      return;
    }

    const noteUrl = isValidUrl(url) ? url : '';
    const newNoteRecord: NoteRecord = {
      date: new Date().toLocaleString(),
      note: text,
      url: noteUrl,
    };

    const uuid = uuidv4();
    chrome.storage.sync.set({ [uuid]: newNoteRecord }, () => {
      const noteInfo: NoteInfo = [uuid, newNoteRecord];
      setNotes([noteInfo, ...notes]);
      setShowForm(false);
      setText('');
    });
  }

  function handleDelete(uuid: string) {
    chrome.storage.sync.remove(uuid, () => {
      const filteredNotes = notes.filter(([id]) => id !== uuid);
      setNotes(filteredNotes);
    });
  }

  function handleFilterNotes(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setShowAll(!showAll);
  }

  function handleShowNoteForm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setShowForm(true);
  }

  function handleCancelNote(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setShowForm(false);
    setText('');
  }

  return (
    <React.Fragment>
      <Heading />
      {showForm ? (
        <NoteForm
          text={text}
          handleChange={(e) => setText(e.target.value)}
          handleSubmit={handleSubmit}
          handleCancel={handleCancelNote}
          characterLimit={FORM_CHAR_LIMIT}
        />
      ) : (
        <NotesPanel
          notes={notesToShow}
          handleDelete={handleDelete}
          handleShowFormClick={handleShowNoteForm}
          handleFilterClick={handleFilterNotes}
          isFiltered={!showAll}
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
