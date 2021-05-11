import React, { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from 'react';
import { Note, NoteRecord, UUID } from '../../lib/types';
import FormCharacterCount from './FormCharacterCount';

import './NoteForm.css';

type NoteFormProps = {
  FORM_CHAR_LIMIT: number;
  noteRecordToEdit: NoteRecord | undefined;
  onSaveNote: (note: string | Note, uuid?: UUID) => void;
  onCancelNote: () => void;
};

const NoteForm: React.FC<NoteFormProps> = ({
  FORM_CHAR_LIMIT,
  noteRecordToEdit,
  onSaveNote,
  onCancelNote,
}) => {
  const [text, setText] = useState('');
  const isValid: boolean = text.length <= FORM_CHAR_LIMIT && text.replace(/\s/g, '').length > 0;

  useEffect(() => {
    document.querySelector<HTMLTextAreaElement>('textarea')?.focus();
  }, []);

  useEffect(() => {
    noteRecordToEdit ? setText(noteRecordToEdit.note.text) : setText('');
  }, [noteRecordToEdit]);

  useEffect(() => {
    const textarea = document.querySelector<HTMLTextAreaElement>('#noteTextArea');
    if (textarea && textarea.scrollHeight > textarea.clientHeight) {
      textarea.classList.add('scrollbar-padding');
    } else {
      textarea?.classList.remove('scrollbar-padding');
    }
  }, [text]);

  function handleInputChange({ target }: ChangeEvent<HTMLTextAreaElement>) {
    setText(target.value);
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (noteRecordToEdit) {
      const { uuid, note } = noteRecordToEdit;
      const updatedNote: Note = {
        date: note.date,
        text: text,
        url: note.url,
      };
      onSaveNote(updatedNote, uuid);
    } else {
      onSaveNote(text);
    }
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
        <textarea id='noteTextArea' maxLength={9999} value={text} onChange={handleInputChange} />
        <FormCharacterCount FORM_CHAR_LIMIT={FORM_CHAR_LIMIT} text={text} />
      </label>
      <footer>
        <button type='submit' className='primary' disabled={!isValid}>
          Save note
        </button>
        <button type='reset' className='secondary' onClick={handleCancelNote}>
          Cancel
        </button>
      </footer>
    </form>
  );
};

export default NoteForm;
