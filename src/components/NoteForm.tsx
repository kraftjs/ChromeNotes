import * as React from 'react';

import './NoteForm.css';

type NoteFormProps = {
  text: string;
  handleChange(e: React.ChangeEvent<HTMLTextAreaElement>): void;
  handleSubmit(e: React.FormEvent<HTMLFormElement>): void;
  url: string;
};

const NoteForm = ({ text, handleChange, handleSubmit, url }: NoteFormProps) => {
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='note'>
        <textarea id='note' value={text} onChange={handleChange} />
      </label>
      <button type='submit'>Save note</button>
    </form>
  );
};

export default NoteForm;
