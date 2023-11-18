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

interface ContainerProps {
  containerWidth: string;
}

const Container = styled.div<ContainerProps>`
  position: fixed;
  box-sizing: border-box;
  width: ${({ containerWidth }) => containerWidth};
  min-height: 700px;
  height: 100%;
  z-index: 999;
  text-align: center;
`;

export default function Loading_Spinner({ containerWidth = '100vw' }) {
  const text = 'FOVV...';

  return (
    <Container containerWidth={containerWidth}>
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
