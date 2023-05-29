import React from 'react';
import '../../../styles/footer_client.scss';
import { useNavigate } from 'react-router-dom';

export default function Footer_client() {
  const navigate = useNavigate();
  return (
    <footer className="footer_client">
      <div className="footer_info_left">
        <p className="footer_copyright">
          © FOVE / site by KDT 5th POSCO X CodingOn PROJECT
        </p>
        <ul className="footer_sub_menu">
          <li className="agreement" onClick={() => navigate('/agreement')}>
            Agreement
          </li>
          <li className="privacy" onClick={() => navigate('/privacy')}>
            Privacy
          </li>
          <li className="guide" onClick={() => navigate('/guide')}>
            Guide
          </li>
          <li>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img className="to_kakao" src="/kakao.jpg" alt="kakaoicon"></img>
            </a>
          </li>
          <li>
            <a
              href="https://instagram.com/fove._official"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="to_insta"
                src="/instagram.jpg"
                alt="instagramicon"
              ></img>
            </a>
          </li>
        </ul>
      </div>

      <div className="footer_info_right">
        <ul className="footer_detail">
          <li>COMPANY. FOVE corp.</li>
          <li>
            TEAM MEMBER. CHOI DREW, KIM SEONG HYEON, SHIN SANG AH, SONG MIN
            SEON, PARK SUNG HEE
          </li>
          <li>REPRESENTATIVE. KIM YOUNG HO</li>
          <li>
            COMPANY. #03409 B1, 29, Jinheung-ro, Eunpyeong-gu, Seoul, Republic
            of Korea
          </li>
          <li>C/S CENTER. 010-9148-7457 / 11:00 - 17:00</li>
          <li>E-MAIL. marketing@fove.com</li>
        </ul>
      </div>
    </footer>
  );
}
