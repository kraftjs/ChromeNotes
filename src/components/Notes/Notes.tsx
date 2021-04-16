import React, { ReactElement } from 'react';
import { Note, NoteRecord, UUID } from '../../lib/types';

import './Notes.css';

type NotesProps = {
  noteRecords: NoteRecord[];
  onDeleteNote: (uuid: UUID) => void;
}


type NoteComponentProps = {
  note: Note;
  handleDeleteNote: () => void;
};

// TODO: Debate whether to keep this function or have a messy JSX return
const Notes: React.FC<NotesProps> = ({ noteRecords, onDeleteNote }) => {
  function insertNotesList(
    noteRecords: NoteRecord[],
    deleteNote: (uuid: UUID) => void,
  ): ReactElement<HTMLUListElement> | ReactElement<HTMLParagraphElement> {

    if (noteRecords) {
      const notesList = noteRecords.map(({ uuid, note }) => <NoteComponent
        key={uuid}
        note={note}
        handleDeleteNote={() => deleteNote(uuid)}
      />);
      return <ul>{notesList}</ul>;
    } else {
      return <p>{'NothingsHer.jpeg'}</p>;
    }
  }

  return (
    <React.Fragment>
      {insertNotesList(noteRecords, onDeleteNote)}
    </React.Fragment>
  );
};

const NoteComponent: React.FC<NoteComponentProps> = ({ note, handleDeleteNote }) => {
  const { date, text, url } = note;

  function formatUrl(url: string): string | ReactElement<HTMLAnchorElement> {

    let urlDisplay: string | ReactElement<HTMLAnchorElement>;
    if (url.startsWith('chrome:')) {
      urlDisplay = url;
    } else if (url) {
      urlDisplay = (
        <a href={url} target='_newtab'>
          {url}
        </a>
      );
      document.querySelector<HTMLAnchorElement>('a')?.addEventListener('click', () => {
        chrome.tabs.create({ url });
      });
    } else {
      urlDisplay = 'No url';
    }

    return urlDisplay;
  }


  return (
    <li>
      <article>
        <p>{text}</p>
        <footer>
          <time dateTime={date}>{new Date(date).toLocaleString()}</time>
          <span>{formatUrl(url)}</span>
        </footer>
        <button onClick={handleDeleteNote}>Delete note</button>
      </article>
    </li>
  );
};

export default Notes;
