import React from 'react';

import './NoteCount.css';

type NoteCountProps = {
  noteCount: number;
};

const NoteCount: React.FC<NoteCountProps> = ({ noteCount }) => {
  return (
    <footer>
      <span className={'noteCount'}>{noteCount}/512 notes</span>
    </footer>
  );
};

export default NoteCount;
