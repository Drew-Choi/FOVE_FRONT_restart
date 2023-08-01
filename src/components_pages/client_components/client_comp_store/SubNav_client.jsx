import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const NavBar = styled.nav`
  position: relative;
  top: ${(props) => props.top};
  background-color: white;
  border-bottom: solid 0.5px black;
  bottom: ${(props) => props.bottom};
`;
const Ul = styled.ul`
  display: flex;
  padding-top: 12px;
  padding-bottom: 2px;
  padding-left: 35px;
  align-items: center;
`;

const Li = styled.li`
  cursor: pointer;
  padding: 5px 20px 2px;
  font-size: 70%;
  list-style: none;
  color: rgb(84, 84, 84);
  &:hover {
    color: rgb(0, 0, 0);
  }
`;

export default function SubNav_client({ menuList, bottom, top }) {
  const navi = useNavigate();

  return (
    <NavBar bottom={bottom} top={top}>
      <Ul>
        {menuList.map((el) => (
          <Li key={el.label} onClick={() => navi(el.clickPath)}>
            {el.label}
          </Li>
        ))}
      </Ul>
    </NavBar>
  );
}
