/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import detailClient from '../../../styles/detail_client.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { IoMdArrowBack } from 'react-icons/io';
import Detail_OrderMenu_client from './Detail_OrderMenu_client';
import Detail_SubImage_client from './Detail_SubImage_client';
import Loading from '../Loading';

export default function Detail_client() {
  console.log('상세');
  const { productCode } = useParams();
  const [productData, setProductData] = useState(null);

  const { REACT_APP_KEY_BACK } = process.env;

  const getSelectProduct = async () => {
    const selectData = await axios.get(
      `${REACT_APP_KEY_BACK}/store/productId/${productCode}`,
    );
    if (selectData.status === 200) {
      setProductData(selectData.data[0]);
      return;
    } else {
      return;
    }
  };

  useEffect(() => {
    getSelectProduct();
  }, [productCode]);

  const navigate = useNavigate();

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
          {/* 비동기 특성으로 map이 아니면 데이터 불러오는데 시간이 걸린다.
      그래서 아래와 같이 데이터가 들어오면 컴포넌트를 띄울 수 있게 순서적으로 처리해줘야함 */}
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
        </>
      ) : (
        <Loading />
      )}
    </section>
  );
}
