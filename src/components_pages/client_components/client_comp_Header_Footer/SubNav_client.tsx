import React, { ChangeEvent } from 'react';
import MediaQuery from 'react-responsive';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const NavBar = styled.nav`
  position: relative;
  background-color: white;
  border-bottom: solid 0.5px black;
`;
const Ul = styled.ul`
  display: flex;
  padding-top: 12px;
  padding-bottom: 2px;
  padding-left: 35px;
  padding-right: 35px;
  align-items: center;

  @media screen and (max-width: 610px) {
    padding-left: 20px;
    padding-right: 20px;
  }
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

//반응형 카테고리 셀렉트 메뉴
const SelectCategorys = styled.select`
  position: absolute;
  margin: 10px;
  font-size: 13px;
  left: 10px;
  z-index: 6;
`;

// 서브메뉴 추가하는 곳
const sub_menu = [
  {
    label: 'VIEW ALL',
    clickPath: '/store',
  },
  {
    label: 'NEW ARRIVALS',
    clickPath: '/store/new',
  },
  {
    label: 'BEANIE',
    clickPath: '/store/beanie',
  },
  {
    label: 'CAP',
    clickPath: '/store/cap',
  },
  {
    label: 'TRAINING',
    clickPath: '/store/training',
  },
  {
    label: 'WINDBREAKER',
    clickPath: '/store/windbreaker',
  },
];

export default function SubNav_client() {
  const navi = useNavigate();
  const category = useParams();
  const location = useLocation();
  const currentURL = location.pathname;

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const eValue = e.currentTarget.value;

    for (const el of sub_menu) {
      if (eValue === el.label) {
        return navi(`${el.clickPath}`);
      }
    }
  };

  const selectCategory = () => {
    for (const el of sub_menu) {
      if (`/store/${category}` === el.clickPath) {
        return el.label;
      }
    }
  };

  // 인트로 화면에서는 안나오게 설정
  if (currentURL !== '/')
    return (
      <>
        <MediaQuery minWidth={576}>
          <NavBar>
            <Ul>
              {sub_menu.map((el) => (
                <Li key={el.label} onClick={() => navi(el.clickPath)}>
                  {el.label}
                </Li>
              ))}
            </Ul>
          </NavBar>
        </MediaQuery>

        <MediaQuery maxWidth={575}>
          <SelectCategorys
            value={selectCategory()}
            onChange={handleCategoryChange}
          >
            {sub_menu.map((el) => (
              <option value={el.label} key={el.label}>
                {el.label}
              </option>
            ))}
          </SelectCategorys>
        </MediaQuery>
      </>
    );

  return <></>;
}
