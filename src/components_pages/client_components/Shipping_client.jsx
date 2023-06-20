import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(76, 76, 76, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
`;

const ModalView = styled.div`
  padding: 0 20px;
  width: 50vw;
  background-color: white;
  border: 2px solid black;
  justify-content: center;
  color: #121924;
  font-size: 30px;
  margin-bottom: 60px;

  @media screen and (max-width: 757px) {
    width: 70vw;
  }

  @media screen and (max-width: 570px) {
    width: 90vw;
  }

  .sizing {
    font-size: 14px;
    font-weight: bold;
    color: black;
    padding-top: 30px;
    /* background-color: beige; */
  }

  .btn_box_ship {
    display: flex;
    justify-content: space-between;

    span {
    }

    button {
      background: none;
      text-decoration: underline;
      border: none;
      font-weight: bold;
    }
  }

  .ship_des {
    position: relative;
    font-size: 14px;
    box-sizing: border-box;
    display: block;
    padding-top: 30px;
    padding-bottom: 30px;
  }
`;

export default function Shipping_client({ handleCloseModal }) {
  return (
    <>
      <ModalBackdrop onClick={handleCloseModal}>
        <ModalView>
          <div className="sizing">
            <div className="btn_box_ship">
              <span>SHIPPING</span>
              <button onClick={handleCloseModal}>CLOSE</button>
            </div>
          </div>
          <div className="ship_des">
            <strong>일반배송 서비스 (한진택배)</strong>
            <br />
            <br />
            <span>배송비: 3,000원</span>
            <br />
            <span>배송기간: 2 - 4 영업일</span>
            <br />
            <br />
            <span>
              * 상품종류에 따라서 상품의 배송이 다소 지연될 수 있습니다.
            </span>
          </div>
        </ModalView>
      </ModalBackdrop>
    </>
  );
}
