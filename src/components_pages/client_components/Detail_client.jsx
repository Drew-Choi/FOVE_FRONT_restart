import React, { useEffect, useState } from 'react';
import detailClient from '../../styles/detail_client.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Detail_OrderMenu_client from './Detail_OrderMenu_client';
import Detail_SubImage_client from './Detail_SubImage_client';
import SubNav_client from './client_comp_Header_Footer/SubNav_client';
import MediaQuery from 'react-responsive';
import Loading from './Loading';
import { IoMdArrowBack } from 'react-icons/io';
export default function Detail_client() {
  const { productCode } = useParams();
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    getSelectProduct();
  }, [productCode]);

  const getSelectProduct = async () => {
    const selectData = await axios.get(
      `http://13.125.248.186:4000/store/productId/${productCode}`,
    );
    if (selectData.status === 200) {
      await setProductData(selectData.data[0]);
      return;
    } else {
      return;
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

  // 터치화면인지 인식하기 위한 로직 ------
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsTouch((cur) => true);
    };

    document.addEventListener('touchstart', checkMobile);

    return () => {
      document.removeEventListener('touchstart', checkMobile);
    };
  }, []);

  return (
    <section className={detailClient.pd_detail}>
      {productData !== null ? (
        <>
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
            <div className={detailClient.image_info_container}>
              <span className={detailClient.back} onClick={() => navigate(-1)}>
                <IoMdArrowBack className={detailClient.backIcon} />
              </span>
              <Detail_SubImage_client datas={productData} isTouch={isTouch} />
              <Detail_OrderMenu_client
                productName={productData.productName}
                detail={productData.detail}
                price={productData.price}
                datas={productData}
              />
            </div>
          )}
        </>
      ) : (
        <Loading />
      )}
    </section>
  );
}
