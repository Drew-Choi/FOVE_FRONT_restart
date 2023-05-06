import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import detailSubImage from '../../styles/detail_subimage_client.module.scss';

const MainImage = styled.div`
  position: relative;
  margin-right: 160px;
  ${(props) =>
    props.selectImgFileName &&
    `background-image: url('http://localhost:4000/uploads/${props.selectImgFileName}');`}
  background-size: cover;
  width: 350px;
  height: 350px;
  background-position: center;
  background-repeat: no-repeat;

  @media screen and (max-width: 1144px) {
    margin-right: 110px;
  }

  @media screen and (max-width: 1040px) {
    margin-right: 50px;
  }

  @media screen and (max-width: 840px) {
    margin-right: 0px;
  }
`;

const Sub_IMG = styled.div`
  position: relative;
  display: block;
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
  const [selectImgFileName, setSelectImgFileName] = useState(datas.img[0]);
  const [selectDot, setSelectDot] = useState(datas.img[0]);

  return (
    <div className={detailSubImage.detail_sub_image_totalContainer}>
      <div className={detailSubImage.sub_image_wrap}>
        {datas.img.map((el, index) => (
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
    </div>
  );
}
