import React, { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import styled from 'styled-components';

// type
interface BTN_White_nomal_comp_Props extends PropsWithChildren {
  onClickEvent?: (e?: any) => void | Dispatch<SetStateAction<unknown>>;
  fontSize?: string;
  transFontSize?: string;
  className?: string;
  padding?: string;
  borderRadius?: string;
  fontWeight?: string;
}

const Btn_white_nomal = styled.span<BTN_White_nomal_comp_Props>`
  cursor: pointer;
  background-color: #ffffff;
  color: #000000;
  padding: ${({ padding }) => padding};
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ fontWeight }) => fontWeight};
  border-radius: ${({ borderRadius }) => borderRadius};
  transform-origin: center;
  transition: 0.2s ease;
  text-align: center;
  border: 0.5px solid black;
  &:hover {
    background-color: #000000;
    color: #ffffff;
  }
  &:active {
    font-size: ${({ transFontSize }) => transFontSize};
    text-align: center;
    background-color: white;
  }
`;

export default function BTN_white_nomal_comp({
  children,
  onClickEvent,
  fontSize,
  transFontSize,
  className,
  padding,
  borderRadius,
  fontWeight,
}: BTN_White_nomal_comp_Props) {
  return (
    <Btn_white_nomal
      transFontSize={transFontSize}
      fontSize={fontSize}
      onClick={onClickEvent}
      className={className}
      padding={padding}
      borderRadius={borderRadius}
      fontWeight={fontWeight}
    >
      {children}
    </Btn_white_nomal>
  );
}

BTN_white_nomal_comp.defaultProps = {
  fontSize: '15px',
  padding: '4px 10px',
  borderRadius: '5px',
};
