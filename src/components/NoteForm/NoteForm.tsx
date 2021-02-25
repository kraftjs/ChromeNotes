import * as React from 'react';

import alert from './alert.svg';
import './NoteForm.css';

const { useEffect } = React;

type NoteFormProps = {
  text: string;
  handleChange(e: React.ChangeEvent<HTMLTextAreaElement>): void;
  handleSubmit(e: React.FormEvent<HTMLFormElement>): void;
  handleCancel(e: React.MouseEvent<HTMLButtonElement>): void;
  characterLimit: number;
};

const NoteForm = ({
  text,
  handleChange,
  handleSubmit,
  handleCancel,
  characterLimit,
}: NoteFormProps) => {
  const FORM_CHAR_LIMIT = characterLimit;

  useEffect(() => {
    document.querySelector('textarea')?.focus;
  }, []);

  useEffect(() => {
    const charCountDisplay = document.querySelector('span#charCount');
    const textarea = document.querySelector('textarea');
    if (text.length <= FORM_CHAR_LIMIT) {
      charCountDisplay?.classList.remove('warning');
      textarea?.classList.remove('invalidInput');
    } else {
      charCountDisplay?.classList.add('warning');
      textarea?.classList.add('invalidInput');
    }
  }, [text]);

  const charCountDisplay = (
    <span id='charCount'>
      <img
        src={alert}
        alt='alert: too many characters'
        width='20'
        height='20'
      />
      <strong>{text.length}</strong>/{FORM_CHAR_LIMIT}
    </span>
  );

  return (
    <form id='noteForm' onSubmit={handleSubmit}>
      <label htmlFor='noteTextArea'>
        <textarea id='noteTextArea' value={text} onChange={handleChange} />
        {charCountDisplay}
      </label>
      <footer>
        <button type='submit'>Save note</button>
        <button type='reset' onClick={handleCancel}>
          Cancel
        </button>
      </footer>
    </form>
  );
};

export default NoteForm;
