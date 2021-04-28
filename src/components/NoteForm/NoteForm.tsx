import React, { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from 'react';
import FormCharacterCount from './FormCharacterCount';

import './NoteForm.css';

type NoteFormProps = {
  FORM_CHAR_LIMIT: number;
  onSaveNote: (text: string) => void;
  onCancelNote: () => void;
};

const NoteForm: React.FC<NoteFormProps> = ({ FORM_CHAR_LIMIT, onSaveNote, onCancelNote }) => {
  const [text, setText] = useState('');
  const isValid: boolean = text.length <= FORM_CHAR_LIMIT && text.replace(/\s/g, '').length > 0;

  useEffect(() => {
    document.querySelector<HTMLTextAreaElement>('textarea')?.focus();
  }, []);

  function handleInputChange({ target }: ChangeEvent<HTMLTextAreaElement>) {
    setText(target.value);
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSaveNote(text);
    setText('');
  }

  function handleCancelNote(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    onCancelNote();
    setText('');
  }

  return (
    <form id='noteForm' onSubmit={handleFormSubmit}>
      <label htmlFor='noteTextArea'>
        <textarea id='noteTextArea' value={text} onChange={handleInputChange} />
        <FormCharacterCount FORM_CHAR_LIMIT={FORM_CHAR_LIMIT} text={text} />
      </label>
      <footer>
        <button type='submit' disabled={!isValid}>
          Save note
        </button>
        <button type='reset' onClick={handleCancelNote}>
          Cancel
        </button>
      </footer>
    </form>
  );
};

export default NoteForm;
