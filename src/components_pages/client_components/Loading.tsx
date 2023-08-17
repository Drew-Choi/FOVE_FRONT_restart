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

const AnimationText = styled.span<{ delay: string }>`
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
  min-height: 700px;
  height: 100%;
  background-color: white;
  text-align: center;
  z-index: 5;
`;

export default function Loading() {
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