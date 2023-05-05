import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import detailSubImage from '../../styles/detail_subimage_client.module.scss';

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

export default function Detail_SubImage_client({ datas }) {
  return <div className={detailSubImage.detail_sub_image_totalContainer}></div>;
}
