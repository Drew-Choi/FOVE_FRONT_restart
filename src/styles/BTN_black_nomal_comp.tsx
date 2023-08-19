import React, { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import styled from 'styled-components';

// type
interface BTN_black_nomal_comp_Props extends PropsWithChildren {
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

const Btn_blakc_nomal = styled.span<BTN_black_nomal_comp_Props>`
  cursor: pointer;
  background-color: black;
  color: white;
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
    background-color: #ffffff;
    color: black;
  }
  &:active {
    font-size: ${({ transFontSize }) => transFontSize};
    text-align: center;
    background-color: #848484;
  }
`;

const BTN_black_nomal_comp: React.FC<BTN_black_nomal_comp_Props> = ({
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
}) => {
  return (
    <Btn_blakc_nomal
      transFontSize={transFontSize}
      fontSize={fontSize}
      fontWeight={fontWeight}
      onClick={onClickEvent}
      className={className}
      padding={padding}
      borderRadius={borderRadius}
      marginLeft={marginLeft}
      marginRight={marginRight}
      marginTop={marginTop}
      marginBottom={marginBottom}
    >
      {children}
    </Btn_blakc_nomal>
  );
};

BTN_black_nomal_comp.defaultProps = {
  fontSize: '15px',
  padding: '4px 10px',
  borderRadius: '5px',
};

export default BTN_black_nomal_comp;
