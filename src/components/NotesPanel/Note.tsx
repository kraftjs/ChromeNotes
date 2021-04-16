import React from 'react';
import { NoteRecord } from '../../lib/types';

type NoteProps = {
  noteRecord: NoteRecord;
  handleDeleteNote: () => void;
};

const Note: React.FC<NoteProps> = ({ noteRecord, handleDeleteNote }) => {
  const { date, note, url } = noteRecord;

  let urlDisplay: string | React.ReactElement<HTMLAnchorElement>;
  if (url.startsWith('chrome:')) {
    urlDisplay = url;
  } else if (url) {
    urlDisplay = (
      <a href={url} target='_newtab'>
        {url}
      </a>
    );
    document.querySelector('a')?.addEventListener('click', () => {
      chrome.tabs.create({ url });
    });
  } else {
    urlDisplay = 'No url';
  }

  return (
    <li>
      <article>
        <p>{note}</p>
        <footer>
          <time dateTime={date}>{new Date(date).toLocaleString()}</time>
          <span>{urlDisplay}</span>
        </footer>
        <button onClick={handleDeleteNote}>Delete note</button>
      </article>
    </li>
  );
};

export default Note;
