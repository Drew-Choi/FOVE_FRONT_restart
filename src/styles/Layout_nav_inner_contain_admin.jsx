import React from 'react';
import styled from 'styled-components';
import NavBar_admin from '../components_pages/admin_components/NavBar_admin';

const Layout_container = styled.main`
  display: flex;
  position: relative;
`;

const Layout_inner = styled.section`
  position: relative;
  display: block;
  background-color: red;
  width: 90vw;
`;

export default function Layout_nav_inner_contain_admin({ children }) {
  return (
    <Layout_container>
      <NavBar_admin />
      <Layout_inner>{children}</Layout_inner>
    </Layout_container>
  );
}
