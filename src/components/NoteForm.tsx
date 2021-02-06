import * as React from 'react';

import './NoteForm.css';

type NoteFormProps = {
  text: string;
  handleChange(e: React.ChangeEvent<HTMLTextAreaElement>): void;
  handleSubmit(e: React.FormEvent<HTMLFormElement>): void;
};

const NoteForm = ({ text, handleChange, handleSubmit }: NoteFormProps) => {
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='note'>
        <textarea
          id='note'
          placeholder='test'
          value={text}
          onChange={handleChange}
        />
      </label>
      <button type='submit'>Save note</button>
    </form>
  );
};

export default NoteForm;
