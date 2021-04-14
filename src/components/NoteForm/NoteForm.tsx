import React, { useEffect } from 'react';
import alert from './alert.svg';

import './NoteForm.css';

type NoteFormProps = {
  text: string;
  handleChange(e: React.ChangeEvent<HTMLTextAreaElement>): void;
  handleSubmit(e: React.FormEvent<HTMLFormElement>): void;
  handleCancel(e: React.MouseEvent<HTMLButtonElement>): void;
  characterLimit: number;
};

const NoteForm: React.FC<NoteFormProps> = ({
  text,
  handleChange,
  handleSubmit,
  handleCancel,
  characterLimit,
}) => {
  const FORM_CHAR_LIMIT = characterLimit;

  useEffect(() => {
    document.querySelector<HTMLTextAreaElement>('textarea')?.focus();
  }, []);

  useEffect(() => {
    const charCountDisplay = document.querySelector<HTMLSpanElement>(
      '#charCount',
    );
    const textarea = document.querySelector<HTMLTextAreaElement>('textarea');
    if (text.length <= FORM_CHAR_LIMIT) {
      charCountDisplay?.classList.remove('warning');
      textarea?.classList.remove('invalidInput');
    } else {
      charCountDisplay?.classList.add('warning');
      textarea?.classList.add('invalidInput');
    }
  }, [text]);

  return (
    <form id='noteForm' onSubmit={handleSubmit}>
      <label htmlFor='noteTextArea'>
        <textarea id='noteTextArea' value={text} onChange={handleChange} />
        <span id='charCount'>
          <img
            src={alert}
            alt='alert: too many characters'
            width='20'
            height='20'
          />
          <strong>{text.length}</strong>/{FORM_CHAR_LIMIT}
        </span>
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
