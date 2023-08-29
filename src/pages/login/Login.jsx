import React, { useCallback, useState } from 'react';
import TextInput from '../../components/TextInput';

export default function Login() {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const handleTextInputChange = useCallback((e) => {
    let newData = values;
    newData[e.target.name] = e.target.value;
    setValues({ ...newData });
  }, []);

  return (
    <div>
      <form className='flex flex-col gap-2 p-[20px]'>
        <TextInput
          label='Email'
          placeholder='Enter Email'
          required
          name='email'
          value={values.email}
          onChange={handleTextInputChange}
        />

        <TextInput
          label='Password'
          placeholder='Enter Password'
          required
          name='password'
          value={values.password}
          onChange={handleTextInputChange}
        />
      </form>
    </div>
  );
}
