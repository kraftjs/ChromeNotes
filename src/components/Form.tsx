// todo: finish setting up this component

import * as React from 'react';

type FormProps = {
  focus: boolean;
};

const Form = ({ focus }: FormProps) => {
  const handleChange = () => {};

  return (
    <form>
      <label>
        <textarea value={1} onChange={handleChange} />
      </label>
    </form>
  );
};

export default Form;
