import React from 'react';
import myPage from '../../styles/mypage_client.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Mypage_client() {
  const navigate = useNavigate();
  const userNameEncoded = useSelector((state) => state.user.userName);

  return (
    <section className={myPage.myPage_container}>
      {/* ACCOUNT 제목 위치 */}
      <div className={myPage.titleArea}>
        <h5 className={myPage.subtitle}>ACCOUNT</h5>
      </div>
      <div className={myPage.account_info_container}>
        {/* 회원 등급 박스 */}
        <div className={myPage.informations}>
          <p className={myPage.info_grade}>STANDARD</p>
          <div className={myPage.info_description}>
            <span>
              저희 쇼핑몰을 이용해주셔서 감사합니다.
              <br />
              <span className={myPage.info_bold}>{userNameEncoded}</span> 님은
              <span className={myPage.info_bold}> STANDARD </span>
              회원이십니다.
              <br />
              <span className={myPage.info_bold}> KRW 10,000 이상</span> 구매시
              <span className={myPage.info_bold}> 5% </span>을 추가할인 받으실
              수 있습니다. (최대 KRW 9,999,999)
              <br />
              <span className={myPage.info_bold}> KRW 10,000 이상</span> 구매시
              <span className={myPage.info_bold}> 5% </span>을 추가적립 받으실
              수 있습니다. (최대 KRW 9,999,999)
            </span>
          </div>
        </div>
        {/* 나의 주문처리 현황 박스 */}

        <div className={myPage.orderstate_box}>
          <p className={myPage.shipping_info_title}>
            나의 주문처리 현황
            <span>
              (최근 <span className={myPage.threeMonth}>3개월</span> 기준)
            </span>
          </p>

          <div className={myPage.row2_wrap}>
            <a className={myPage.beforeAcount} href="#">
              <p>입금전</p>
              <p>0</p>
            </a>

            <a className={myPage.ready} href="#">
              <p>배송준비중</p>
              <p>0</p>
            </a>

            <a className={myPage.shipping} href="#">
              <p>배송중</p>
              <p>0</p>
            </a>

            <a className={myPage.complete} href="#">
              <p>배송완료</p>
              <p>0</p>
            </a>
          </div>

          <div className={myPage.row3_wrap}>
            <a className={myPage.cancle} href="#">
              <p>취소 :</p>
              <p>0</p>
            </a>

            <a className={myPage.change} href="#">
              <p>교환 :</p>
              <p>0</p>
            </a>

            <a className={myPage.refund} href="#">
              <p>반품 :</p>
              <p>0</p>
            </a>
          </div>
        </div>

        {/* 박스 4개 */}
        <div className={myPage.fourBox}>
          <div
            onClick={() => navigate('/mypage/orderlist')}
            className={myPage.shopmain_order}
          >
            <p>주문 조회</p>
            <span className="material-symbols-outlined">local_shipping</span>
          </div>

          <div
            onClick={() => navigate('/mypage/editInfo')}
            className={myPage.shopmain_profile}
          >
            <p>회원 정보 수정</p>
            <span className="material-symbols-outlined">person</span>
          </div>

          <div
            onClick={() => navigate('/mypage/checkAddress')}
            className={myPage.shopmain_address}
          >
            <p>배송 주소록</p>
            <span className="material-symbols-outlined">home</span>
          </div>

          <div onClick={() => navigate('#')} className={myPage.shopmain_mypick}>
            <p>MY STYLING PICK</p>
            <span className="material-symbols-outlined">favorite</span>
          </div>
        </div>
      </div>
    </section>
  );
}
