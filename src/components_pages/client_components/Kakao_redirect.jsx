import axios from 'axios';
import React, { useEffect } from 'react';
import qs from 'qs';
import { useSearchParams } from 'react-router-dom';

export default function Kakao_redirect() {
  const [searchParams] = useSearchParams();
  console.log(searchParams.get('code'));

  const getToken = async () => {
    try {
      const response = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        qs.stringify({
          grant_type: 'authorization_code',
          client_id: '1702fb0670a754fbcf00088a79157ad0',
          redirect_uri: 'http://localhost:3000/login/success',
          code: searchParams.get('code'),
        }),
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded',
          },
        },
      );
      if (response === 200) {
        window.Kakao.Auth.setAccessToken(response.data.access_token);
      }
      console.log(response.data);
      // 토큰을 이용한 API 요청 등 추가 작업 수행
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getToken();
    // window.Kakao.Auth.login({
    //   success: function (authObj) {
    //     window.Kakao.API.request({
    //       url: '/v2/user/me',
    //       success: function (res) {
    //         console.log(res);
    //       },
    //     });
    //     console.log(authObj);
    //     const token = authObj.access_token;
    //   },
    //   fail: function (err) {
    //     alert(JSON.stringify(err));
    //   },
    // });
  }, []);

  return <></>;
}
