/* eslint-disable no-undef */
import React, { useState } from 'react';
import styled from 'styled-components';
import detailSubImage from '../../../styles/detail_subimage_client.module.scss';
import MediaQuery from 'react-responsive';

const { REACT_APP_KEY_IMAGE } = process.env;

const MainImage = styled.div`
  position: relative;
  margin-right: 160px;
  ${(props) =>
    props.selectImgFileName &&
    `background-image: url('${REACT_APP_KEY_IMAGE}${props.selectImgFileName}');`}
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

  @media screen and (max-width: 767px) {
    margin-right: 90px;
  }

  @media screen and (max-width: 555px) {
    margin-right: 0px;
    margin: 0px auto;
    margin-bottom: 30px;
  }

  @media screen and (max-width: 415px) {
    width: 250px;
    height: 250px;
  }

  @media screen and (max-width: 280px) {
    width: 220px;
    height: 220px;
  }
`;

const Sub_IMG = styled.div`
  position: relative;
  display: block;
  ${(props) =>
    props.imgFileName &&
    `background-image: url('${REACT_APP_KEY_IMAGE}${props.imgFileName}');`}
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

  @media screen and (max-width: 280px) {
    width: 30px;
    height: 30px;
  }
`;

const Sub_IMG2 = styled.div`
  position: relative;
  display: block;
  ${(props) =>
    props.imgFileName &&
    `background-image: url('${REACT_APP_KEY_IMAGE}${props.imgFileName}');`}
  width: 50px;
  height: 50px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  margin-bottom: 20px;
  ${({ selectImage }) => (selectImage ? 'opacity: 0.7;' : 'opacity: 1;')}

  @media screen and (max-width: 280px) {
    width: 30px;
    height: 30px;
  }
`;

export default function Detail_SubImage_client({ datas, isTouch }) {
  const [selectImgFileName, setSelectImgFileName] = useState(datas.img[0]);
  const [selector, setSelector] = useState([true, false, false, false, false]);

  return (
    <div className={detailSubImage.detail_sub_image_totalContainer}>
      <MediaQuery minWidth={556}>
        <div className={detailSubImage.sub_image_wrap}>
          {datas.img.map((el, index) => (
            <Sub_IMG
              onClick={() => {
                setSelectImgFileName(el);
              }}
              key={index}
              imgFileName={el}
            ></Sub_IMG>
          ))}
        </div>
        <MainImage selectImgFileName={selectImgFileName} />
      </MediaQuery>

      <MediaQuery maxWidth={555}>
        <MainImage selectImgFileName={selectImgFileName} />
        <div className={detailSubImage.sub_image_wrap}>
          {datas.img.map((el, index) =>
            !isTouch ? (
              <Sub_IMG
                onClick={() => {
                  setSelectImgFileName(el);
                }}
                key={index}
                imgFileName={el}
              ></Sub_IMG>
            ) : (
              <Sub_IMG2
                onClick={() => {
                  setSelectImgFileName(el);
                  setSelector((cur) => {
                    let newArr = cur.map((el) => false);
                    newArr[index] = true;
                    return newArr;
                  });
                }}
                key={index}
                imgFileName={el}
                selectImage={selector[index]}
              ></Sub_IMG2>
            ),
          )}
        </div>
      </MediaQuery>
    </div>
  );
}
