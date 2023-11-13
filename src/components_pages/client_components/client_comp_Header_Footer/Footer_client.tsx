import React from 'react';
import '../../../styles/footer_client.scss';
import { useNavigate } from 'react-router-dom';

export default function Footer_client() {
  const navigate = useNavigate();
  return (
    <footer className="footer_client">
      <div className="footer_info_left">
        <p className="footer_copyright">
          © FOVV / site by KDT 5th POSCO X CodingOn PROJECT
        </p>
        <ul className="footer_sub_menu">
          <li className="agreement" onClick={() => navigate('/agreement')}>
            Agreement
          </li>
          <li className="privacy" onClick={() => navigate('/privacy')}>
            Privacy
          </li>
          <li className="guide" onClick={() => navigate('/electronic')}>
            ElectronicFinancialTerms
          </li>
          <li>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img className="to_kakao" src="/kakao.jpg" alt="kakaoicon"></img>
            </a>
          </li>
          <li>
            <a href="#" target="_blank" rel="noopener noreferrer">
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
          <li>TAXPAYER IDENTIFICATIOM NUMBER: 624-31-01420</li>
          <li>
            COMPANY. 105-1306, 796, TONGIL-RO, EUNPYEONG-GU, SEOUL, REPUBLIC OF
            KOREA
          </li>
          <li>REPRESENTATIVE. KIM YOUNG HO</li>
          <li>
            TEAM MEMBER. CHOI DREW, KIM SEONG HYEON, SHIN SANG AH, SONG MIN
            SEON, PARK SUNG HEE
          </li>
          <li>C/S CENTER. 0507-1407-3022 / 11:00 - 17:00</li>
          <li>E-MAIL. fovecorp@gmail.com</li>
        </ul>
      </div>
    </footer>
  );
}
