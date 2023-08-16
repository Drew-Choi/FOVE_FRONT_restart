import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 78vh;
`;

const ErrorMessage = styled.h2`
  z-index: 999;
`;

export default function Error404() {
  return (
    <Container>
      <ErrorMessage>NOT FOUND 404 ERROR</ErrorMessage>
    </Container>
  );
}
