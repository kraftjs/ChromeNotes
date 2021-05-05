import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EventMessages, Note, NoteRecord, SyncStorageData, UUID } from '../lib/types';
import isValidUrl from '../lib/url-validator';
import NoteForm from './NoteForm';
import NotesPanel from './NotesPanel';

import './App.css';

const NOTE_CHAR_LIMIT = 4000;

const App: React.FC = () => {
  const [noteRecords, setNoteRecords] = useState<NoteRecord[]>([]);
  const [url, setUrl] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [noteRecordToEdit, setNoteRecordToEdit] = useState<NoteRecord>();

  chrome.runtime.onMessage.addListener((message: string) => {
    if (message === EventMessages.UpdateUrl) {
      chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
        setUrl(tabs[0].url || '');
      });
    }
  });

  // TODO: Sort noteRecords by note date on initial pull
  useEffect(() => {
    chrome.storage.sync.get(null, (data: SyncStorageData) => {
      let notes: NoteRecord[] = [];
      for (const [uuid, note] of Object.entries(data)) {
        notes.push({ uuid, note });
      }
      setNoteRecords(notes);
    });

    chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
      setUrl(tabs[0].url || '');
    });
  }, []);

  useEffect(() => {
    chrome.runtime.sendMessage(EventMessages.NoteChange);
  }, [noteRecords]);

  function saveNote(note: string | Note, uuid: UUID = uuidv4()) {
    let noteToSave: Note;
    if (typeof note === 'string') {
      const noteUrl = isValidUrl(url) ? url : '';
      noteToSave = {
        date: new Date().toLocaleString(),
        text: note,
        url: noteUrl,
      };
    } else {
      noteToSave = note;
    }

    chrome.storage.sync.set({ [uuid]: noteToSave }, () => {
      const noteRecord: NoteRecord = { uuid, note: noteToSave };
      const filteredNotes = noteRecords.filter((noteRecord) => noteRecord.uuid !== uuid);
      setNoteRecords([noteRecord, ...filteredNotes]);
      setNoteRecordToEdit(undefined);
      setShowForm(false);
    });
  }

  function editNote(uuid: UUID, note: Note) {
    setNoteRecordToEdit({ uuid, note });
    setShowForm(true);
  }

  function deleteNote(uuid: UUID) {
    chrome.storage.sync.remove(uuid, () => {
      const filteredNotes = noteRecords.filter((noteRecord) => noteRecord.uuid !== uuid);
      setNoteRecords(filteredNotes);
    });
  }

  return (
    <React.Fragment>
      <header>
        <h1>ChromeNotes</h1>
      </header>

      <main>
        {showForm ? (
          <NoteForm
            FORM_CHAR_LIMIT={NOTE_CHAR_LIMIT}
            noteRecordToEdit={noteRecordToEdit}
            onSaveNote={saveNote}
            onCancelNote={() => setShowForm(false)}
          />
        ) : (
          <NotesPanel
            noteRecords={noteRecords}
            url={url}
            onEditNote={editNote}
            onDeleteNote={deleteNote}
            onDraftNewNote={() => setShowForm(true)}
          />
        )}
      </main>
    </React.Fragment>
  );
};

export default App;
