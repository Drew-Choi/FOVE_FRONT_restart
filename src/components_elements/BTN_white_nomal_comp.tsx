import React, {
  CSSProperties,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
} from 'react';
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
  hoverBackgroundColor?: string;
  backgroundColor?: string;
  value?: string;
  fontColor?: string;
  hoverFontColor?: string;
  activeBackgroundColor?: string;
  activeColor?: string;
  style?: CSSProperties;
}

const Btn_white_nomal = styled.button<BTN_White_nomal_comp_Props>`
  all: unset;
  cursor: pointer;
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ fontColor }) => fontColor};
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
    background-color: ${({ hoverBackgroundColor }) => hoverBackgroundColor};
    color: ${({ hoverFontColor }) => hoverFontColor};
  }
  &:active {
    font-size: ${({ transFontSize }) => transFontSize};
    text-align: center;
    background-color: ${({ activeBackgroundColor }) => activeBackgroundColor};
    color: ${({ activeColor }) => activeColor};
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
  hoverBackgroundColor,
  backgroundColor,
  value,
  fontColor,
  hoverFontColor,
  activeBackgroundColor,
  activeColor,
  style,
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
      hoverBackgroundColor={hoverBackgroundColor}
      backgroundColor={backgroundColor}
      value={value}
      fontColor={fontColor}
      hoverFontColor={hoverFontColor}
      activeBackgroundColor={activeBackgroundColor}
      activeColor={activeColor}
      style={style}
    >
      {children}
    </Btn_white_nomal>
  );
}

BTN_white_nomal_comp.defaultProps = {
  fontSize: '15px',
  padding: '4px 10px',
  borderRadius: '5px',
  hoverBackgroundColor: '#000000',
  hoverFontColor: '#ffffff',
  backgroundColor: '#ffffff',
  activeBackgroundColor: '#ffffff',
  fontColor: '#000000',
  activeColor: '#000000',
};
