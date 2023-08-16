import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 70vh;
`;

const TextWrap = styled.div`
  padding-top: 100px;
  text-align: center;
  font-size: 20px;
`;

const ErrorMessage = styled.p`
  z-index: 999;
  margin: 0px;
`;

export default function ErrorPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const errorCode = queryParams.get('errorCode');
  const errorMessage = queryParams.get('errorMessage');

  return (
    <Container>
      <TextWrap>
        <ErrorMessage>{errorCode} ERROR</ErrorMessage>
        <br />
        <ErrorMessage>{errorMessage}</ErrorMessage>
      </TextWrap>
    </Container>
  );
}
