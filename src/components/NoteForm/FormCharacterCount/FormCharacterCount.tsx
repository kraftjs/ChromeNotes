import React, { useEffect } from 'react';
import alert from './alert.svg';

import './FormCharacterCount.css';

type FormCharacterCountProps = {
  FORM_CHAR_LIMIT: number;
  text: string;
};

const FormCharacterCount: React.FC<FormCharacterCountProps> = ({ FORM_CHAR_LIMIT, text }) => {
  useEffect(() => {
    const countDisplay = document.querySelector<HTMLSpanElement>('#charCount');
    if (text.length <= FORM_CHAR_LIMIT) {
      countDisplay?.classList.remove('warning');
    } else {
      countDisplay?.classList.add('warning');
    }
  }, [text]);

  return (
    <span id='charCount'>
      <img src={alert} alt='alert: too many characters' width='20' height='20' />
      <strong>{text.length}</strong>/{FORM_CHAR_LIMIT}
    </span>
  );
};

export default FormCharacterCount;
