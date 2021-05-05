import React, { ReactElement, useEffect } from 'react';
import { Note, NoteRecord, UUID } from '../../lib/types';

import './Notes.css';

type NotesProps = {
  noteRecords: NoteRecord[];
  onEditNote: (uuid: UUID, note: Note) => void;
  onDeleteNote: (uuid: UUID) => void;
};

const Notes: React.FC<NotesProps> = ({ noteRecords, onEditNote, onDeleteNote }) => {
  useEffect(() => {
    const notesContainer = document.querySelector<HTMLUListElement>('ul');
    if (notesContainer && notesContainer.scrollHeight > notesContainer.clientHeight) {
      notesContainer.classList.add('scrollbar-padding');
    }

    return () => {
      notesContainer?.classList.remove('scrollbar-padding');
    };
  });

  return (
    <React.Fragment>
      {noteRecords.length ? (
        <ul>
          {noteRecords.map(({ uuid, note }) => (
            <NoteComponent
              key={uuid}
              note={note}
              handleEditNote={() => onEditNote(uuid, note)}
              handleDeleteNote={() => onDeleteNote(uuid)}
            />
          ))}
        </ul>
      ) : (
        <div className='no-notes-to-show'>test</div>
      )}
    </React.Fragment>
  );
};

type NoteComponentProps = {
  note: Note;
  handleEditNote: () => void;
  handleDeleteNote: () => void;
};

const NoteComponent: React.FC<NoteComponentProps> = ({
  note,
  handleEditNote,
  handleDeleteNote,
}) => {
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
    if (target instanceof HTMLParagraphElement) {
      target.classList.toggle('line-limit');

      const notesContainer = target.closest<HTMLTextAreaElement>('ul');
      if (!notesContainer) {
        return;
      } else if (notesContainer.scrollHeight > notesContainer.clientHeight) {
        notesContainer.classList.add('scrollbar-padding');
      } else {
        notesContainer.classList.remove('scrollbar-padding');
      }
    }
  }

  // TODO: change button.expand-options onClick attribute to show other buttons
  // TODO: add handleDeleteNote and handleEditNote buttons.
  return (
    <li>
      <div className='content-container'>
        <div className='dropdown-container'>
          <div className='dropdown'>
            <div className='dropdown-label'>{'\u22EE'}</div>
            <div className='dropdown-menu'>
              <button className='dropdown-item' onClick={handleEditNote}>
                Edit
              </button>
              <button className='dropdown-item' onClick={handleDeleteNote}>
                Delete
              </button>
            </div>
          </div>
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
