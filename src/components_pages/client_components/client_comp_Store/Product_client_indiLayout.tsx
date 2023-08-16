/* eslint-disable no-undef */
import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';

const { REACT_APP_KEY_IMAGE } = process.env;

const ImageContainer = styled.div`
  position: relative;
  background-color: white;
  display: inline-block;
  height: 270px;
  width: 180px;
`;

const ImageLayout = styled.img`
  display: inline-block;
  width: 180px;
`;

const ProductInfoLayout = styled.div`
  position: absolute;
  right: 0px;
  left: 0px;
  bottom: 0px;
`;

const ProductName = styled.p`
  text-align: center;
  font-size: 15px;
  color: black;
  font-weight: 700;
  margin: 0px;
`;

const ProductPrice = styled.p`
  text-align: center;
  font-size: 15px;
  color: black;
  font-weight: 500;
  margin: 0px;
`;

// type
interface Product_client_indiLayoutType {
  imgFileName: string[] | undefined;
  productName: string;
  price: string;
}

const Product_client_indiLayout = ({
  imgFileName,
  productName,
  price,
}: Product_client_indiLayoutType) => {
  //조건부 설정
  const [isHovered, setIsHovered] = useState<boolean>(false);

  //마우스엔터 핸들러
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  //마우스리브 핸들러
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  //마우스 오버 여부를 변수에 담는 곳, 이미지 파일들은 프롭스 받은 것들로 구성
  const image = isMobile
    ? imgFileName![0]
    : isHovered
    ? imgFileName![1]
    : imgFileName![0];

  return (
    <ImageContainer
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 위에서 선별된 이미지를 실제로 쏴준다. */}
      <ImageLayout src={`${REACT_APP_KEY_IMAGE}` + image} />
      <ProductInfoLayout>
        <ProductName>{productName}</ProductName>
        <ProductPrice>{price}</ProductPrice>
      </ProductInfoLayout>
    </ImageContainer>
  );
};

export default React.memo(Product_client_indiLayout);
