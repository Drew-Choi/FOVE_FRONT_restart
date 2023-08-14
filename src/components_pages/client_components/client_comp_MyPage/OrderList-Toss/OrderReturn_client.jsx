/* eslint-disable no-undef */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import getToken from '../../../../store/modules/getToken';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import orderReturn from '../../../../styles/orderReturn_client.module.scss';
import styled from 'styled-components';
import Loading from '../../Loading';
import Select_Custom from '../../../../components_elements/Select_Custom';
import BTN_black_nomal_comp from '../../../../styles/BTN_black_nomal_comp';
import { useSelector } from 'react-redux';
import Loading_Spinner from '../../Loading_Spinner';
const { REACT_APP_KEY_IMAGE } = process.env;

const Pd_Images = styled.div`
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
  cursor: pointer;

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

export default function OrderReturn_client() {
  // 스피너
  const [spinner, setSpinner] = useState(false);

  const [orderCancelItem, setOrderCancelItem] = useState(null);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const desc = useRef('');

  const { REACT_APP_KEY_BACK } = process.env;

  // 로그인 정보
  const isLogin = useSelector((state) => state.user.isLogin);

  const getCancelItem = async () => {
    try {
      const tokenValue = await getToken();

      const getCancelData = await axios.post(
        `${REACT_APP_KEY_BACK}/order_list/getCancelItem`,
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

  // 날짜 추출
  const dateSlice = (date) => {
    const sliceDate = date.substring(0, 19);
    return sliceDate;
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

  //및 이미지 숫자를 3개로 제한
  //Array.from은 배열과 유사한 것을 배열화 시킴, 이미지 갯수 때문에 배열화
  const uploadProfile = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 3) {
      return alert('최대 3개까지 업로드 가능합니다.');
    } else {
      const fileList = e.target.files;
      const length = fileList.length;
      // 파일리스트 2번 가공함
      // 첫 번째 가공배열 담을 배열
      let copy = [];
      // 두 번째 가공배열 담을 배열
      let copyUpload = [];

      if (fileList) {
        for (let i = 0; i < length; i += 1) {
          // 파일리스트 첫 번째 가공: 프레뷰용으로 저장
          const imgInfo = {
            file: fileList[i],
            thumbnail: URL.createObjectURL(fileList[i]),
            type: fileList[i].type.slice(0, 5),
          };
          copy.push(imgInfo);
          // 파일리스트 두 번째 가공: 업로드 백엔드 요청용으로 가공. 여기서 파일명을 주문번호(orderId)로 넣어주고 '_1,_2_,3'으로 정의해 주어
          // 추후 어드민에서 해당 orderId의 고유번호로 찾을 수 있도록 한다. 그래서 오데이터를 없앤다.
          const uploadInfo = {
            file: new File(
              [fileList[i]],
              `${orderId}_${i + 1}.${fileList[i].name.split('.').pop()}`,
              { type: fileList[i].type },
            ),
          };
          copyUpload.push(uploadInfo);
        }
      }
      setImageFile((cur) => copy);
      pd_img.current = copyUpload;
    }
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

  //----- 이미지 끝-------

  // 반품 제출이 성공적이면 complete화면으로 이동
  // fetch요청으로 받은 데이터를 사용할거라 컴포넌트 내에서 처리
  const [completeStatus, setCompleteStatus] = useState(false);
  const [returnSubmitData, setReturnSubmitData] = useState(null);

  // 반품 신청서 제출
  const submitReturnInfo = async () => {
    if (!isLogin)
      return alert('로그인이 필요한 서비스입니다.'), navigate(`/login`);

    const updateConfirm = confirm('반품신청을 진행하시겠습니까?');

    if (!updateConfirm) return alert('반품신청 취소');
    // true이면 아래 진행
    setSpinner((cur) => true);
    try {
      const tokenValue = await getToken();
      // const message = desc.current.value || '';
      const reason = reasonChange;
      const formData = new FormData();
      // 이미지 체크 및 form에 담기
      if (
        pd_img.current === undefined ||
        pd_img.current === null ||
        pd_img.current.length === 0
      ) {
        setSpinner((cur) => false);
        return alert(
          '제품의 문제가 되는 부분의 사진을 최소 1장은 올려주세요.(필수사항)',
        );
      } else {
        if (
          reasonChange === '기타' &&
          (desc.current.value === '' ||
            desc.current.value === null ||
            desc.current.value === undefined)
        ) {
          setSpinner((cur) => false);
          return alert('기타사유를 입력해주세요.');
        } else {
          // 이미지가 여러개라 for문으로 담아줌
          for (let i = 0; i < pd_img.current.length; i += 1) {
            formData.append('img_return', pd_img.current[i].file);
          }

          // 이미지외 자료들 담아주기
          formData.append(
            'data',
            JSON.stringify({
              token: tokenValue,
              orderId,
              message: reasonChange === '상품파손' ? '' : desc.current.value,
              reason,
            }),
          );

          // multer이용으로 fetch 사용
          const submitRes = await fetch(
            `${REACT_APP_KEY_BACK}/admin/return_submit`,
            {
              method: 'POST',
              headers: {},
              body: formData,
            },
          );

          if (submitRes.status === 200) {
            const dataParse = await submitRes.json();
            setReturnSubmitData((cur) => dataParse);
            setCompleteStatus((cur) => true);
            setSpinner((cur) => false);
          } else {
            console.log('전송실패');
            setSpinner((cur) => false);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setSpinner((cur) => false);
    }
    setSpinner((cur) => false);
  };

  useEffect(() => {
    getCancelItem();
  }, []);

  // 조건부 렌더링, submit이 완료되면 컴플릿트 페이지로 넘어감
  if (completeStatus)
    return (
      <section className={orderReturn.orderList_container}>
        {spinner && <Loading_Spinner />}
        {returnSubmitData !== null &&
        Object.keys(returnSubmitData).length > 0 ? (
          <div className={orderReturn.wrap}>
            <p className={orderReturn.complete_title}>Return Complete</p>
            <div className={orderReturn.complete_box}>
              <p className={orderReturn.order_title}>
                고객님의 반품신청이 완료되었습니다.
              </p>
              <p className={orderReturn.order_guide}>
                반품신청내역에 관한 안내는{' '}
                <span>마이페이지 / 주문취소조회</span>를 통하여 확인가능합니다.
              </p>
              <p className={orderReturn.order_info_number}>
                주문번호:{' '}
                <span className={orderReturn.number}>
                  {returnSubmitData.payments.orderId}
                </span>
              </p>
              <p className={orderReturn.order_info_date}>
                반품신청일자:{' '}
                <span className={orderReturn.date}>
                  {dateSlice(returnSubmitData.submitReturn.submitAt)}
                </span>
              </p>
            </div>

            <div className={orderReturn.btn_container}>
              <button
                className={orderReturn.btn_continue}
                onClick={() => navigate('/store')}
              >
                쇼핑계속하기
              </button>
              <button
                className={orderReturn.btn_orderList}
                onClick={() => {
                  if (isLogin) {
                    navigate('/mypage/orderlist');
                  } else {
                    alert('로그인이 필요한 서비스입니다.');
                    return navigate(`/login`);
                  }
                }}
              >
                반품신청 확인하기
              </button>
            </div>

            <div className={orderReturn.notice_wrap}>
              <div className={orderReturn.notice_use}>
                <p className={orderReturn.use_title}>이용안내</p>
                <p className={orderReturn.use_desc}>
                  상품별 자세한 배송과정은 주문조회를 통하여 조회하실 수
                  있습니다.
                </p>
              </div>
            </div>
          </div>
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