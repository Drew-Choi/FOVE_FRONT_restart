import React, { useEffect, useState } from 'react';
import detailClient from '../../styles/detail_client.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Detail_OrderMenu_client from './Detail_OrderMenu_client';
import SubNav_client from './SubNav_client';
import MediaQuery from 'react-responsive';
import styled from 'styled-components';

const Sub_IMG = styled.div`
  ${(props) =>
    props.imgFileName &&
    `background-image: url('http://localhost:4000/uploads/${props.imgFileName}');`}
  width: 50px;
  height: 50px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  margin-bottom: 20px;
  opacity: 1;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
  &:active {
    opacity: 0.3;
  }
`;

const MainImage = styled.div`
  position: relative;
  /* left: 340px; */
  ${(props) =>
    props.selectImgFileName &&
    `background-image: url('http://localhost:4000/uploads/${props.selectImgFileName}');`}
  background-size: cover;
  width: 400px;
  height: 400px;
  background-position: center;
  background-repeat: no-repeat;
`;

const FirstDot = styled.div`
  position: absolute;
  bottom: 90px;
  left: 0px;
  width: 50px;
  height: 2px;
  /* background-color: black; */
`;

const SecondDot = styled.div`
  position: absolute;
  bottom: 17px;
  width: 50px;
  height: 2px;
  background-color: black;
`;

export default function Detail_client() {
  const { id } = useParams();
  const [productData, setProductData] = useState();

  //이미지 관련 스테이트
  const [selectImgFileName, setSelectImgFileName] = useState(
    productData.img[0],
  );
  const [selectDot, setSelectDot] = useState(productData.img[0]);

  useEffect(() => {
    getSelectProduct();
  }, [id]);

  const getSelectProduct = async () => {
    const selectData = await axios.get(
      `http://localhost:4000/store/productId/${id}`,
    );
    if (selectData.status === 200) {
      await setProductData(selectData.data[0]);
      return selectData.data;
    } else {
      return selectData.data;
    }
  };

  const navigate = useNavigate();

  //반응형 영역
  //반응형 카테고리 구현
  const categotryMenus_act = [
    'VIEW ALL',
    'NEW ARRIVALS',
    'BEANIE',
    'CAP',
    'TRAINING',
    'WINDBREAKER',
  ];

  //반응형 셀렉터 핸들
  const handleCategoryChange = (e) => {
    let eValue = e.target.value;

    if (eValue === 'VIEW ALL') {
      navigate('/store');
    } else if (eValue === 'NEW ARRIVALS') {
      navigate('/store/new');
    } else if (eValue === 'BEANIE') {
      navigate('/store/beanie');
    } else if (eValue === 'CAP') {
      navigate('/store/cap');
    } else if (eValue === 'TRAINING') {
      navigate('/store/training');
    } else if (eValue === 'WINDBREAKER') {
      navigate('/store/windbreaker');
    }
  };

  return (
    <section className={detailClient.pd_detail}>
      <MediaQuery minWidth={576}>
        <SubNav_client
          onClickEvent1={() => navigate('/store')}
          onClickEvent2={() => navigate('/store/new')}
          onClickEvent3={() => navigate('/store/beanie')}
          onClickEvent4={() => navigate('/store/cap')}
          onClickEvent5={() => navigate('/store/training')}
          onClickEvent6={() => navigate('/store/windbreaker')}
          menu1="VIEW ALL"
          menu2="NEW ARRIVALS"
          menu3="BEANIE"
          menu4="CAP"
          menu5="TRAINING"
          menu6="WINDBREAKER"
          top={'0px'}
        />
      </MediaQuery>

      <MediaQuery maxWidth={575}>
        <select
          className={detailClient.selectCategorys}
          value="VIEW ALL"
          onChange={handleCategoryChange}
        >
          {categotryMenus_act.map((el) => (
            <option value={el} key={el}>
              {el}
            </option>
          ))}
        </select>
      </MediaQuery>

      {/* 비동기 특성으로 map이 아니면 데이터 불러오는데 시간이 걸린다.
      그래서 아래와 같이 데이터가 들어오면 컴포넌트를 띄울 수 있게 순서적으로 처리해줘야함 */}
      {productData && (
        <div className={detailClient.OrderMenu_Image_Container}>
          {/* 서브 이미지 */}
          <div className={detailClient.detail_Sub_Image_PositionCenter}>
            {productData.img.map((el, index) => (
              <Sub_IMG
                className="sub-IMG"
                onClick={() => {
                  setSelectImgFileName((cur) => el);
                  setSelectDot((cur) => el);
                }}
                key={index}
                imgFileName={el}
              ></Sub_IMG>
            ))}
            {/* {selectDot === datas.img[0] ? <FirstDot /> : <SecondDot />} */}
          </div>

          <MainImage selectImgFileName={selectImgFileName} />

          <Detail_OrderMenu_client
            productName={productData.productName}
            detail={productData.detail}
            price={productData.price}
            datas={productData}
          />
        </div>
      )}
    </section>
  );
}
