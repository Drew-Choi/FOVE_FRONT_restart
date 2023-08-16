import React from 'react';
import { Outlet } from 'react-router-dom';
import Header_admin from './Header_admin';
import Footer_client from '../client_components/client_comp_Header_Footer/Footer_client';
import NavBar_admin from './NavBar_admin';
import styled from 'styled-components';

const Section = styled.section`
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  /* background-color: red; */

  @media screen and (max-width: 667px) {
    display: block;
  }
`;

export default function Admin_main() {
  return (
    <>
      <Header_admin />
      <Section>
        <NavBar_admin />
        <Outlet></Outlet>
      </Section>
      <Footer_client />
    </>
  );
}
