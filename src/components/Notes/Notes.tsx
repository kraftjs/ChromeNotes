import React, { ReactElement } from 'react';
import { Note, NoteRecord, UUID } from '../../lib/types';

import './Notes.css';

type NotesProps = {
  noteRecords: NoteRecord[];
  onDeleteNote: (uuid: UUID) => void;
};

type NoteComponentProps = {
  note: Note;
  handleDeleteNote: () => void;
};

const Notes: React.FC<NotesProps> = ({ noteRecords, onDeleteNote }) => {
  console.log('noteRecords:', noteRecords);
  return (
    <React.Fragment>
      {noteRecords.length ? (
        <ul>
          {noteRecords.map(({ uuid, note }) => (
            <NoteComponent key={uuid} note={note} handleDeleteNote={() => onDeleteNote(uuid)} />
          ))}
        </ul>
      ) : (
        <div className='no-notes-to-show'>test</div>
      )}
    </React.Fragment>
  );
};

const NoteComponent: React.FC<NoteComponentProps> = ({ note, handleDeleteNote }) => {
  const { date, text, url } = note;

  function formatUrlDisplay(url: string): string | ReactElement<HTMLAnchorElement> {
    let urlDisplay: string | ReactElement<HTMLAnchorElement>;
    if (url.startsWith('chrome:')) {
      urlDisplay = <p>{url}</p>;
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
      urlDisplay = '<p>No url</p>';
    }
    return urlDisplay;
  }

  function toggleNoteLineLimit({ target }: React.MouseEvent<HTMLParagraphElement>) {
    (target as HTMLParagraphElement).classList.toggle('line-limit');
  }

  // TODO: change button.expand-options onClick attribute to show other buttons
  // TODO: add handleDeleteNote and handleEditNote buttons.
  return (
    <li>
      <div className='content-container'>
        <div className='hidden note-controls'>
          <button className='expand-options' onClick={handleDeleteNote}>
            {'\u22EE'}
          </button>
        </div>
        <article>
          <p className={'note-text line-limit'} onClick={toggleNoteLineLimit}>
            {text}
          </p>
          <footer>
            {formatUrlDisplay(url)}
            <time dateTime={date}>{new Date(date).toLocaleDateString('en-US')}</time>
          </footer>
        </article>
      </div>
      <hr />
    </li>
  );
};

export default Notes;
