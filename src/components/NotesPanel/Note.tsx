import React from 'react';
import { Note } from '../../lib/types';

type NoteComponentProps = {
  note: Note;
  handleDeleteNote: () => void;
};

const NoteComponent: React.FC<NoteComponentProps> = ({ note, handleDeleteNote }) => {
  const { date, text, url } = note;

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
        <p>{text}</p>
        <footer>
          <time dateTime={date}>{new Date(date).toLocaleString()}</time>
          <span>{urlDisplay}</span>
        </footer>
        <button onClick={handleDeleteNote}>Delete note</button>
      </article>
    </li>
  );
};

export default NoteComponent;
