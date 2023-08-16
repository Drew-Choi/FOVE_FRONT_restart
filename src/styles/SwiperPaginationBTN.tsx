import React, { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import styled from 'styled-components';

const PaginationNum = styled.span<{ fontSize: string; hoverColor: string }>`
  font-size: ${(props) => props.fontSize};
  padding: 10px;
  cursor: pointer;
  color: ${(props) => props.color};
  &:hover {
    color: ${(props) => props.hoverColor};
  }
`;

// type
interface SwiperPaginationBTNType extends PropsWithChildren {
  onClickEvent: (e?: any) => void | Dispatch<SetStateAction<any>>;
  fontSize: string;
  color: string;
  hoverColor: string;
  className: string;
}

const SwiperPaginationBTN = ({
  children,
  onClickEvent,
  fontSize,
  color,
  hoverColor,
  className,
}: SwiperPaginationBTNType) => {
  return (
    <PaginationNum
      className={className}
      onClick={onClickEvent}
      fontSize={fontSize}
      color={color}
      hoverColor={hoverColor}
    >
      {children}
    </PaginationNum>
  );
};

SwiperPaginationBTN.defaultProps = {
  fontSize: '15px',
  color: 'black',
  hoverColor: 'gray',
};

export default React.memo(SwiperPaginationBTN);
