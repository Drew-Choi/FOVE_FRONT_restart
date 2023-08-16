import React, { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import styled from 'styled-components';

// type
interface BTN_black_nomal_comp_Props extends PropsWithChildren {
  onClickEvent?: () => void | Dispatch<SetStateAction<unknown>>;
  fontSize?: string;
  transFontSize?: string;
  className?: string;
  padding?: string;
  borderRadius?: string;
}

const Btn_blakc_nomal = styled.span<BTN_black_nomal_comp_Props>`
  cursor: pointer;
  background-color: black;
  color: white;
  padding: ${(props) => props.padding};
  font-size: ${(props) => props.fontSize};
  border-radius: ${(props) => props.borderRadius};
  transform-origin: center;
  transition: 0.2s ease;
  text-align: center;
  border: 0.5px solid black;
  &:hover {
    background-color: #ffffff;
    color: black;
  }
  &:active {
    font-size: ${(props) => props.transFontSize};
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
}) => {
  return (
    <Btn_blakc_nomal
      transFontSize={transFontSize}
      fontSize={fontSize}
      onClick={onClickEvent}
      className={className}
      padding={padding}
      borderRadius={borderRadius}
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
