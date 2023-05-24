import React from 'react';

export default function Test() {
  return (
    <>
      {/* //     html: <html><head><script language="JavaScript" type="text/JavaScript">
    //                 location.href="https://trace.cjlogistics.com/web/detail.jsp?"+"slipno=12312312312";
    //         </script>

    // <title>CJ 대한통운 :: 택배WEB상품추적</title>
    // <style>
    // td, body { font-family:굴림; font-size:10pt }
    // a:link { text-decoration:none; color:#4040E0; }
    // a:visited { text-decoration:none; color:#4040E0; }
    // a:active { text-decoration:none; color:#4040E0; }
    // a:hover { text-decoration:none; color:#E04040; }
    // </style>
    // <script language="javascript">
    // <!--
    // //2011.11.11 추가
    // //cashbag연동
    // function gocashbag()
    // {
    //         window.open("https://www.logii.com/interface/delvproms/delv_click.asp?comp_code=cjgls&inv_no=12312312312&login_yn=N&login_id=&login_name=");
    // }
    // -->
    // </script>
    // </head>
    // <body leftmargin="0" topmargin="0" bgcolor="white">
    // <center>
    // <br>
    // <table width="600" align="center">
    //         <tbody><tr>
    // <td align="left"><b>운송장 번호 :  (미등록운송장) </b></td>

    //         </tr>
    // </tbody></table>
    // <br>
    // <table width="600" align="center">
    //         <tbody><tr>
    //                 <td><b>기본정보</b></td>
    //                 <td align="right">
    //                   </td>
    //         </tr>
    // </tbody></table>
    // <table width="600" border="" bordercolor="#8C8C8C" bordercolordark="white" cellpadding="0" cellspacing="0">
    //         <tbody><tr height="22" align="center" bgcolor="#D0D0D0">
    //                 <td>보내는 사람</td>
    //                 <td>받는사람</td>
    //                 <td>수량</td>
    //                 <td>인수자</td>
    //   </tr>
    // <tr height="22">
    // <td colspan="4" align="center" bgcolor="#F6F6F6">등록되지 않은 운송장이거나 올바른 운송장번호가 아닙니다.</td>
    // </tr>

    // </tbody></table>
    // <br>
    // <table width="600" align="center">
    //   <tbody><tr>
    //     <td><b>집배점 정보 &amp; SM 정보</b></td>
    //   </tr>
    // </tbody></table>
    // <table width="600" align="center" border="" bordercolor="#8C8C8C" bordercolordark="white" cellpadding="0" cellspacing="0">
    //   <tbody><tr height="22" align="center" bgcolor="#D0D0D0">
    //     <td>구분</td>
    //     <td>집배점명</td>
    //     <td>집배점 전화번호</td>
    //     <td>SM</td>
    //     <td>SM 이동전화</td>
    //   </tr>
    // <tr height="22">
    // <td colspan="5" align="center" bgcolor="#F6F6F6">해당 정보가 없습니다.</td>
    // </tr>

    // </tbody></table>
    // <br>
    // <table width="600" align="center">
    //         <tbody><tr>
    //                 <td align="left"><b>상품추적 상태</b></td>
    //                 <td align="right"><b><a href="info.jsp?slipno=12312312312">[ 기본보기 ]</a></b></td>
    //                 <td align="right"></td>
    //         </tr>
    // </tbody></table>
    // <table width="600" border="" bordercolor="#8C8C8C" bordercolordark="white" cellpadding="0" cellspacing="0">
    //         <tbody><tr height="22" bgcolor="#D0D0D0" align="center">
    //                 <td width="90">일 자</td>
    //                 <td width="70">시 각</td>
    //                 <td width="370">집배점</td>
    //                 <td width="70">구 분</td>
    //         </tr>
    // <tr height="22">
    // <td colspan="4" align="center" bgcolor="#F6F6F6">해당 정보가 없습니다.</td>
    // </tr>

    // </tbody></table>
    // <br>
    // <a href="http://www.doortodoor.co.kr/" target="_blank"><img src="img/cjkxlogo.gif" width="94" height="51" border="0"></a>
    // </center>

    // </body></html>

    // ----- 성공시 html

    //     <html><head><script language="JavaScript" type="text/JavaScript">
    //                 location.href="https://trace.cjlogistics.com/web/detail.jsp?"+"slipno=656276279413";
    //         </script>

    // <title>CJ 대한통운 :: 택배WEB상품추적</title>
    // <style>
    // td, body { font-family:굴림; font-size:10pt }
    // a:link { text-decoration:none; color:#4040E0; }
    // a:visited { text-decoration:none; color:#4040E0; }
    // a:active { text-decoration:none; color:#4040E0; }
    // a:hover { text-decoration:none; color:#E04040; }
    // </style>
    // <script language="javascript">
    // <!--
    // //2011.11.11 추가
    // //cashbag연동
    // function gocashbag()
    // {
    //         window.open("https://www.logii.com/interface/delvproms/delv_click.asp?comp_code=cjgls&inv_no=656276279413&login_yn=N&login_id=&login_name=");
    // }
    // -->
    // </script>
    // </head>
    // <body leftmargin="0" topmargin="0" bgcolor="white">
    // <center>
    // <br>
    // <table width="600" align="center">
    //         <tbody><tr>
    // <td align="left"><b>운송장 번호 : 656276279413 (집화처리)</b></td>

    //         </tr>
    // </tbody></table>
    // <br>
    // <table width="600" align="center">
    //         <tbody><tr>
    //                 <td><b>기본정보</b></td>
    //                 <td align="right">
    //                   <a href="javascript:gocashbag();"><img src="img/btn_okCash_new.png" width="386" height="19" border="0"></a></td>
    //         </tr>
    // </tbody></table>
    // <table width="600" border="" bordercolor="#8C8C8C" bordercolordark="white" cellpadding="0" cellspacing="0">
    //         <tbody><tr height="22" align="center" bgcolor="#D0D0D0">
    //                 <td>보내는 사람</td>
    //                 <td>받는사람</td>
    //                 <td>수량</td>
    //                 <td>인수자</td>
    //   </tr>
    // <tr height="22" align="center" bgcolor="#F6F6F6">
    // <td> &nbsp;그*일&nbsp; </td>
    // <td> &nbsp;김*호&nbsp; </td>
    // <td> &nbsp;1&nbsp; </td>
    // <td> &nbsp;&nbsp; </td>
    // </tr>

    // </tbody></table>
    // <br>
    // <table width="600" align="center">
    //   <tbody><tr>
    //     <td><b>집배점 정보 &amp; SM 정보</b></td>
    //   </tr>
    // </tbody></table>
    // <table width="600" align="center" border="" bordercolor="#8C8C8C" bordercolordark="white" cellpadding="0" cellspacing="0">
    //   <tbody><tr height="22" align="center" bgcolor="#D0D0D0">
    //     <td>구분</td>
    //     <td>집배점명</td>
    //     <td>집배점 전화번호</td>
    //     <td>SM</td>
    //     <td>SM 이동전화</td>
    //   </tr>
    // <tr height="22" align="center" bgcolor="#F6F6F6">
    // <td>집하</td>
    // <td>&nbsp;경기양주덕계&nbsp;</td>
    // <td>&nbsp;010-4500-5339&nbsp;</td>
    // <td>&nbsp;박지훈&nbsp;</td>
    // <td>&nbsp;010-4924-9112&nbsp;</td>
    // </tr>
    // <tr height="22" align="center" bgcolor="#F6F6F6">
    // <td>배송</td>
    // <td>&nbsp;&nbsp;</td>
    // <td>&nbsp;&nbsp;</td>
    // <td>&nbsp;추연배&nbsp;</td>
    // <td>&nbsp;010-6326-8687&nbsp;</td>
    // </tr>

    // </tbody></table>
    // <br>
    // <table width="600" align="center">
    //         <tbody><tr>
    //                 <td align="left"><b>상품추적 상태</b></td>
    //                 <td align="right"><b><a href="info.jsp?slipno=656276279413">[ 기본보기 ]</a></b></td>
    //                 <td align="right"></td>
    //         </tr>
    // </tbody></table>
    // <table width="600" border="" bordercolor="#8C8C8C" bordercolordark="white" cellpadding="0" cellspacing="0">
    //      <tbody><tr height="22" bgcolor="#D0D0D0" align="center">
    //                 <td width="90">일 자</td>
    //                 <td width="70">시 각</td>
    //                 <td width="370">집배점</td>
    //                 <td width="70">구 분</td>
    //               </tr>
    //              <tr height="22" bgcolor="#F6F6F6">
    //                <td align="center">&nbsp;2023-05-24&nbsp;</td>
    //                <td align="center">&nbsp;15:57:02&nbsp;</td>
    //                <td align="center">
    //     <table>
    //       <tbody>
    //         <tr>
    //           <td width="140">&nbsp;경기양주덕계&nbsp;</td>
    //           <td width="130">&nbsp;Tel : 경기양주덕계(070-7573-7339)&nbsp;</td>
    //         </tr>
    //       </tbody>
    //      </table>
    //                </td>
    //                <td align="center">&nbsp;집화처리&nbsp;</td>
    //              </tr>

    // </tbody></table>
    // <br>
    // <a href="http://www.doortodoor.co.kr/" target="_blank"><img src="img/cjkxlogo.gif" width="94" height="51" border="0"></a>
    // </center>

    // </body></html>

    // --> 한진택배 코드 분석
    // <div class=\"delivery-step\">
    //   <ul>
    //     <li>
    //       <span class=\"ico-wr\">
    //         <span class=\"ico ico1\"></span>
    //       </span>
    //       <span class=\"num\">STEP1</span>
    //       <span class=\"txt\">
    //         <span>상품<br>접수</span>
    //       </span>
    //     </li>

    //     <li>
    //       <span class=\"ico-wr\">
    //         <span class=\"ico ico2\"></span>
    //       </span>
    //       <span class=\"num\">STEP2</span>
    //       <span class=\"txt\">
    //         <span>터미널<br>입고</span>
    //       </span>
    //     </li>

    //     <li>
    //       <span class=\"ico-wr\">
    //         <span class=\"ico ico3\"></span>
    //       </span>
    //       <span class=\"num\">STEP3</span>
    //       <span class=\"txt\">
    //         <span>상품<br>이동중</span>
    //       </span>
    //     </li>

    //     <li>
    //       <span class=\"ico-wr\">
    //         <span class=\"ico ico4\"></span>
    //       </span>
    //       <span class=\"num\">STEP4</span>
    //       <span class=\"txt\">
    //         <span>배송<br>터미널<br>도착</span>
    //       </span>
    //     </li>

    //     <li>
    //       <span class=\"ico-wr\">
    //         <span class=\"ico ico5\"></span>
    //       </span>
    //       <span class=\"num\">STEP5</span>
    //       <span class=\"txt\">
    //         <span>배송<br>출발</span>
    //       </span>
    //     </li>

    //     <li class=\"on\">
    //       <span class=\"ico-wr\">
    //         <span class=\"ico ico6\"></span>
    //       </span>
    //       <span class=\"num\">STEP6</span>
    //       <span class=\"txt\">
    //         <span>배송<br>완료</span>
    //       </span>
    //     </li>
    //   </ul>
    // </div>

    // <span class=\"stateDesc\"> 고객님 상품을  <strong>접수</strong>하였습니다. </span> */}

      {/* 
    <div class="delivery-time">
      <p class="cal-sec">
        <span class="date">2023-05-23</span>
        <span class="time">13:26</span>
      </p>
        <p class="comm-sec">
          <span class="comm-ico comm-ico06"></span>
          <strong>배송완료</strong> 되었습니다.
        </p>
    </div> */}
    </>
  );
}
