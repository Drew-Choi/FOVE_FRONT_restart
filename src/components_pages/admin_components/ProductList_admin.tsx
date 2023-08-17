/* eslint-disable no-undef */
import axios from 'axios';
import React, {
  ChangeEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import adminPdList from '../../styles/productList_admin.module.scss';
import BTN_black_nomal_comp from '../../styles/BTN_black_nomal_comp';
import BTN_white_nomal_comp from '../../styles/BTN_white_nomal_comp';
import MediaQuery from 'react-responsive';
import LoadingAdmin from '../client_components/LoadingAdmin';
import { useNavigate } from 'react-router-dom';

const { REACT_APP_KEY_BACK } = process.env;
const { REACT_APP_KEY_IMAGE } = process.env;

// constant
const checkImageData = (
  data: MutableRefObject<Array<null | { file: File }>>,
) => {
  const count = data.current.reduce(
    (acc: number, cur: null | { file: File }) => (cur === null ? acc + 1 : acc),
    0,
  );
  return count === 5 ? false : true;
};

//이미지배열을 위한 임의적 배열생성. 데이터가 없는 요소는 undefined임
const generateArr = (item: string[] | undefined) => {
  const imageArray = Array.from({ length: 5 }, (_, index) =>
    item![index] === undefined ? 'upload.png' : item![index],
  );

  return imageArray;
};

//천단위 콤마생성
const changeEnteredNumComma = (el: number | string) => {
  const comma = (el: number | string) => {
    el = String(el);
    return el.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  };
  const uncomma = (el: number | string) => {
    el = String(el);
    return el.replace(/[^\d]+/g, '');
  };
  return comma(uncomma(el));
};

//콤마제거하고 연산 가능한 숫자로 바꾸기
const resultCommaRemove = (el: string) => {
  return Number(el.split(',').reduce((cur, acc) => cur + acc, ''));
};
//-------

export default function ProductList_admin() {
  const [data, setData] = useState<ProductsType[]>([]);
  const [disableControll, setDisableControll] = useState<Array<boolean>>([]);
  const [redirect, setRedirect] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const navigate = useNavigate();

  const productName = useRef<HTMLInputElement[]>([]);
  const os = useRef<HTMLInputElement[]>([]);
  const s = useRef<HTMLInputElement[]>([]);
  const m = useRef<HTMLInputElement[]>([]);
  const l = useRef<HTMLInputElement[]>([]);
  const price = useRef<HTMLInputElement[]>([]);
  const detail = useRef<HTMLTextAreaElement[]>([]);
  const category = useRef<HTMLSelectElement[]>([]);

  // 가격 설정 컴마 및 숫자만 입력을 위한 것-----------
  const [enterNum, setEnterNum] = useState<EnterNumType[] | null | undefined>(
    null,
  );

  // 컴포넌트가 마운트될때 API 요청을 보냄
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${REACT_APP_KEY_BACK}/admin/productlist`,
        );

        setData(response.data);
        setDisableControll(new Array(response.data.length).fill(true));
        // 숫자 입풋 설정 위한 초기상태
        // 숫자입력 및 컴마
        const initialPrice = response.data.map(() => ({
          value: '',
          OS: '',
          S: '',
          M: '',
          L: '',
        }));
        setEnterNum(initialPrice);
      } catch (err: any) {
        navigate(
          `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
        );
        console.error(err);
      }
    };

    fetchData();
  }, [redirect]);

  useEffect(() => {
    const time = setTimeout(() => {
      setIsVisible(false);
    }, 500);
    return () => {
      clearTimeout(time);
    };
  }, []);

  // 이미지 파일 업로드 영역은 따로 정리 -----------------------
  // 클릭용 Ref
  const imgClick = useRef<Array<HTMLInputElement | null>>(Array(5).fill(null));
  // 실제 업로드 파일 저장하는 Ref
  const imgFile = useRef<Array<null | { file: File }>>(Array(5).fill(null));

  // 해당 key ref에 클릭 접근
  const imgInputClick = (num: number) => {
    const inputElement = imgClick.current[num];
    if (inputElement) {
      inputElement.click();
    }
  };
  // 프레뷰 이미지 URL 담는 곳
  const [previewShow, setPreviewShow] = useState<
    Array<{ file: File; thumbnail: string; type: string } | null>
  >([null, null, null, null, null]);

  // 단일 파일 업로드 최대 1개 사진을 하나씩 변경 가능한 것으로 진행
  const uploadImgFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>, num: number, productCode: string) => {
      if (e.target.files && e.target.files.length > 1) {
        alert('1개의 사진만 업로드 가능합니다');
      } else {
        const uploadFileList = e.target.files;
        const length = uploadFileList?.length;
        // 파일리스트 2번 가공함
        // 첫 번째 가공배열 담을 배열
        const copy = [...previewShow];
        // 두 번째 가공배열 담을 배열

        // 가공 1. 프레뷰용
        if (uploadFileList && length === 1) {
          const imgInfo = {
            file: uploadFileList[0],
            thumbnail: URL.createObjectURL(uploadFileList[0]),
            type: uploadFileList[0].type.slice(0, 5),
          };
          copy[num] = imgInfo;

          // 파일리스트 두 번째 가공: 업로드 백엔드 요청용으로 가공.
          // 파일명을 상품코드로 작성 하지만, 이번에는 단일 전소이기 때문에,
          // 매개변수로 index를 받아서 그것으로 _순번 을 정함
          // 그리고 백엔드 uploads 파일에 덮어쓰기
          const uploadModifyImgFile = {
            file: new File(
              [uploadFileList[0]],
              `${productCode}_${num + 1}.${uploadFileList[0].name
                .split('.')
                .pop()}`,
              { type: uploadFileList[0].type },
            ),
          };
          imgFile.current[num] = uploadModifyImgFile;
        }
        setPreviewShow(copy);
      }
    },
    [imgClick],
  );

  // 프레뷰이미지 뿌려주는 곳
  const showImage = useCallback(
    (num: number) => {
      if (previewShow[num] === null || previewShow[num] === undefined) return;

      // 해당 배열 요소가 비어있지 않다면 프레뷰 쇼를 해준다.
      return (
        <>
          <img
            className={adminPdList.origianl_img_on}
            src={previewShow[num]?.thumbnail}
            alt="modify preview Img"
            onClick={() => imgInputClick(num)}
          />
          <p className={adminPdList.imgTitle}>
            {num === 0 ? 'Main' : `Sub_${num}`}
            <span style={{ fontSize: '13px' }}>new</span>
          </p>
        </>
      );
    },
    [previewShow],
  );

  // 이미지 리셋
  const imageReset = () => {
    let copy = [...previewShow];
    copy = [null, null, null, null, null];
    setPreviewShow(copy);
    imgFile.current = copy;
  };

  // 이미지 프레뷰 업로드 등 끝  -------------------------

  // 카테고리 모음
  const kindArr = ['BEANIE', 'CAP', 'TRAINING', 'WINDBREAKER'];

  // 핸들 모음
  // 수정이후 확인, 수정 진행 핸들
  const updateSubmit = useCallback(
    async (productCode: string, index: number) => {
      const updateConfirm = confirm('수정을 하시겠습니까?');

      if (!updateConfirm)
        return (
          productUpdateCancel(index),
          setRedirect((cur) => !cur),
          window.location.reload(),
          alert('수정 취소')
        );
      // 만약 사용자가 확인을 눌렀다면
      try {
        setIsVisible(true);
        if (
          // 변경사항 있는지 체크, 변경사항 모든 항목이 없으면 그냥 끝냄
          category.current![index].value === data[index].category &&
          os.current![index].value === '' &&
          s.current![index].value === '' &&
          m.current![index].value === '' &&
          l.current![index].value === '' &&
          productName.current![index].value === '' &&
          price.current![index].value === '' &&
          detail.current![index].value === '' &&
          checkImageData(imgFile) === false
        ) {
          return alert('변경사항 없음');
        } else {
          // 이름 유효성 한번 더 검사
          const result = data.reduce(
            (acc: number, cur: ProductsType) =>
              cur.productName === productName.current![index].value
                ? acc + 1
                : acc,
            0,
          );
          console.log(result);

          if (result > 0) {
            alert(
              `상품명이 존재합니다.\n중복상품명: ${
                productName.current![index].value
              } \n다른 이름을 사용해주세요.`,
            );
            return;
          } else {
            // Ref값 가져오기
            const result = {
              OS:
                os.current![index].value === ''
                  ? data[index].size?.OS
                  : resultCommaRemove(os.current![index].value),
              S:
                s.current![index].value === ''
                  ? data[index].size?.S
                  : resultCommaRemove(s.current![index].value),
              M:
                m.current![index].value === ''
                  ? data[index].size?.M
                  : resultCommaRemove(m.current![index].value),
              L:
                l.current![index].value === ''
                  ? data[index].size?.L
                  : resultCommaRemove(l.current![index].value),
              productName:
                productName.current![index].value === ''
                  ? data[index].productName
                  : productName.current![index].value,
              price:
                price.current![index].value === ''
                  ? data[index].price
                  : resultCommaRemove(price.current![index].value),
              detail:
                detail.current![index].value === ''
                  ? data[index].detail
                  : detail.current![index].value,
              category:
                category.current![index].value === data[index].category
                  ? data[index].category
                  : category.current![index].value,
            };

            // 사이즈 객체로 다시 만들어야해서 한번 가공
            const size = {
              OS: result.OS,
              S: result.S,
              M: result.M,
              L: result.L,
            };

            // 폼데이터 생성
            const formData = new FormData();

            // 이미지 담기
            const filterImageArr = imgFile.current.filter((el) => el !== null);
            filterImageArr.forEach((el) => formData.append('img', el!.file));

            // 이미지 외 자료들 formdata에 담음
            formData.append(
              'data',
              //제이슨 형식으로 바꿔줘야함
              JSON.stringify({
                productName: result.productName,
                size: size,
                price: result.price,
                detail: result.detail,
                category: result.category,
              }),
            );

            const response = await fetch(
              //요청할 페이지 날림 -> 이 서버 라우터에서 몽고디비에 인설트 하는 컨트롤을 가지고 있음
              `${REACT_APP_KEY_BACK}/admin/productlist/modify/${productCode}`,
              {
                method: 'POST',
                headers: {},
                //여기가 데이터 담아 보내는 것
                body: formData,
              },
            );

            if (response.status === 200) {
              productUpdateCancel(index),
                window.location.reload(),
                setRedirect((cur) => !cur);
              return alert('수정 완료');
            }
          }
        }
      } catch (err: any) {
        console.error(err);
        return (
          productUpdateCancel(index),
          setRedirect((cur) => !cur),
          window.location.reload(),
          alert('수정오류, 서버오류')
        );
      }
      setIsVisible(false);
    },
    [disableControll],
  );

  // 수정 버튼 누를시 핸들
  const productUpdate = (index: number) => {
    // 다른 곳에서 수정된 사항이 있어서 초기화 해주고 수정작업 해야함
    let copy = [...previewShow];
    copy = [null, null, null, null, null];
    setPreviewShow(copy);
    imgFile.current = copy;

    setDisableControll((prevState) => {
      const newState = [...prevState];
      for (let i = 0; i < newState.length; i++) {
        productName.current![i].value = '';
        os.current![i].value = '';
        s.current![i].value = '';
        m.current![i].value = '';
        l.current![i].value = '';
        price.current![i].value = '';
        detail.current![i].value = '';
        newState[i] = true;
      }
      setEnterNum([]);
      newState[index] = false;
      const initialPrice = data.map(() => ({
        value: '',
        OS: '',
        S: '',
        M: '',
        L: '',
      }));
      setEnterNum(initialPrice);

      return newState;
    });
  };

  // 수정 취소시 핸들
  const productUpdateCancel = (index: number) => {
    setDisableControll((prevState) => {
      const newState = [...prevState];
      for (let i = 0; i < newState.length; i++) {
        newState[i] = true;
      }
      productName.current![index].value = '';
      os.current![index].value = '';
      s.current![index].value = '';
      m.current![index].value = '';
      l.current![index].value = '';
      price.current![index].value = '';
      detail.current![index].value = '';
      let copy = [...previewShow];
      copy = [null, null, null, null, null];
      setPreviewShow(copy);
      setEnterNum([]);
      imgFile.current = copy;
      const initialPrice = data.map(() => ({
        value: '',
        OS: '',
        S: '',
        M: '',
        L: '',
      }));
      setEnterNum(initialPrice);

      return newState;
    });
  };

  // 삭제기능 핸들
  const productDelete = async (productCode: string, productName: string) => {
    // 클라이언트 체크 한번 더
    const upadatConfirm = confirm(
      `삭제 후 복구가 어렵습니다.\n상품명: ${productName}\n상품코드: ${productCode}\n정말 삭제하시겠습니까?`,
    );

    if (!upadatConfirm) return alert('삭제 취소');

    // confirm이 true이면 아래 진행
    try {
      setIsVisible(true);
      const response = await axios.post(
        `${REACT_APP_KEY_BACK}/admin/productlist/delete/${productCode}`,
      );

      if (response.status === 200)
        return (
          setRedirect((cur) => !cur),
          window.location.reload(),
          alert(
            `상품명: ${productName}\n상품코드: ${productCode}\n삭제되었습니다`,
          )
        );
    } catch (err: any) {
      console.error(err);
      return alert('수정오류');
    }
    setIsVisible(false);
  };

  // Sub_2~4번까지 개별 사진 삭제
  const imgIndiDelete = async (
    productCode: string,
    imgURL: string,
    num: number,
  ) => {
    const updateConfirm = confirm(`Sub_${num}\n사진을 삭제하시겠습니까?`);

    if (!updateConfirm) return alert('삭제 취소');
    // confirm이 true라면 아래 실행
    if (
      imgURL === null ||
      imgURL === '' ||
      imgURL === undefined ||
      imgURL === 'upload.png'
    )
      return alert('삭제 할 이미지가 없습니다.');
    // null이 아니라면,
    try {
      setIsVisible(true);
      const response = await axios.post(
        `${REACT_APP_KEY_BACK}/admin/productlist/imgDelete`,
        { productCode: productCode, imgURL: imgURL },
      );

      if (response.status === 200) {
        setRedirect((cur) => !cur);
        window.location.reload();
        return alert('이미지 삭제 완료');
      }
    } catch (err: any) {
      console.error(err);
      return alert('서버오류');
    }
    setIsVisible(false);
  };

  const sizeHandler = (
    index: number,
    e: ChangeEvent<HTMLInputElement>,
    key: string,
  ) => {
    const regex = /^-?\d*$/;

    if (regex.test(e.target.value) || e.target.value === '') {
      setEnterNum((pre) => {
        const copy = pre?.map((el, num) =>
          num === index
            ? {
                ...el,
                [key]: e.target.value,
              }
            : el,
        );
        return copy;
      });
    }
  };

  const productList = data.map((item: ProductsType, index: number) => (
    // 이미지 포함하여 모든 내용 뿌려주는 곳
    <div className={adminPdList.indi_Pd_list_container} key={index}>
      <div className={adminPdList.imgList}>
        {/* 이미지 배열 뿌려주는 영역 */}
        {/* 수정 모드일 때만 5개 임의 배열 쓰기 */}
        {(disableControll![index] === true
          ? item.img!
          : generateArr(item.img)
        ).map((el, num) => (
          <div className={adminPdList.imgWrap} key={num}>
            {disableControll[index] === true || previewShow[num] === null ? (
              <>
                <img
                  className={
                    disableControll[index] === true
                      ? adminPdList.origianl_img
                      : adminPdList.origianl_img_on
                  }
                  src={
                    el !== null
                      ? `${REACT_APP_KEY_IMAGE}${el}`
                      : `${REACT_APP_KEY_IMAGE}upload.png`
                  }
                  alt="register Img"
                  onClick={
                    disableControll[index] === true
                      ? () => null
                      : () => imgInputClick(num)
                  }
                />
                <p className={adminPdList.imgTitle}>
                  {num === 0 ? 'Main' : `Sub_${num}`}
                  {!disableControll[index] && num > 1 && (
                    <span
                      className={adminPdList.img_indi_delete}
                      onClick={() =>
                        imgIndiDelete(
                          data[disableControll.findIndex((el) => el === false)]
                            .productCode,
                          el,
                          num,
                        )
                      }
                    >
                      &nbsp;(삭제)
                    </span>
                  )}
                </p>
              </>
            ) : (
              <>{showImage(num)}</>
            )}

            <input
              style={{ display: 'none' }}
              type="file"
              accept="image/jpg, image/jpeg, image/png"
              ref={(e) => (imgClick.current[num] = e)}
              name="img"
              onChange={(e) =>
                uploadImgFile(
                  e,
                  num,
                  data[disableControll.findIndex((el) => el === false)]
                    .productCode,
                )
              }
            />
          </div>
        ))}
      </div>
      <div className={adminPdList.reactContainer}>
        <div className={adminPdList.pd_InfoText_list_Row1}>
          <p>카테고리</p>
          {disableControll[index] ? (
            <input
              type="text"
              name="category"
              placeholder={item?.category}
              disabled
            />
          ) : (
            <div className={adminPdList.kind_selectBox}>
              <select
                className={adminPdList.selectBoxContent}
                ref={(el) => {
                  if (el) {
                    category.current![index] = el;
                  }
                }}
                name="category"
                defaultValue={item.category}
              >
                {kindArr.map((el, index) => (
                  <option value={el} key={index}>
                    {el}
                  </option>
                ))}
              </select>
            </div>
          )}

          <p>상품코드</p>
          <input
            type="text"
            name="productCode"
            placeholder={item?.productCode}
            disabled
          />
          <p>상품명</p>
          <input
            ref={(el) => {
              if (el) {
                productName.current![index] = el;
              }
            }}
            type="text"
            name="productName"
            placeholder={item?.productName}
            disabled={disableControll[index]}
          />

          <MediaQuery minWidth={491}>
            <p>가격 &nbsp;&nbsp;&nbsp;</p>
          </MediaQuery>
          <MediaQuery maxWidth={490}>
            <p>가격</p>
          </MediaQuery>
          <input
            ref={(el) => {
              if (el) {
                price.current![index] = el;
              }
            }}
            value={enterNum![index].value}
            onChange={(e) => {
              setEnterNum((pre) => {
                if (pre) {
                  const copy = pre.map((el, num) =>
                    num === index
                      ? {
                          ...el,
                          value: changeEnteredNumComma(e.target.value),
                        }
                      : el,
                  );
                  return copy;
                } else {
                  return null;
                }
              });
            }}
            type="text"
            name="price"
            placeholder={item?.price?.toLocaleString('ko-KR')}
            disabled={disableControll[index]}
          />
        </div>
        <div className={adminPdList.pd_InfoText_list_Row2}>
          <p>OS 재고</p>
          <input
            ref={(el) => {
              if (el) {
                os.current![index] = el;
              }
            }}
            value={enterNum![index].OS}
            type="text"
            onChange={(e) => sizeHandler(index, e, 'OS')}
            name="sizeOS"
            placeholder={
              item.size?.OS === 0
                ? 'SoldOut'
                : item.size?.OS === -1
                ? '사이즈 없음'
                : item?.size?.OS.toLocaleString('ko-KR')
            }
            disabled={disableControll[index]}
          />
          <MediaQuery minWidth={491}>
            <p>S 재고 &nbsp; &nbsp;</p>
          </MediaQuery>
          <MediaQuery maxWidth={490}>
            <p>S 재고</p>
          </MediaQuery>
          <input
            ref={(el) => {
              if (el) {
                s.current![index] = el;
              }
            }}
            value={enterNum![index].S}
            onChange={(e) => sizeHandler(index, e, 'S')}
            type="text"
            name="sizeS"
            placeholder={
              item.size?.S === 0
                ? 'SoldOut'
                : item.size?.S === -1
                ? '사이즈 없음'
                : item?.size?.S.toLocaleString('ko-KR')
            }
            disabled={disableControll[index]}
          />
          <p>M 재고</p>
          <input
            ref={(el) => {
              if (el) {
                m.current![index] = el;
              }
            }}
            value={enterNum![index].M}
            onChange={(e) => sizeHandler(index, e, 'M')}
            type="text"
            name="sizeM"
            placeholder={
              item.size?.M === 0
                ? 'SoldOut'
                : item.size?.M === -1
                ? '사이즈 없음'
                : item?.size?.M.toLocaleString('ko-KR')
            }
            disabled={disableControll[index]}
          />
          <MediaQuery minWidth={491}>
            <p>L 재고 &nbsp;</p>
          </MediaQuery>
          <MediaQuery maxWidth={490}>
            <p>L 재고</p>
          </MediaQuery>
          <input
            ref={(el) => {
              if (el) {
                l.current![index] = el;
              }
            }}
            value={enterNum![index].L}
            onChange={(e) => sizeHandler(index, e, 'L')}
            type="text"
            name="sizeL"
            placeholder={
              item.size?.L === 0
                ? 'SoldOut'
                : item.size?.L === -1
                ? '사이즈 없음'
                : item?.size?.L.toLocaleString('ko-KR')
            }
            disabled={disableControll[index]}
          />
        </div>
      </div>

      <div className={adminPdList.pd_InfoText_list_Row3}>
        <p>상세설명</p>
        <textarea
          name="detail"
          rows={5}
          maxLength={200}
          ref={(el) => {
            if (el) {
              detail.current![index] = el;
            }
          }}
          placeholder={item?.detail}
          disabled={disableControll[index]}
          className={adminPdList.detilTextArea}
        />
      </div>

      {disableControll[index] === false && (
        <p className={adminPdList.updateDesc}>
          * 수정시 입력되지 않은 사항은 수정 전 내용이 보존됩니다.
          <br />* 이미지는 1:1 비율을 유지해주세요. 그렇지 않으면 잘립니다.
          <br />* Main이미지와 Sub_1이미지는 삭제가 불가하며 교체만
          가능합니다.(필수 사진 2개)
          <br />* &#39;사이즈없음&#39;은 재고입력시 사이즈가 추가됩니다.
          <br />* 재고 -1 입력시: 해당사이즈없음
          <br />* 재고 0 입력시: 해당사이즈는 있으나 Sold-Out
        </p>
      )}

      <div className={adminPdList.BTN_Wrap}>
        {disableControll[index] === false ? (
          <>
            <BTN_white_nomal_comp onClickEvent={() => imageReset()}>
              이미지 초기화
            </BTN_white_nomal_comp>
            <BTN_white_nomal_comp
              onClickEvent={() => productUpdateCancel(index)}
            >
              취소
            </BTN_white_nomal_comp>
            <BTN_black_nomal_comp
              onClickEvent={() => {
                updateSubmit(item.productCode, index);
              }}
            >
              등록
            </BTN_black_nomal_comp>
          </>
        ) : (
          <>
            <BTN_white_nomal_comp onClickEvent={() => productUpdate(index)}>
              수정
            </BTN_white_nomal_comp>

            <BTN_black_nomal_comp
              onClickEvent={() =>
                productDelete(item.productCode, item.productName)
              }
            >
              삭제
            </BTN_black_nomal_comp>
          </>
        )}
      </div>
    </div>
  ));

  return (
    <div className={adminPdList.whol_container}>
      <p className={adminPdList.mainTitle}>PRODUCT DISPLAY LIST</p>
      {isVisible && <LoadingAdmin />}
      {(enterNum === null || enterNum === undefined || enterNum.length === 0) &&
      data.length === 0 &&
      disableControll.length === 0 ? (
        <LoadingAdmin />
      ) : (
        productList
      )}
    </div>
  );
}
