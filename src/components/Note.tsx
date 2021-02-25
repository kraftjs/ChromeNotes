import * as React from 'react';

import { NoteRecord } from '../types';

type NoteProps = {
  noteRecord: NoteRecord;
  handleDelete(): void;
};

const Note = ({ noteRecord, handleDelete }: NoteProps) => {
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
        <button onClick={handleDelete}>Delete note</button>
      </article>
    </li>
  );
};

export default Note;
