/* eslint-disable no-undef */
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import orderListIndi from '../../styles/orderList_Indi_Admin.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import LoadingAdmin from '../client_components/LoadingAdmin';
import Loading_Spinner from '../client_components/Loading_Spinner';
import BTN_black_nomal_comp from '../../components_elements/BTN_black_nomal_comp';
import BTN_white_nomal_comp from '../../components_elements/BTN_white_nomal_comp';
import Input_Custom from '../../components_elements/Input_Custom';

const { REACT_APP_KEY_IMAGE } = process.env;
const { REACT_APP_KEY_BACK } = process.env;

const Pd_Images = styled.div<{ img: string }>`
  ${(props) =>
    props.img && `background-image: url('${REACT_APP_KEY_IMAGE}${props.img}')`}
`;

const Preview = styled.img`
  position: relative;
  display: block;
  box-sizing: content-box;
  width: 40vw;
  height: auto;
  padding: 10px;
  margin: 0px 0px 10px 0px;
  border-bottom: 0.5px solid black;

  @media screen and (max-width: 1000px) {
    width: 65vw;
  }

  @media screen and (max-width: 510px) {
    width: 80vw;
  }

  @media screen and (max-width: 280px) {
    width: 85vw;
    padding: 10px 0px;
  }
`;

// constant
const dateSplit = (date: string) => {
  const splitData = date.split(/[T+]/);
  const dataSum = `${splitData[0]}  /  ${splitData[1]}`;
  return dataSum;
};

export default function OrderList_Indi_Admin() {
  const [data, setData] = useState<Order_Cancel_ListType | null>(null);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [status, setStatus] = useState<string | null>(null);
  const [redirect, setRedirect] = useState<boolean>(true);

  // 스피너 상태 훅
  const [spinner, setSpinner] = useState<boolean>(false);

  // 라디오 박스 useState - 관리자 컨트롤 부분 - 배송상태
  const [adminShippingCondition, setAdminShippingCondition] = useState<
    string | null
  >(null);
  // 라디오 박스 활성화 - 배송상태
  const [disableShipping, setDisableShipping] = useState(true);
  // 라디오 박스 체크시 상태값 변경 - 배송상태
  const handleAdminShippingCondition = (e: ChangeEvent<HTMLInputElement>) => {
    setAdminShippingCondition(e.target.value);
  };
  // 송장번호 입력
  const [shippingCodeChange, setShippingCodeChange] = useState<string>('');
  // 송장번호 수정 핸들
  const handleShippingCode = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^\d+$/;

    if (regex.test(value) || value === '') {
      setShippingCodeChange(value);
    }
  };

  // 배송상태 백엔드 요청
  const req_AdminShippingCondition = async () => {
    const updateConfirm = confirm(
      `주문번호: ${orderId}\n배송상태변경을 진행하시겠습니까?`,
    );

    if (!updateConfirm) return alert('변경 취소');
    // true라면 아래 진행
    if (shippingCodeChange.length < 10)
      return alert('유효한 송장번호는 10자 이상입니다.');
    // true라면 아래 진행
    if (adminShippingCondition === '배송 중' && shippingCodeChange === '')
      return alert("'배송 중'으로 변경 시에는 유효한 송장번호를 입력해주세요.");

    //아니라면 아래
    setSpinner(true);
    try {
      const response = await axios.post(
        `${REACT_APP_KEY_BACK}/admin/orderlist/detail/shippingCondition`,
        {
          adminShippingCondition,
          orderId,
          shippingCode: shippingCodeChange,
        },
      );

      if (response.status === 200) {
        // 200번대 성공이라면,
        setRedirect((cur) => !cur);
        setDisableShipping(true);
        setSpinner(false);
        alert('변경성공');
        return;
      }
    } catch (err: any) {
      if (err.response.status === 404) {
        setRedirect((cur) => !cur);
        alert(err.response.data);
        setSpinner(false);
      }
      navigate(
        `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
      );
      setSpinner(false);
      return;
    }
  };

  // 라디오 박스 useState - 관리자 컨트롤 부분 - 교환진행상태
  const [adminChangeCondition, setAdminChangeCondition] = useState<
    string | null
  >(null);
  // 라디오 박스 활성화 - 교환진행상태
  const [disableChange, setDisableChange] = useState<boolean>(true);
  // 라디오 박스 체크시 상태값 변경 - 교환진행상태
  const handleadminChangeCondition = (e: ChangeEvent<HTMLInputElement>) => {
    setAdminChangeCondition(e.target.value);
  };
  // 송장번호 입력-교환진행상태
  const [changeShippingCodeChagne, setChangeShippingCodeChagne] =
    useState<string>('');
  // 송장번호 수정 핸들-교환진행상태
  const handleChangeShippingCodeChagne = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^\d+$/;

    if (regex.test(value) || value === '') {
      setChangeShippingCodeChagne(value);
    }
  };

  const req_AdminChangeCondition = async () => {
    const updateConfirm = confirm(
      `주문번호: ${orderId}\n교환진행상태 변경을 진행하시겠습니까?`,
    );

    if (!updateConfirm) return alert('변경 취소');
    // true라면 아래 진행

    if (changeShippingCodeChagne.length < 10)
      return alert('유효한 송장번호는 10자 이상입니다.');
    // true이면 아래 진행
    setSpinner(true);
    try {
      const response = await axios.post(
        `${REACT_APP_KEY_BACK}/admin/orderlist/detail/changeCondition`,
        {
          adminChangeCondition,
          orderId,
          shippingCode: changeShippingCodeChagne,
        },
      );

      if (response.status === 200) {
        // 200번대 성공이라면,
        setRedirect((cur) => !cur);
        setDisableChange(true);
        alert('변경성공');
        setSpinner(false);
        return;
      }
    } catch (err: any) {
      if (err.response.status === 404) {
        setRedirect((cur) => !cur);
        alert(err.response.data);
        setSpinner(false);
      } else if (err.response.status === 400) {
        setRedirect((cur) => !cur);
        alert(err.response.data);
        setSpinner(false);
      } else {
        setSpinner(false);
        return alert('변경실패');
      }
      return;
    }
  };

  // 라디오 박스 useState - 관리자 컨트롤 부분 - 환불진행상태
  const [adminSubmitReturnCondition, setAdminSubmitReturnCondition] = useState<
    string | null
  >(null);
  // 라디오 박스 활성화 - 환불진행상태
  const [disableReturn, setDisableReturn] = useState<boolean>(true);
  // 라디오 박스 체크시 상태값 변경 - 환불진행상태
  const handleadminSubmitReturnCondition = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setAdminSubmitReturnCondition(e.target.value);
  };
  // 송장번호 입력-환불진행상태
  const [returnCodeChange, setReturnCodeChange] = useState<string>('');
  // 송장번호 수정 핸들-환불진행상태
  const handleReturnCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^\d+$/;

    if (regex.test(value) || value === '') {
      setReturnCodeChange(value);
    }
  };

  // 배송상태 백엔드 요청
  const req_AdminSubmitReturnCondition = async () => {
    const updateConfirm = confirm(
      `주문번호: ${orderId}\n환불진행상태 변경을 진행하시겠습니까?`,
    );

    if (!updateConfirm) return alert('변경 취소');
    // true라면 아래 진행
    if (returnCodeChange.length < 10)
      return alert('유효한 송장번호는 10자 이상입니다.');
    // true라면 아래 진행
    setSpinner(true);
    try {
      const response = await axios.post(
        `${REACT_APP_KEY_BACK}/admin/orderlist/detail/submitReturnCondition`,
        {
          adminSubmitReturnCondition,
          orderId,
          shippingCode: returnCodeChange,
        },
      );

      if (response.status === 200) {
        // 200번대 성공이라면,
        setRedirect((cur) => !cur);
        setDisableReturn(true);
        alert('변경성공');
        setSpinner(false);
        return;
      }
    } catch (err: any) {
      if (err.response.status === 404) {
        setRedirect((cur) => !cur);
        alert(err.response.data);
        setSpinner(false);
      } else if (err.response.status === 400) {
        setRedirect((cur) => !cur);
        alert(err.response.data);
        setSpinner(false);
      } else {
        setSpinner(false);
        return alert('변경실패');
      }
      setSpinner(false);
      return;
    }
  };

  const statusCheck = useCallback(
    (data: Order_Cancel_ListType) => {
      if (
        data.payments.status !== 'DONE' &&
        !data.isShipping &&
        data.shippingCode === 0 &&
        !data.isDelivered &&
        !data.isCancel &&
        !data.isReturn &&
        !data.isRetrieved &&
        !data.isRefund &&
        !data.isReturnSubmit
      ) {
        setStatus('결제 전');
        setAdminShippingCondition('결제 전');
        return;
      } else if (
        data.payments.status === 'DONE' &&
        !data.isShipping &&
        data.shippingCode === 0 &&
        !data.isDelivered &&
        !data.isCancel &&
        !data.isReturn &&
        !data.isRetrieved &&
        !data.isRefund &&
        !data.isReturnSubmit
      ) {
        setStatus('결제완료 (배송 전)');
        setAdminShippingCondition('결제완료 (배송 전)');
        return;
      } else if (
        data.payments.status === 'DONE' &&
        data.isShipping &&
        data.shippingCode !== 0 &&
        !data.isDelivered &&
        !data.isCancel &&
        !data.isReturn &&
        !data.isRetrieved &&
        !data.isRefund &&
        !data.isReturnSubmit
      ) {
        setStatus('배송 중');
        setAdminShippingCondition('배송 중');
        return;
      } else if (
        data.payments.status === 'DONE' &&
        !data.isShipping &&
        data.shippingCode !== 0 &&
        data.isDelivered &&
        !data.isCancel &&
        !data.isReturn &&
        !data.isRetrieved &&
        !data.isRefund &&
        !data.isReturnSubmit
      ) {
        setStatus('배송완료');
        setAdminShippingCondition('배송완료');
        return;
      } else if (
        data.payments.status === 'DONE' &&
        !data.isShipping &&
        data.shippingCode !== 0 &&
        data.isDelivered &&
        !data.isCancel &&
        !data.isReturn &&
        !data.isRetrieved &&
        !data.isRefund &&
        data.isReturnSubmit
      ) {
        setStatus('반품신청 중');
        setAdminShippingCondition('배송완료');
        return;
      } else if (
        data.payments.status === 'DONE' &&
        !data.isShipping &&
        data.shippingCode !== 0 &&
        data.isDelivered &&
        !data.isCancel &&
        !data.isReturn &&
        !data.isRetrieved &&
        data.isRefund &&
        data.isReturnSubmit
      ) {
        setStatus('환불신청완료');
        setAdminShippingCondition('배송완료');
        setAdminSubmitReturnCondition('환불신청완료');
        return;
      } else if (
        data.payments.status === 'DONE' &&
        data.isShipping &&
        data.shippingCode !== 0 &&
        data.isDelivered &&
        !data.isCancel &&
        !data.isReturn &&
        !data.isRetrieved &&
        data.isRefund &&
        data.isReturnSubmit
      ) {
        setStatus('상품회수 중 (환불)');
        setAdminShippingCondition('');
        setAdminSubmitReturnCondition('상품회수 중 (환불)');
        return;
      } else if (
        data.payments.status === 'DONE' &&
        !data.isShipping &&
        data.shippingCode !== 0 &&
        !data.isDelivered &&
        !data.isCancel &&
        !data.isReturn &&
        data.isRetrieved &&
        data.isRefund &&
        data.isReturnSubmit
      ) {
        setStatus('상품회수 완료 (환불)');
        setAdminShippingCondition('');
        setAdminSubmitReturnCondition('상품회수 완료 (환불)');
        return;
      } else if (
        data.payments.status === 'DONE' &&
        !data.isShipping &&
        data.shippingCode !== 0 &&
        data.isDelivered &&
        !data.isCancel &&
        data.isReturn &&
        !data.isRetrieved &&
        !data.isRefund &&
        data.isReturnSubmit
      ) {
        setStatus('교환신청 완료');
        setAdminShippingCondition('배송완료');
        setAdminChangeCondition('교환신청 완료');
        return;
      } else if (
        data.payments.status === 'DONE' &&
        data.isShipping &&
        data.shippingCode !== 0 &&
        data.isDelivered &&
        !data.isCancel &&
        data.isReturn &&
        !data.isRetrieved &&
        !data.isRefund &&
        data.isReturnSubmit
      ) {
        setStatus('상품회수 중 (교환)');
        setAdminShippingCondition('');
        setAdminChangeCondition('상품회수 중 (교환)');
        return;
      } else if (
        data.payments.status === 'DONE' &&
        !data.isShipping &&
        data.shippingCode !== 0 &&
        !data.isDelivered &&
        !data.isCancel &&
        data.isReturn &&
        data.isRetrieved &&
        !data.isRefund &&
        data.isReturnSubmit
      ) {
        setStatus('상품회수 완료 (교환)');
        setAdminShippingCondition('');
        setAdminChangeCondition('상품회수 완료 (교환)');
        return;
      } else if (
        data.payments.status === 'DONE' &&
        data.isShipping &&
        data.shippingCode !== 0 &&
        !data.isDelivered &&
        !data.isCancel &&
        data.isReturn &&
        data.isRetrieved &&
        !data.isRefund &&
        data.isReturnSubmit
      ) {
        setStatus('교환상품 배송 중');
        setAdminShippingCondition('');
        setAdminChangeCondition('교환상품 배송 중');
        return;
      } else if (
        data.payments.status === 'DONE' &&
        !data.isShipping &&
        data.shippingCode !== 0 &&
        data.isDelivered &&
        !data.isCancel &&
        data.isReturn &&
        !data.isRetrieved &&
        !data.isRefund &&
        !data.isReturnSubmit
      ) {
        setStatus('교환상품 배송완료');
        setAdminShippingCondition('');
        setAdminChangeCondition('교환상품 배송완료');
        return;
      } else if (
        data.payments.status === 'CANCELED' &&
        !data.isShipping &&
        data.shippingCode === 0 &&
        !data.isDelivered &&
        data.isCancel &&
        !data.isReturn &&
        !data.isRetrieved &&
        !data.isRefund &&
        !data.isReturnSubmit
      ) {
        setStatus('결제취소');
        return;
      } else if (
        data.payments.status === 'CANCELED' &&
        !data.isShipping &&
        data.shippingCode !== 0 &&
        !data.isDelivered &&
        data.isCancel &&
        !data.isReturn &&
        data.isRetrieved &&
        data.isRefund &&
        data.isReturnSubmit
      ) {
        setStatus('환불완료');
        return;
      }
    },
    [redirect],
  );

  // 배송 전 결제
  const pdCancel = async () => {
    const updateConfirm = confirm(
      `주문번호: ${orderId}\n관리자권환으로 결제취소(환불)를 진행하시겠습니까?`,
    );

    if (!updateConfirm) return setRedirect((cur) => !cur), alert('실행 취소');

    // confirm이 true이면
    setSpinner(true);
    try {
      const cancelInfo = await axios.post(
        `${REACT_APP_KEY_BACK}/admin/orderlist/detail/cancel`,
        { orderId },
      );

      if (cancelInfo.status === 200) {
        // 200번대 성공이면,
        alert(`주문번호: ${orderId}\n결제취소(환불) 완료`);
        navigate('/admin/orderlist');
        setSpinner(false);
        return;
      }
    } catch (err: any) {
      navigate(
        `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
      );
      console.error(err);
      setSpinner(false);
      return;
    }
  };

  // 상품 수령 전 환불 진행 신청
  const submitRefund = async () => {
    const updateConfirm = confirm(
      `주문번호: ${orderId}\n환불진행을 신청하시겠습니까?`,
    );

    if (!updateConfirm) return alert('환불 진행 취소');
    //true 라면 아래
    setSpinner(true);
    try {
      const cancelInfo = await axios.post(
        `${REACT_APP_KEY_BACK}/admin//orderlist/detail/cancelRefund`,
        { orderId },
      );

      if (cancelInfo.status === 200) {
        // 200번대 성공이면,
        setRedirect((cur) => !cur);
        alert(
          `주문번호: ${orderId}\n환불을 완료했습니다.\n'상품회수 목록'을 통해 상품회수를 진행하십시오.`,
        );
        setSpinner(false);
        return;
      }
    } catch (err: any) {
      navigate(
        `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
      );
      console.error(err);
      setSpinner(false);
      return;
    }
  };

  // 환불신청 철회
  const submitRefundCancel = async () => {
    const update = confirm(`상품회수 상태를 확인하셨습니까?`);

    if (!update)
      return alert('철회 취소\n회수상태를 체크 후 철회 신청해주세요.');
    // true 이면,
    const updateConfirm = confirm(
      `주문번호: ${orderId}\n환불신청 철회를 진행하시겠습니까?`,
    );

    if (!updateConfirm) return alert('철회 취소');
    // true이면,
    setSpinner(true);
    try {
      const cancelInfo = await axios.post(
        `${REACT_APP_KEY_BACK}/admin//orderlist/detail/cancelRefund/cancel`,
        { orderId },
      );

      if (cancelInfo.status === 200) {
        // 200번대 성공이면,
        setRedirect((cur) => !cur);
        alert(`주문번호: ${orderId}\n환불신청 철회 완료`);
        setSpinner(false);
        return;
      }
    } catch (err: any) {
      navigate(
        `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
      );
      console.error(err);
      setSpinner(false);
      return;
    }
  };

  // 교환신청 철회
  const adminPdChangeCancel = async () => {
    const update = confirm(`상품회수 상태를 확인하셨습니까?`);

    if (!update)
      return alert('철회 취소\n회수상태를 체크 후 철회 신청해주세요.');
    // true 이면,
    const updateConfirm = confirm(
      `주문번호: ${orderId}\n환불신청 철회를 진행하시겠습니까?`,
    );

    if (!updateConfirm) return alert('철회 취소');
    // true이면,
    setSpinner(true);
    try {
      const cancelInfo = await axios.post(
        `${REACT_APP_KEY_BACK}/admin/orderlist/detail/cancelRefund/cancel`,
        { orderId },
      );

      if (cancelInfo.status === 200) {
        // 200번대 성공이면,
        setRedirect((cur) => !cur);
        alert(`주문번호: ${orderId}\n교환신청 철회 완료`);
        setSpinner(false);
        return;
      }
    } catch (err: any) {
      navigate(
        `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
      );
      console.error(err);
      setSpinner(false);
      return;
    }
  };

  // 상품 수령 후 결제취소
  const pdCancelRefund = async () => {
    const updateConfirm1 = confirm(
      `주문번호: ${orderId}\n상품을 회수하셨습니까?`,
    );

    if (!updateConfirm1) return alert('상품 회수 후\n진행바랍니다.');
    // true라면,

    const updateConfirm2 = confirm(
      `주문번호: ${orderId}\n관리자권환으로 환불을 진행하시겠습니까?`,
    );
    if (!updateConfirm2)
      return setRedirect((cur) => !cur), alert('환불진행 취소');

    // confirm이 true이면
    setSpinner(true);
    try {
      const cancelInfo = await axios.post(
        `${REACT_APP_KEY_BACK}/admin/orderlist/detail/cancelRefund/complete`,
        { orderId },
      );

      if (cancelInfo.status === 200) {
        // 200번대 성공이면,
        setSpinner(false);
        alert(`주문번호: ${orderId}\n환불을 완료했습니다.`);
        navigate('/admin/orderlist');
        return;
      }
    } catch (err: any) {
      navigate(
        `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
      );
      console.error(err);
    }
    setSpinner(false);
  };

  // 반품신청 취소
  const cancelSubmit = async () => {
    const updateConfirm = confirm(
      `주문번호: ${orderId}\n반품신청 철회를 진행하시겠습니까?`,
    );

    if (!updateConfirm) return alert('철회진행 취소');
    // true이면 아래 진행
    setSpinner(true);
    try {
      const response = await axios.post(
        `${REACT_APP_KEY_BACK}/admin/orderlist/detail/cancel_return_submit`,
        { orderId },
      );

      if (response.status === 200) {
        // 200번대 성공이면
        alert(`주문번호: ${orderId}\n반품신청철회 완료`);
        setRedirect((cur) => !cur);
        setSpinner(false);
        return;
      }
    } catch (err: any) {
      navigate(
        `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
      );
      console.error(err);
      setSpinner(false);
    }
  };

  // 강제주문취소
  const forceDelete = async () => {
    const updateConfirm = confirm('입금 전, 강제주문취소를 진행하시겠습니까?');

    if (!updateConfirm) return alert('주문내역 삭제 진행 취소');
    //true라면,
    setSpinner(true);
    try {
      const response = await axios.get(
        `${REACT_APP_KEY_BACK}/admin/orderlist/detail/order_delete/${orderId}`,
      );

      if (response.status === 200) {
        //200번대 잘 들어온다면,
        alert(`주문번호: ${orderId}\n입금 전 강제주문취소 완료`);
        navigate('/admin/orderlist');
        setSpinner(false);
        return;
      }
    } catch (err: any) {
      navigate(
        `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
      );
      console.error(err);
      setSpinner(false);
    }
  };

  // 교환신청
  const adminPdChange = async () => {
    const updateConfirm = confirm(
      `주문번호: ${orderId}\n상품교환을 진행하시겠습니까?`,
    );

    if (!updateConfirm) return alert('교환진행 취소');
    // true라면,
    setSpinner(true);
    try {
      const response = await axios.get(
        `${REACT_APP_KEY_BACK}/admin/orderlist/detail/order_return/${orderId}`,
      );

      if (response.status === 200) {
        // 200번대 성공이라면,
        alert(`주문번호: ${orderId}\n교환진행 완료`);
        setRedirect((cur) => !cur);
        setSpinner(false);
        return;
      }
    } catch (err: any) {
      navigate(
        `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
      );
      console.error(err);
      setSpinner(false);
      return;
    }
  };

  useEffect(() => {
    const getOrderIdInfo = async () => {
      try {
        const response = await axios.get(
          `${REACT_APP_KEY_BACK}/admin/orderlist/detail/${orderId}`,
          {},
        );

        if (response.status !== 200) return alert('데이터오류');
        // 200번대 성공이면
        statusCheck(response.data);
        setShippingCodeChange(response.data.shippingCode);
        setReturnCodeChange(response.data.shippingCode);
        setChangeShippingCodeChagne(response.data.shippingCode);
        setData(response.data);
        return;
      } catch (err: any) {
        navigate(
          `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
        );
        console.error(err);
      }
    };

    getOrderIdInfo();
  }, [redirect]);

  return (
    <div className={orderListIndi.wholContainer}>
      {spinner && <Loading_Spinner />}
      <p className={orderListIndi.mainTitle}>
        ORDER DETAILS &nbsp;
        <span style={{ fontSize: '15px', fontWeight: '400' }}>Admin</span>
      </p>
      <p className={orderListIndi.status}>
        status : <span style={{ fontWeight: '600' }}>{status}</span>
      </p>
      {!data ? (
        <LoadingAdmin />
      ) : (
        <div className={orderListIndi.order_info_wrap}>
          <div className={orderListIndi.orderlist_Check_wrap}>
            <p className={orderListIndi.older_date}>
              주문번호: <strong>{data.payments.orderId}</strong>
            </p>
            {/* 상품영역 */}
            {data.products.map((el, index) => {
              return (
                <div key={index} className={orderListIndi.older_image_info}>
                  <Pd_Images
                    img={el.img}
                    className={orderListIndi.older_image}
                  ></Pd_Images>
                  <div className={orderListIndi.pdnameprice}>
                    <p className={orderListIndi.pdname}>{el.productName}</p>
                    <p className={orderListIndi.pdprice}>
                      <strong style={{ fontSize: '15px' }}>
                        {el.unitSumPrice.toLocaleString('ko-KR')}
                      </strong>
                      KRW /{' '}
                      <strong style={{ fontSize: '15px' }}>
                        {el.quantity.toLocaleString('ko-KR')}
                      </strong>{' '}
                      ea
                    </p>
                    <p className={orderListIndi.pdprice}>
                      SIZE{' '}
                      <strong style={{ fontSize: '15px' }}>{el.size}</strong>
                    </p>
                  </div>
                </div>
              );
            })}
            <p className={orderListIndi.older_detail_info}>
              total ={' '}
              <strong style={{ fontSize: '17px' }}>
                {data.payments.totalAmount.toLocaleString('ko-KR')}{' '}
              </strong>
              KRW /{' '}
              <strong style={{ fontSize: '17px' }}>
                {data.products
                  .reduce((acc, cur) => acc + cur.quantity, 0)
                  .toLocaleString('ko-KR')}
              </strong>{' '}
              ea
            </p>
            {status === '반품신청 중' ||
            status === '환불신청완료' ||
            status === '상품회수 중 (환불)' ||
            status === '상품회수 완료 (환불)' ||
            status == '교환신청 완료' ||
            status == '상품회수 중 (교환)' ||
            status === '상품회수 완료 (교환)' ||
            status === '교환상품 배송 중' ||
            status === '교환상품 배송완료' ? (
              <>
                <p className={orderListIndi.return_title}>반품신청내역</p>
                <p className={orderListIndi.return_reason}>
                  reason:{' '}
                  <span className={orderListIndi.reason_text}>
                    {data.submitReturn?.reason}
                  </span>
                </p>
                <p className={orderListIndi.return_etc}>
                  message:{' '}
                  <span className={orderListIndi.reason_etc_text}>
                    {data.submitReturn?.return_message}
                  </span>
                </p>
              </>
            ) : (
              <></>
            )}

            <p className={orderListIndi.return_reason}>
              stage: <span className={orderListIndi.reason_text}>{status}</span>
            </p>
            <div className={orderListIndi.infoCancelContainer}>
              <div className={orderListIndi.line}></div>
              {status === '반품신청 중' ||
              status === '환불신청완료' ||
              status === '상품회수 중 (환불)' ||
              status === '상품회수 완료 (환불)' ||
              status == '교환신청 완료' ||
              status == '상품회수 중 (교환)' ||
              status === '상품회수 완료 (교환)' ||
              status === '교환상품 배송 중' ||
              status === '교환상품 배송완료' ? (
                data.submitReturn?.return_img?.map((el, index) => {
                  return (
                    <Preview
                      key={index}
                      src={`${REACT_APP_KEY_IMAGE}${data.payments.orderId}/${el}`}
                    ></Preview>
                  );
                })
              ) : (
                <></>
              )}
              <div className={orderListIndi.detailInfoWrap}>
                {status === '결제취소' || status === '환불완료' ? (
                  <p className={orderListIndi.cashTitle}>취소정보</p>
                ) : (
                  <p className={orderListIndi.cashTitle}>결제정보</p>
                )}

                <div className={orderListIndi.cashInfo}>
                  {status === '결제취소' || status === '환불완료' ? (
                    <p className={orderListIndi.payments_date}>
                      취소일시: {dateSplit(data.cancels.canceledAt)}
                    </p>
                  ) : (
                    <p className={orderListIndi.payments_date}>
                      주문일시: {dateSplit(data.payments.approvedAt)}
                    </p>
                  )}
                  <p className={orderListIndi.payments_status}>
                    결제여부:{' '}
                    {data.payments.status !== 'DONE' &&
                    data.payments.status !== 'CANCELED' ? (
                      '결제전'
                    ) : data.payments.status === 'DONE' ? (
                      '결제완료'
                    ) : data.payments.status === 'CANCELED' &&
                      !data.isRefund ? (
                      '결제취소'
                    ) : data.payments.status === 'CANCELED' && data.isRefund ? (
                      '환불완료(결제취소)'
                    ) : (
                      <></>
                    )}
                  </p>
                  <p className={orderListIndi.payments_method}>
                    결제수단: {data.payments.method}
                  </p>
                  <p className={orderListIndi.payments_discount}>
                    할인:{' '}
                    {!data.payments.discount
                      ? '0 ₩'
                      : `${Number(data.payments.discount).toLocaleString(
                          'ko-KR',
                        )} ₩`}
                  </p>
                  {status === '결제취소' || status === '환불완료' ? (
                    <p className={orderListIndi.payments_totalAmount}>
                      취소금액:{' '}
                      {!data.payments.totalAmount
                        ? '0 ₩'
                        : `${data.cancels.cancelAmount.toLocaleString(
                            'ko-KR',
                          )} ₩`}
                    </p>
                  ) : (
                    <p className={orderListIndi.payments_totalAmount}>
                      결제금액:{' '}
                      {!data.payments.totalAmount
                        ? '0 ₩'
                        : `${data.payments.totalAmount.toLocaleString(
                            'ko-KR',
                          )} ₩`}
                    </p>
                  )}
                  {status === '결제취소' || status === '환불완료' ? (
                    <p className={orderListIndi.payments_status}>
                      취소코드(transactionKey):{' '}
                      <span className={orderListIndi.transactionKey}>
                        {data.cancels.transactionKey}
                      </span>
                    </p>
                  ) : (
                    <></>
                  )}
                  {status === '결제취소' || status === '환불완료' ? (
                    <p className={orderListIndi.payments_status}>
                      취소이유:{' '}
                      {status === '환불완료' ? (
                        <span className={orderListIndi.cancel_reason}>
                          {data.submitReturn?.reason} /{' '}
                          {data.cancels.cancelReason}
                        </span>
                      ) : (
                        <span className={orderListIndi.cancel_reason}>
                          {data.cancels.cancelReason}
                        </span>
                      )}
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
                <div className={orderListIndi.line}></div>

                <p className={orderListIndi.cashTitle}>주문정보</p>
                <div className={orderListIndi.cashInfo}>
                  <p className={orderListIndi.userId}>회원ID: {data.user}</p>

                  <p className={orderListIndi.recipient_Name}>
                    받는 분: {data.recipient.recipientName}
                  </p>

                  <p className={orderListIndi.recipient_zipcode}>
                    배송우편번호: {data.recipient.recipientZipcode}
                  </p>

                  <p className={orderListIndi.recipient_address}>
                    배송주소: {data.recipient.recipientAddress}{' '}
                    {data.recipient.recipientAddressDetail}
                  </p>

                  <p className={orderListIndi.recipient_phone}>
                    연락처: {data.recipient.phoneCode} -{' '}
                    {data.recipient.phoneMidNum} - {data.recipient.phoneLastNum}
                  </p>

                  <p className={orderListIndi.recipient_message}>
                    배송메시지: {data.recipient.message}
                  </p>

                  <p className={orderListIndi.shipping_code}>
                    송장번호: {data.shippingCode} (한진)
                  </p>
                </div>
                <div className={orderListIndi.line}></div>
                {status === '결제취소' || status === '환불완료' ? (
                  <></>
                ) : (
                  <>
                    <p className={orderListIndi.adminAreaTitle}>관리자 영역</p>
                    <div className={orderListIndi.adminAreaBox}>
                      <div className={orderListIndi.adminShippingCondition}>
                        <div
                          className={
                            orderListIndi.adminShippingCondition_titleBox
                          }
                        >
                          배송 진행사항 &nbsp;&nbsp;
                          {status === '반품신청 중' ||
                          status === '환불신청완료' ||
                          status === '상품회수 중 (환불)' ||
                          status === '상품회수 완료 (환불)' ||
                          status === '환불완료' ||
                          status === '교환신청 완료' ||
                          status === '상품회수 중 (교환)' ||
                          status === '상품회수 완료 (교환)' ||
                          status === '교환상품 배송 중' ||
                          status === '교환상품 배송완료' ? (
                            <></>
                          ) : disableShipping ? (
                            <BTN_black_nomal_comp
                              borderRadius="20px"
                              fontSize="12px"
                              fontWeight="500"
                              onClickEvent={() =>
                                setDisableShipping((cur) =>
                                  cur === true ? false : true,
                                )
                              }
                            >
                              변경하기
                            </BTN_black_nomal_comp>
                          ) : (
                            <>
                              <BTN_white_nomal_comp
                                borderRadius="20px"
                                fontSize="12px"
                                fontWeight="500"
                                onClickEvent={() => {
                                  setDisableShipping((cur) =>
                                    cur === true ? false : true,
                                  );
                                  setAdminShippingCondition(status);
                                }}
                                marginRight="5px"
                              >
                                취소
                              </BTN_white_nomal_comp>
                              <BTN_black_nomal_comp
                                onClickEvent={req_AdminShippingCondition}
                                borderRadius="20px"
                                fontSize="12px"
                                fontWeight="500"
                              >
                                등록
                              </BTN_black_nomal_comp>
                            </>
                          )}
                        </div>

                        <Input_Custom
                          type="radio"
                          name="adminShippingCondition"
                          value="결제 전"
                          checked={adminShippingCondition === '결제 전'}
                          onChangeEvent={handleAdminShippingCondition}
                          disabled={disableShipping}
                        >
                          결제 전
                        </Input_Custom>
                        <Input_Custom
                          type="radio"
                          name="adminShippingCondition"
                          value="결제완료 (배송 전)"
                          checked={
                            adminShippingCondition === '결제완료 (배송 전)'
                          }
                          onChangeEvent={handleAdminShippingCondition}
                          disabled={disableShipping}
                        >
                          결제완료 / 배송 전
                        </Input_Custom>
                        <Input_Custom
                          type="radio"
                          name="adminShippingCondition"
                          value="배송 중"
                          checked={adminShippingCondition === '배송 중'}
                          onChangeEvent={handleAdminShippingCondition}
                          disabled={disableShipping}
                        >
                          배송 중
                        </Input_Custom>
                        <Input_Custom
                          type="radio"
                          name="adminShippingCondition"
                          value="배송완료"
                          checked={adminShippingCondition === '배송완료'}
                          onChangeEvent={handleAdminShippingCondition}
                          disabled={disableShipping}
                        >
                          배송완료
                        </Input_Custom>
                      </div>
                      <div
                        className={
                          adminShippingCondition === '배송 중'
                            ? orderListIndi.shippingCodeBox
                            : orderListIndi.shippingCodeBox_Off
                        }
                      >
                        <span>송장번호입력 : </span>
                        <input
                          className={orderListIndi.shippingCode_input}
                          value={shippingCodeChange}
                          type="text"
                          onChange={handleShippingCode}
                          disabled={disableShipping}
                        />
                      </div>

                      {/* 교환진행사항 */}
                      {status === '교환신청 완료' ||
                      status === '상품회수 중 (교환)' ||
                      status === '상품회수 완료 (교환)' ||
                      status === '교환상품 배송 중' ||
                      status === '교환상품 배송완료' ? (
                        <>
                          <div className={orderListIndi.adminChangeCondition}>
                            <div
                              className={
                                orderListIndi.adminChangeCondition_titleBox
                              }
                            >
                              교환신청 진행사항 &nbsp;&nbsp;
                              {status === '교환상품 배송완료' ? (
                                <></>
                              ) : disableChange ? (
                                <BTN_black_nomal_comp
                                  onClickEvent={() =>
                                    setDisableChange((cur) =>
                                      cur === true ? false : true,
                                    )
                                  }
                                  borderRadius="20px"
                                  fontSize="12px"
                                  fontWeight="500"
                                >
                                  변경하기
                                </BTN_black_nomal_comp>
                              ) : (
                                <>
                                  <BTN_white_nomal_comp
                                    borderRadius="20px"
                                    fontSize="12px"
                                    fontWeight="500"
                                    marginRight="5px"
                                    onClickEvent={() => {
                                      setDisableChange((cur) =>
                                        cur === true ? false : true,
                                      );
                                      setAdminChangeCondition(status);
                                    }}
                                  >
                                    취소
                                  </BTN_white_nomal_comp>
                                  <BTN_black_nomal_comp
                                    borderRadius="20px"
                                    fontSize="12px"
                                    fontWeight="500"
                                    onClickEvent={req_AdminChangeCondition}
                                  >
                                    등록
                                  </BTN_black_nomal_comp>
                                </>
                              )}
                            </div>
                            <Input_Custom
                              type="radio"
                              name="adminSubmitReturnCondition"
                              value="교환신청 완료"
                              checked={adminChangeCondition === '교환신청 완료'}
                              onChangeEvent={handleadminChangeCondition}
                              disabled={
                                status === '상품회수 중 (교환)' ||
                                status === '상품회수 완료 (교환)' ||
                                status === '교환상품 배송 중' ||
                                status === '교환상품 배송완료'
                                  ? true
                                  : disableChange
                              }
                            >
                              교환신청 완료
                            </Input_Custom>
                            <Input_Custom
                              type="radio"
                              name="adminSubmitReturnCondition"
                              value="상품회수 중 (교환)"
                              checked={
                                adminChangeCondition === '상품회수 중 (교환)'
                              }
                              onChangeEvent={handleadminChangeCondition}
                              disabled={disableChange}
                            >
                              상품회수 중 (교환)
                            </Input_Custom>
                            <Input_Custom
                              type="radio"
                              name="adminSubmitReturnCondition"
                              value="상품회수 완료 (교환)"
                              checked={
                                adminChangeCondition === '상품회수 완료 (교환)'
                              }
                              onChangeEvent={handleadminChangeCondition}
                              disabled={disableChange}
                            >
                              상품회수 완료 (교환)
                            </Input_Custom>
                            <Input_Custom
                              type="radio"
                              name="adminSubmitReturnCondition"
                              value="교환상품 배송 중"
                              checked={
                                adminChangeCondition === '교환상품 배송 중'
                              }
                              onChangeEvent={handleadminChangeCondition}
                              disabled={disableChange}
                            >
                              교환상품 배송 중
                            </Input_Custom>
                            <Input_Custom
                              type="radio"
                              name="adminSubmitReturnCondition"
                              value="교환상품 배송완료"
                              checked={
                                adminChangeCondition === '교환상품 배송완료'
                              }
                              onChangeEvent={handleadminChangeCondition}
                              disabled={disableChange}
                            >
                              교환상품 배송완료
                            </Input_Custom>
                          </div>
                          <div
                            className={
                              adminChangeCondition === '상품회수 중 (교환)' ||
                              adminChangeCondition === '교환상품 배송 중'
                                ? orderListIndi.ChangeCodeBox
                                : orderListIndi.ChangeCodeBox_Off
                            }
                          >
                            <span>
                              {adminChangeCondition === '상품회수 중 (교환)' ? (
                                '회수용 송장번호입력 :'
                              ) : adminChangeCondition ===
                                '교환상품 배송 중' ? (
                                '새로운 송장번호 입력 :'
                              ) : (
                                <></>
                              )}
                            </span>
                            <input
                              className={orderListIndi.shippingChangeCode_input}
                              value={changeShippingCodeChagne}
                              type="text"
                              onChange={handleChangeShippingCodeChagne}
                              disabled={disableChange}
                            />
                          </div>
                        </>
                      ) : (
                        <></>
                      )}

                      {/* 환불 신청 진행사항 */}
                      {status === '환불신청완료' ||
                      status === '상품회수 중 (환불)' ||
                      status === '상품회수 완료 (환불)' ||
                      status === '환불완료' ? (
                        <>
                          <div
                            className={orderListIndi.adminSubmitReturnCondition}
                          >
                            <div
                              className={
                                orderListIndi.adminSubmitReturnCondition_titleBox
                              }
                            >
                              환불신청 진행사항 &nbsp;&nbsp;
                              {status === '환불완료' ? (
                                <></>
                              ) : disableReturn ? (
                                <BTN_black_nomal_comp
                                  borderRadius="20px"
                                  fontSize="12px"
                                  fontWeight="500"
                                  onClickEvent={() =>
                                    setDisableReturn((cur) =>
                                      cur === true ? false : true,
                                    )
                                  }
                                >
                                  변경하기
                                </BTN_black_nomal_comp>
                              ) : (
                                <>
                                  <BTN_white_nomal_comp
                                    borderRadius="20px"
                                    fontSize="12px"
                                    fontWeight="500"
                                    marginRight="5px"
                                    onClickEvent={() => {
                                      setDisableReturn((cur) =>
                                        cur === true ? false : true,
                                      );
                                      setAdminSubmitReturnCondition(status);
                                    }}
                                  >
                                    취소
                                  </BTN_white_nomal_comp>
                                  <BTN_black_nomal_comp
                                    onClickEvent={
                                      req_AdminSubmitReturnCondition
                                    }
                                    borderRadius="20px"
                                    fontSize="12px"
                                    fontWeight="500"
                                  >
                                    등록
                                  </BTN_black_nomal_comp>
                                </>
                              )}
                            </div>
                            <Input_Custom
                              type="radio"
                              name="adminSubmitReturnCondition"
                              value="환불신청완료"
                              checked={
                                adminSubmitReturnCondition === '환불신청완료'
                              }
                              onChangeEvent={handleadminSubmitReturnCondition}
                              disabled={
                                status === '상품회수 중 (환불)' ||
                                status === '상품회수 완료 (환불)'
                                  ? true
                                  : disableReturn
                              }
                            >
                              환불신청완료
                            </Input_Custom>
                            <Input_Custom
                              type="radio"
                              name="adminSubmitReturnCondition"
                              value="상품회수 중 (환불)"
                              checked={
                                adminSubmitReturnCondition ===
                                '상품회수 중 (환불)'
                              }
                              onChangeEvent={handleadminSubmitReturnCondition}
                              disabled={disableReturn}
                            >
                              상품회수 중 (환불)
                            </Input_Custom>
                            <Input_Custom
                              type="radio"
                              name="adminSubmitReturnCondition"
                              value="상품회수 완료 (환불)"
                              checked={
                                adminSubmitReturnCondition ===
                                '상품회수 완료 (환불)'
                              }
                              onChangeEvent={handleadminSubmitReturnCondition}
                              disabled={disableReturn}
                            >
                              상품회수 완료 (환불)
                            </Input_Custom>
                          </div>
                          <div
                            className={
                              adminSubmitReturnCondition ===
                              '상품회수 중 (환불)'
                                ? orderListIndi.SubmitReturnCodeBox
                                : orderListIndi.SubmitReturnCodeBox_Off
                            }
                          >
                            <span>회수용 송장번호입력 : </span>
                            <input
                              className={
                                orderListIndi.shippingSubmitReturnCode_input
                              }
                              value={returnCodeChange}
                              type="text"
                              onChange={handleReturnCodeChange}
                              disabled={disableReturn}
                            />
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className={orderListIndi.line}></div>
                  </>
                )}
              </div>
              <BTN_black_nomal_comp
                borderRadius="0"
                fontSize="13px"
                fontWeight="500"
                padding="5px 10px"
                marginTop="20px"
                marginRight="5px"
                onClickEvent={() => navigate(-1)}
              >
                뒤로가기
              </BTN_black_nomal_comp>
              {status === '반품신청 중' ? (
                <BTN_white_nomal_comp
                  borderRadius="0"
                  fontSize="13px"
                  fontWeight="500"
                  padding="5px 50px"
                  marginTop="20px"
                  marginRight="5px"
                  onClickEvent={cancelSubmit}
                >
                  반품철회 *
                </BTN_white_nomal_comp>
              ) : (
                <></>
              )}
              {status === '교환신청 완료' || status == '상품회수 중 (교환)' ? (
                <BTN_white_nomal_comp
                  borderRadius="0"
                  fontSize="13px"
                  fontWeight="500"
                  padding="5px 20px"
                  marginTop="20px"
                  marginRight="5px"
                  onClickEvent={adminPdChangeCancel}
                >
                  교환신청 철회
                </BTN_white_nomal_comp>
              ) : (
                <></>
              )}
              {status === '배송완료' || status === '반품신청 중' ? (
                <BTN_white_nomal_comp
                  borderRadius="0"
                  fontSize="13px"
                  fontWeight="500"
                  padding="5px 20px"
                  marginTop="20px"
                  marginRight="5px"
                  onClickEvent={adminPdChange}
                >
                  교환신청*
                </BTN_white_nomal_comp>
              ) : (
                <></>
              )}
              {status === '결제 전' ? (
                <BTN_white_nomal_comp
                  borderRadius="0"
                  fontSize="13px"
                  fontWeight="500"
                  padding="5px 10px"
                  marginTop="20px"
                  marginRight="5px"
                  onClickEvent={forceDelete}
                >
                  주문강제취소
                </BTN_white_nomal_comp>
              ) : (
                <></>
              )}
              {status === '결제완료 (배송 전)' || status === '배송 중' ? (
                <BTN_white_nomal_comp
                  borderRadius="0"
                  fontSize="13px"
                  fontWeight="500"
                  padding="5px 20px"
                  marginTop="20px"
                  marginRight="5px"
                  onClickEvent={pdCancel}
                >
                  결제취소(배송 전)
                </BTN_white_nomal_comp>
              ) : (
                <></>
              )}
              {status === '배송 중' ||
              status === '배송완료' ||
              status === '반품신청 중' ? (
                <BTN_white_nomal_comp
                  borderRadius="0"
                  fontSize="13px"
                  fontWeight="500"
                  padding="5px 20px"
                  marginTop="20px"
                  marginRight="5px"
                  onClickEvent={submitRefund}
                >
                  환불진행신청 (배송 후)
                </BTN_white_nomal_comp>
              ) : (
                <></>
              )}
              {status === '상품회수 완료 (환불)' ? (
                <BTN_white_nomal_comp
                  borderRadius="0"
                  fontSize="13px"
                  fontWeight="500"
                  padding="5px 10px"
                  marginTop="20px"
                  marginRight="5px"
                  onClickEvent={pdCancelRefund}
                >
                  환불 결제취소*
                </BTN_white_nomal_comp>
              ) : (
                <></>
              )}
              {status === '환불신청완료' || status == '상품회수 중 (환불)' ? (
                <BTN_white_nomal_comp
                  borderRadius="0"
                  fontSize="13px"
                  fontWeight="500"
                  padding="5px 10px"
                  marginTop="20px"
                  marginRight="5px"
                  onClickEvent={submitRefundCancel}
                >
                  환불신청 철회
                </BTN_white_nomal_comp>
              ) : (
                <></>
              )}

              <p className={orderListIndi.caution}>
                *검토 후 전산처리 또는 연락드리기
                <br /> *버튼은 신중히 클릭할 것
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
