import * as React from 'react';

import './NoteForm.css';

const { useEffect } = React;

type NoteFormProps = {
  text: string;
  handleChange(e: React.ChangeEvent<HTMLTextAreaElement>): void;
  handleSubmit(e: React.FormEvent<HTMLFormElement>): void;
  handleCancel(e: React.MouseEvent<HTMLButtonElement>): void;
};

const NoteForm = ({
  text,
  handleChange,
  handleSubmit,
  handleCancel,
}: NoteFormProps) => {
  useEffect(() => {
    document.querySelector('textarea')?.focus;
  }, []);

  return (
    <form id='noteForm' onSubmit={handleSubmit}>
      <label htmlFor='noteTextArea'>
        <textarea
          id='noteTextArea'
          value={text}
          onChange={handleChange}
          maxLength={4000}
        />
      </label>
      <button type='submit'>Save note</button>
      <button type='reset' onClick={handleCancel}>
        Cancel
      </button>
    </form>
  );
};

export default NoteForm;
