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
    <div>
      <p>{note}</p>
      <div>
        <p>{date}</p>
        <p>{urlDisplay}</p>
      </div>
      <button onClick={handleDelete}>Delete note</button>
    </div>
  );
};

export default Note;
