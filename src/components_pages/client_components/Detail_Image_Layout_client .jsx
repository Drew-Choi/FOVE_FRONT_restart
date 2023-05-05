import React from 'react';
import styled from 'styled-components';

const MainImage = styled.div`
  position: relative;
  /* flex: 1; */
  /* left: 340px; */
  ${(props) =>
    props.selectImgFileName &&
    `background-image: url('http://localhost:4000/uploads/${props.selectImgFileName}');`}
  background-size: cover;
  width: 350px;
  height: 350px;
  background-position: center;
  background-repeat: no-repeat;
`;

export default function Detail_Image_Layout_client() {
  return (
    <>
      <MainImage selectImgFileName={selectImgFileName} />
    </>
  );
}
