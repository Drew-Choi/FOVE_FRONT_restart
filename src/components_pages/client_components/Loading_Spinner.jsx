import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const AnimationText = styled.span`
  position: relative;
  top: 200px;
  display: inline-block;
  animation: ${fadeIn} 1s ease-in-out both infinite;
  animation-delay: ${(props) => props.delay || '0s'};
  font-size: 50px;
  font-weight: 600;
  font-style: italic;

  @media screen and (max-width: 667px) {
    left: 20px;
  }
`;

const Container = styled.div`
  position: fixed;
  width: 100vw;
  min-height: 700px;
  height: 100%;
  text-align: center;
  z-index: 10;
`;

export default function Loading_Spinner() {
  const text = 'FOVV...';

  return (
    <>
      <Container>
        {text.split('').map((char, index) => {
          return (
            <AnimationText key={index} delay={`${index * 0.1}s`}>
              {char}
            </AnimationText>
          );
        })}
      </Container>
    </>
  );
}
