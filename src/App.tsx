import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const { useEffect, useState } = React;

import Heading from './components/Heading';
import NoteForm from './components/NoteForm';
import Notes from './components/Notes';

import { NoteRecord, NoteInfo, SyncStorageData } from './types';
import { isValidUrl } from './utils';

const App = () => {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [notes, setNotes] = useState<NoteInfo[]>([]);
  const [notesToShow, setNotesToShow] = useState<NoteInfo[]>([]);

  // chrome.runtime.onMessage.addListener((message: { url: string }) => {
  //   if (message.url) {
  //     if (isValidUrl(message.url)) {
  //       setUrl(new URL(message.url));
  //     } else {
  //       setUrl(new URL('chrome://newtab'));
  //     }
  //   }
  // });

  useEffect(() => {
    chrome.storage.sync.get(null, (data: SyncStorageData) => {
      const notes: NoteInfo[] = Object.entries(data);
      setNotes(notes);
    });
  }, []);

  useEffect(() => {
    const filteredNotes =
      showAll || !url
        ? notes
        : notes.filter(([, noteRecord]) => {
            return noteRecord.url === url;
            // const noteUrl = new URL(noteRecord.url);
            // return noteUrl.hostname === url.hostname;
          });
    setNotesToShow(filteredNotes);
  }, [notes, showAll, url]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const uuid = uuidv4();
    const newNoteRecord: NoteRecord = {
      date: new Date().toJSON(),
      note: text,
      url: url,
    };

    chrome.storage.sync.set({ [uuid]: newNoteRecord }, () => {
      const noteInfo: NoteInfo = [uuid, newNoteRecord];
      setText('');
      setNotes([noteInfo, ...notes]);
    });
  };

  const handleDelete = (uuid: string) => {
    chrome.storage.sync.remove(uuid, () => {
      const filteredNotes = notes.filter(([id]) => id !== uuid);
      setNotes(filteredNotes);
    });
  };

  // TODO: implement logic to display different elements as primary
  return (
    <React.Fragment>
      <Heading />
      <NoteForm
        text={text}
        handleChange={handleTextChange}
        handleSubmit={handleSubmit}
      />
      <Notes notes={notesToShow} handleDelete={handleDelete} />
    </React.Fragment>
  );
};

export default App;
