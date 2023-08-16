import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

const PaginationContainer = styled.div<{
  justifyContent: string;
  alignItems: string;
}>`
  display: flex;
  bottom: 50px;
  justify-content: ${(props) => props.justifyContent};
  align-items: ${(props) => props.alignItems};
`;

// type
interface SwiperPaginationContainerType extends PropsWithChildren {
  className: string;
  justifyContent: string;
  alignItems: string;
}

export default function SwiperPaginationContainer({
  children,
  className,
  justifyContent,
  alignItems,
}: SwiperPaginationContainerType) {
  return (
    <PaginationContainer
      className={className}
      justifyContent={justifyContent}
      alignItems={alignItems}
    >
      {children}
    </PaginationContainer>
  );
}

SwiperPaginationContainer.defaultProps = {
  justifyContent: 'center',
  alignItems: 'center',
};
