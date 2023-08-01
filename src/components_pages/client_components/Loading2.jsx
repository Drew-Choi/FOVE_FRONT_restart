import React from 'react';
import { useLocation } from 'react-router-dom';
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
  top: 50%;
  transform: translateY(-50%);
  display: inline-block;
  animation: ${fadeIn} 1s ease-in-out both infinite;
  animation-delay: ${(props) => props.delay || '0s'};
  font-size: 50px;
  font-weight: 600;
  font-style: italic;

  @media screen and (max-width: 991px) {
    top: 200px;
  }
`;

const Container = styled.div`
  position: absolute;
  width: 100vw;
  min-height: 630px;
  height: 100%;
  background-color: white;
  text-align: center;
  z-index: 5;

  @media screen and (max-width: 991px) {
    height: 94%;
  }

  @media screen and (max-width: 767px) {
    height: 96%;
  }

  @media screen and (max-width: 575px) {
    height: 99%;
  }
`;

export default function Loading2() {
  const text = 'FOVV...';

  return (
    <Container>
      {text.split('').map((char, index) => {
        return (
          <AnimationText key={index} delay={`${index * 0.1}s`}>
            {char}
          </AnimationText>
        );
      })}
    </Container>
  );
}
