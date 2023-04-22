import React, { useEffect } from 'react';

export default function Kakao_login() {
  useEffect(() => {
    window.Kakao.Auth.authorize({
      redirectUri: 'http://localhost:3000/login/success',
      scope:
        'profile_nickname, profile_image, account_email, gender, age_range, birthday, talk_message, openid',
    });
  }, []);
  return <></>;
}
