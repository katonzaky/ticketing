import { useState } from 'react';
import axios from 'axios';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const emailHandler = (e) => {
    setEmail(e.target.value);
  };

  const passwordHandler = (e) => {
    setPassword(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/users/signup', {
        email,
        password,
      });
      setErrors([]);
    } catch (err) {
      console.log(err.response.data.errors);
      setErrors(err.response.data.errors);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <h1>Sign Up</h1>
      <div className='form-group'>
        <label>Email Address</label>
        <input
          value={email}
          onChange={emailHandler}
          className='form-control'
        ></input>
      </div>
      <div className='form-group'>
        <label>Password</label>
        <input
          value={password}
          onChange={passwordHandler}
          type='password'
          className='form-control'
        ></input>
      </div>
      {errors.length !== 0 ? (
        <div className='alert alert-danger'>
          <ul>
            {errors.map((err, i) => (
              <li key={i}>{err.message}</li>
            ))}
          </ul>
        </div>
      ) : (
        ''
      )}
      <button className='btn btn-primary'>Sign Up</button>
    </form>
  );
};

export default SignUp;
