﻿
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import jwtDecode from 'jwt-decode';
import axios from 'axios';

import { getCookie, setCookie } from '../../utils/CookieUtil';
import kakaoLoginImage from '../../assets/kakao_login_medium_wide.png'

import '../../styles/corporate/CorpLogin.css';
import { reloading } from '../../utils/CustomUtil';
import MyButton from '../common/MyButton';


const CorpLogin = () => {
  const navigate = useNavigate();
  const loginEndPoint = 'http://localhost:8080/auth/corp/login';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // 로그인 request 
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(loginEndPoint, {
        email,
        password,
      });

      // Assuming the server responds with a JSON Web Token (JWT)
      const token = response.data.token;
      // Save the token to localStorage
      // localStorage.setItem('token', token);
      setCookie('access-token', token);

      // Decode the token
      const decodedToken = jwtDecode(token);
      // set userinfo in token to cooke
      setCookie('userId', decodedToken.userId)
      setCookie('nickname', decodedToken.nickname);

      // Clear the form fields and any error messages
      setEmail('');
      setPassword('');
      setError('');

      navigate('/');
      reloading();

    } catch (error) {
      // Handle login error
      setError('Invalid email or password');
      console.log(error);
    }
  };
  return 
    <div className='corp-login-container'>  
      <div className="login-input-group">
        <div className="input-field">
          <input type="text" value={email} onChange={handleEmailChange} placeholder="email" name="email" id="user-email" required/>
        </div>
        <div className="input-field">
          <input type="password" value={password} onChange={handlePasswordChange} placeholder="password" name="password" id="user-password" required/>
        </div>
      </div>

      <div className="button-group">
        <MyButton text={'로그인'} onClick={handleSubmit}></MyButton>
        {error && <p className="error">{error}</p>}
        <div className="link-group">
          <span> 아이디 찾기 </span> |
          <span> 비밀번호 찾기 </span> |
          <Link to={'/corp-signup'}><span> 회원가입 </span></Link>
        </div>

      <img src={kakaoLoginImage} alt='kakaoLoginImage' className='kakao-login-image'/>
        
      </div>
    </div>;
}

export default CorpLogin;