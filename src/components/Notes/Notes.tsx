import React, { ReactElement, useEffect } from 'react';
import { Note, NoteRecord, UUID } from '../../lib/types';

import './Notes.css';

type NotesProps = {
  noteRecords: NoteRecord[];
  onEditNote: (uuid: UUID, note: Note) => void;
  onDeleteNote: (uuid: UUID) => void;
  onHoveredUrl: (url: string) => void;
};

const Notes: React.FC<NotesProps> = ({ noteRecords, onEditNote, onDeleteNote, onHoveredUrl }) => {
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
              handleHoveredUrl={onHoveredUrl}
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
  handleHoveredUrl: (url: string) => void;
};

const NoteComponent: React.FC<NoteComponentProps> = ({
  note,
  handleEditNote,
  handleDeleteNote,
  handleHoveredUrl,
}) => {
  const { date, text, url } = note;

  function formatUrlDisplay(url: string): string | ReactElement<HTMLAnchorElement> {
    let urlDisplay: string | ReactElement<HTMLAnchorElement>;
    if (url.startsWith('chrome:')) {
      urlDisplay = <p>{url}</p>;
    } else if (url) {
      urlDisplay = (
        <a
          href={url}
          rel='noreferrer noopener'
          target='_blank'
          onMouseEnter={() => handleHoveredUrl(url)}
          onMouseLeave={() => handleHoveredUrl('')}>
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

  function removeNoteLineLimit({ target }: React.MouseEvent<HTMLParagraphElement>) {
    if (target instanceof HTMLParagraphElement) {
      target.classList.remove('line-limit');

      const notesContainer = target.closest<HTMLTextAreaElement>('ul');
      if (notesContainer && notesContainer.scrollHeight > notesContainer.clientHeight) {
        notesContainer.classList.add('scrollbar-padding');
      }
    }
  }

  return (
    <li>
      <div className='content-container'>
        <div className='side-panel'>
          <div className='dropdown'>
            <div className='dropdown-label'>{'\u22EE'}</div>
            <div className='dropdown-menu'>
              <div className='dropdown-item'>
                <svg
                  onClick={handleEditNote}
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1}
                    d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                  />
                </svg>
              </div>
              <hr />
              <div className='dropdown-item'>
                <svg
                  onClick={handleDeleteNote}
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1}
                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <article>
          <p className={'note-text line-limit'} onClick={removeNoteLineLimit}>
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
