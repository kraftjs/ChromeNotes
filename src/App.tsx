import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

import Heading from './components/Heading';
import NoteCount from './components/NoteCount';
import NoteForm from './components/NoteForm';
import Notes from './components/Notes';

import { NoteRecord, NoteInfo, SyncStorageData } from './types';
import { isValidUrl } from './utils';

const { useEffect, useState } = React;

const App = () => {
  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [notes, setNotes] = useState<NoteInfo[]>([]);
  const [notesToShow, setNotesToShow] = useState<NoteInfo[]>([]);

  chrome.runtime.onMessage.addListener((message: string) => {
    console.log(message);
    if (message === 'updateURL') {
      updateUrl();
    }
  });

  useEffect(() => {
    chrome.storage.sync.get(null, (data: SyncStorageData) => {
      const notes: NoteInfo[] = Object.entries(data);
      setNotes(notes);
    });
    updateUrl();
  }, []);

  useEffect(() => {
    let filteredNotes = notes;
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
    chrome.runtime.sendMessage('noteChange');
  }, [notes]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (text.length === 0 || text.replace(/\s/g, '').length === 0) {
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
      date: new Date().toJSON(),
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
  };

  const handleDelete = (uuid: string) => {
    chrome.storage.sync.remove(uuid, () => {
      const filteredNotes = notes.filter(([id]) => id !== uuid);
      setNotes(filteredNotes);
    });
  };

  const handleFilterNotes = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowAll(!showAll);
  };

  const handleShowNoteForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowForm(true);
  };

  const handleCancelNote = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowForm(false);
    setText('');
  };

  const updateUrl = () => {
    chrome.tabs.query(
      { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
      (tabs) => {
        setUrl(tabs[0].url || '');
      },
    );
  };

  return (
    <React.Fragment>
      <Heading />
      {showForm ? (
        <NoteForm
          text={text}
          handleChange={handleTextChange}
          handleSubmit={handleSubmit}
          handleCancel={handleCancelNote}
        />
      ) : (
        <Notes
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

export default App;
