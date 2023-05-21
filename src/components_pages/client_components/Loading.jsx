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
  top: 50%;
  transform: translateY(-50%);
  display: inline-block;
  animation: ${fadeIn} 1s ease-in-out both infinite;
  animation-delay: ${(props) => props.delay || '0s'};
  font-size: 50px;
  font-weight: 600;
  font-style: italic;
`;

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 700px;
  /* background-color: beige; */
  text-align: center;
`;

export default function Loading() {
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
