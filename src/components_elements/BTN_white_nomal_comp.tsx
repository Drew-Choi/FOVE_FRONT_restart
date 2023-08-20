import React, { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import styled from 'styled-components';

// type
interface BTN_White_nomal_comp_Props extends PropsWithChildren {
  onClickEvent?: (e?: any) => (void | any) | Dispatch<SetStateAction<unknown>>;
  fontSize?: string;
  transFontSize?: string;
  className?: string;
  padding?: string;
  borderRadius?: string;
  fontWeight?: string;
  marginLeft?: string;
  marginRight?: string;
  marginTop?: string;
  marginBottom?: string;
}

const Btn_white_nomal = styled.button<BTN_White_nomal_comp_Props>`
  all: unset;
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
  margin-left: ${({ marginLeft }) => marginLeft};
  margin-right: ${({ marginRight }) => marginRight};
  margin-top: ${({ marginTop }) => marginTop};
  margin-bottom: ${({ marginBottom }) => marginBottom};
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
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
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
      marginLeft={marginLeft}
      marginRight={marginRight}
      marginTop={marginTop}
      marginBottom={marginBottom}
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
