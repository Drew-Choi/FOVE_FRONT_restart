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
  left: -30px;
  width: 110%;
  height: 150vh;
  background-color: white;
  text-align: center;
  z-index: 5;

  @media screen and (max-width: 390px) {
    left: -10px;
  }
`;

export default function LoadingCartOrder() {
  const text = 'FOVE...';

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
