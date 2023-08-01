import React from 'react';
import { Outlet } from 'react-router-dom';
import Header_client from '../client_components/client_comp_Header_Footer/Header_client';
import Footer_client from '../client_components/client_comp_Header_Footer/Footer_client';

export default function Client_main() {
  return (
    <>
      <Header_client />
      <Outlet></Outlet>
      <Footer_client />
    </>
  );
}
