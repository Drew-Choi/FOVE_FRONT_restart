import React, { useEffect, useMemo, useRef, useState } from 'react';
import getToken from '../../store/modules/getToken';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import orderReturn from '../../styles/orderReturn_client.module.scss';
import styled from 'styled-components';
import Loading from './Loading';
import Select_Custom from '../../components_elements/Select_Custom';
import BTN_black_nomal_comp from '../../styles/BTN_black_nomal_comp';

const Pd_Images = styled.div`
  ${(props) =>
    props.img &&
    `background-image: url('http://localhost:4000/uploads/${props.img}')`}
`;

const Preview = styled.img`
  position: relative;
  display: block;
  box-sizing: content-box;
  width: 40vw;
  height: auto;
  border-bottom: 0.5px solid black;
  padding: 10px;
  margin: 5px;
  margin-right: 10px;
  src: (${(props) => props.thumbnail});
  cursor: pointer;
`;

export default function OrderReturn_client() {
  const [orderCancelItem, setOrderCancelItem] = useState(null);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const desc = useRef();

  const getCancelItem = async () => {
    try {
      const tokenValue = await getToken();

      const getCancelData = await axios.post(
        'http://localhost:4000/order_list/getCancelItem',
        {
          token: tokenValue,
          orderId: orderId,
        },
      );
      setOrderCancelItem(getCancelData.data);
    } catch (err) {
      console.error(err);
    }
  };

  //db Number타입을 스트링으로 바꾸고 천단위 컴마 찍어 프론트에 보내기
  const country = navigator.language;
  const frontPriceComma = (price) => {
    if (price && typeof price.toLocaleString === 'function') {
      return price.toLocaleString(country, {
        currency: 'KRW',
      });
    } else {
      return price;
    }
  };

  // 반품사유
  const cancelReasonSelet = useRef('상품파손');
  const cancelReason = ['상품파손', '기타'];
  const [reasonChange, setReasonChange] = useState('상품파손');
  const reasonHandle = () => {
    if (cancelReasonSelet.current.value === '기타')
      return setReasonChange((cur) => '기타');
    return setReasonChange((cur) => '상품파손');
  };

  // 반품 사유가 되는 사진 업로드 ------
  // 이미지 정보 Ref
  const pd_img = useRef();
  //이미지 파일 업로드용 Ref
  const fileInputRef = useRef();
  //이미지 url접근값 저장 state
  const [imageFile, setImageFile] = useState(null);

  // 이미지 업로드 팝업 클릭용
  const handleClickFileInput = () => {
    fileInputRef.current?.click();
  };

  //이미지 접근하여 state를 이미지 값으로 변경
  //및 이미지 숫자를 5개로 제한
  //이미지 갯수 상태 보관
  const [files, setFiles] = useState([]);
  //Array.from은 배열과 유사한 것을 배열화 시킴, 이미지 갯수 때문에 배열화

  const uploadProfile = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 3) {
      alert('최대 3개까지 업로드 가능합니다.');
    } else {
      setFiles((cur) => selectedFiles);
    }
    const fileList = e.target.files;
    const length = fileList.length;
    let copy = [];
    if (fileList) {
      for (let i = 0; i < length; i += 1) {
        const imgInfo = {
          file: fileList[i],
          thumbnail: URL.createObjectURL(fileList[i]),
          type: fileList[i].type.slice(0, 5),
        };
        copy.push(imgInfo);
      }
    }
    setImageFile((cur) => copy);
    pd_img.current = fileList;
  };

  //이미지 뿌려주기, 유즈 메모로 image파일이 업로드 될때만 반응하도록
  const showImage = useMemo(() => {
    if (!imageFile && imageFile === null) {
      return <></>;
    }
    return imageFile.map((el, index) => (
      <Preview
        // thumbnail={el.thumbnail}
        key={index}
        onClick={handleClickFileInput}
        src={el.thumbnail}
      ></Preview>
    ));
  }, [imageFile]);

  // 업로드 초기화
  const handleImageReset = () => {
    setImageFile((cur) => null);
  };

  //----- 이미지 끝-------

  // 반품 제출이 성공적이면 complete화면으로 이동
  // fetch요청으로 받은 데이터를 사용할거라 컴포넌트 내에서 처리
  const [completeStatus, setCompleteStatus] = useState(false);
  const [returnSubmitData, setReturnSubmitData] = useState(null);

  // 반품 신청서 제출
  const submitReturnInfo = async () => {
    try {
      const tokenValue = await getToken();
      // const message = desc.current.value || '';
      const reason = reasonChange;
      const formData = new FormData();
      // 이미지가 여러개라 for문으로 담아줌
      for (let i = 0; i < pd_img.current.length; i += 1) {
        formData.append('img_return', pd_img.current[i]);
      }

      // 이미지외 자료들 담아주기
      formData.append(
        'data',
        JSON.stringify({
          token: tokenValue,
          orderId,
          message: '',
          reason,
        }),
      );

      formData.append('orderId', orderId);

      console.log(orderId);

      // multer이용으로 fetch 사용
      const submitRes = await fetch(
        'http://localhost:4000/admin//return_list',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: formData,
        },
      );
      if (submitRes.status === 200) {
        console.log('성공');
        const dataParse = await submitRes.json();
        setReturnSubmitData((cur) => dataParse);
        setCompleteStatus((cur) => true);
      } else {
        console.log('전송실패');
      }
    } catch (err) {
      console.error(err);
      console.log('전송실패 콘솔에러');
    }
  };

  useEffect(() => {
    getCancelItem();
  }, []);

  // 조건부 렌더링, submit이 완료되면 컴플릿트 페이지로 넘어감
  if (completeStatus)
    return (
      <section className={orderReturn.orderList_container}>
        {returnSubmitData !== null &&
        Object.keys(returnSubmitData).length > 0 ? (
          <div> 컴플릿트 </div>
        ) : (
          <Loading />
        )}
      </section>
    );

  return (
    <section className={orderReturn.orderList_container}>
      {orderCancelItem !== null && Object.keys(orderCancelItem).length > 0 ? (
        <>
          <div className={orderReturn.titleArea}>
            <h5 className={orderReturn.subtitle}>RETURN</h5>
          </div>

          <div className={orderReturn.order_info_wrap}>
            <div className={orderReturn.orderlist_Check_wrap}>
              <p className={orderReturn.older_date}>
                주문번호: <strong>{orderCancelItem.payments.orderId}</strong>
              </p>
              {/* 상품영역 */}
              {orderCancelItem.products.map((el, index) => {
                return (
                  <div key={index} className={orderReturn.older_image_info}>
                    <Pd_Images
                      onClick={() =>
                        navigate(`/store/detail/${el.productCode}`)
                      }
                      img={el.img}
                      className={orderReturn.older_image}
                    ></Pd_Images>
                    <div className={orderReturn.pdnameprice}>
                      <p
                        className={orderReturn.pdname}
                        onClick={() =>
                          navigate(`/store/detail/${el.productCode}`)
                        }
                      >
                        {el.productName}
                      </p>
                      <p className={orderReturn.pdprice}>
                        <strong style={{ fontSize: '15px' }}>
                          {frontPriceComma(el.unitSumPrice)}
                        </strong>
                        KRW /{' '}
                        <strong style={{ fontSize: '15px' }}>
                          {frontPriceComma(el.quantity)}
                        </strong>{' '}
                        ea
                      </p>
                      <p className={orderReturn.pdprice}>
                        SIZE{' '}
                        <strong style={{ fontSize: '15px' }}>{el.size}</strong>
                      </p>
                    </div>
                  </div>
                );
              })}
              <p className={orderReturn.older_detail_info}>
                total ={' '}
                <strong style={{ fontSize: '17px' }}>
                  {frontPriceComma(orderCancelItem.payments.totalAmount)}{' '}
                </strong>
                KRW /{' '}
                <strong style={{ fontSize: '17px' }}>
                  {frontPriceComma(
                    orderCancelItem.products.reduce(
                      (acc, cur) => acc + cur.quantity,
                      0,
                    ),
                  )}
                </strong>{' '}
                ea
              </p>
              <div className={orderReturn.infoCancelContainer}>
                <Select_Custom
                  classNameDiv={orderReturn.reason_div}
                  classNameChildren={orderReturn.reason_children}
                  classNameSelect={orderReturn.reason_select}
                  inputRef={cancelReasonSelet}
                  selectList={cancelReason}
                  onChangeEvent={reasonHandle}
                >
                  * 반품 사유
                </Select_Custom>
                {reasonChange === '기타' && (
                  <textarea
                    ref={desc}
                    rows="5"
                    wrap="hard"
                    maxLength="200"
                    className={orderReturn.reason_selfInput}
                    type="text"
                    placeholder="기타 사유를 남겨주시면 검토 후 연락드리겠습니다. (최대 200자)"
                  />
                )}
                <div className={orderReturn.line}></div>
                <input
                  style={{ display: 'none' }}
                  type="file"
                  accept="image/jpg, image/jpeg, image/png"
                  ref={fileInputRef}
                  onChange={uploadProfile}
                  name="img"
                  multiple
                />
                <div className={orderReturn.imagePreview_container}>
                  <div className={orderReturn.imageShow}>{showImage}</div>
                </div>

                <p className={orderReturn.caution}>
                  * 문제되신 부분의 사진을 업로드 해주세요.(최대 3개)
                </p>
                <div className={orderReturn.BTNwrap}>
                  <BTN_black_nomal_comp
                    borderRadius="0px"
                    className={orderReturn.imageUplaod_BTN}
                    onClickEvent={handleClickFileInput}
                    fontSize="12px"
                  >
                    파일선택
                  </BTN_black_nomal_comp>
                  <BTN_black_nomal_comp
                    borderRadius="0px"
                    className={orderReturn.imageReset}
                    onClickEvent={handleImageReset}
                    fontSize="12px"
                  >
                    초기화
                  </BTN_black_nomal_comp>
                </div>

                <button
                  className={orderReturn.orderBack}
                  onClick={() => navigate(-1)}
                >
                  뒤로가기
                </button>
                <button
                  className={orderReturn.orderCancle}
                  onClick={() => submitReturnInfo()}
                >
                  반품신청 진행
                </button>
                <p className={orderReturn.caution}>
                  *반품신청을 해주시면 검토 후 연락드리도록 하겠습니다.
                  (카카오톡 or 주문자 전화번호)
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </section>
  );
}