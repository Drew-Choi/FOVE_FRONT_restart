import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import adminPdList from '../../styles/productList_admin.module.scss';
import BTN_black_nomal_comp from '../../styles/BTN_black_nomal_comp';
import BTN_white_nomal_comp from '../../styles/BTN_white_nomal_comp';
import { check } from 'prettier';

export default function ProductList_admin() {
  const [data, setData] = useState([]);
  const [disableControll, setDisableControll] = useState([]);
  const [redirect, setRedirect] = useState(false);

  const productName = useRef([]);
  const os = useRef([]);
  const s = useRef([]);
  const m = useRef([]);
  const l = useRef([]);
  const price = useRef([]);
  const detail = useRef([]);

  // 삭제기능
  const productDelete = async (id) => {
    // alert(id);
    try {
      await axios.post(`http://localhost:4000/admin/productlist/delete/${id}`);
      alert('삭제되었습니다');
      setRedirect((cur) => !cur);
    } catch (error) {
      console.log('hi');
    }
  };

  // 수정이후 확인
  const updateSubmit = async (productCode, index) => {
    const updateConfirm = confirm('수정을 하시겠습니까?');

    if (!updateConfirm)
      return (
        productUpdateCancel(index),
        setRedirect((cur) => !cur),
        alert('수정 취소')
      );
    // 만약 사용자가 확인을 눌렀다면
    try {
      const checkImageData = (data) => {
        let count = 0;
        for (let i = 0; i < data.length; i += 1) {
          data[i] === null ? (count += 1) : null;
        }
        return count === 5 ? false : true;
      };

      if (
        os.current[index].value === '' &&
        s.current[index].value === '' &&
        m.current[index].value === '' &&
        l.current[index].value === '' &&
        productName.current[index].value === '' &&
        price.current[index].value === '' &&
        detail.current[index].value === '' &&
        checkImageData(imgFile.current) === false
      ) {
        return alert('변경사항 없음');
      } else {
        // 유효성 체크 업데이트 진행
        const result = () => {
          console.log('data[index]', data[index]);
          return {
            OS:
              os.current[index].value === ''
                ? data[index].size.OS
                : os.current[index].value,
            S:
              s.current[index].value === ''
                ? data[index].size.S
                : s.current[index].value,
            M:
              m.current[index].value === ''
                ? data[index].size.M
                : m.current[index].value,
            L:
              l.current[index].value === ''
                ? data[index].size.L
                : l.current[index].value,
            productName:
              productName.current[index].value === ''
                ? data[index].productName
                : productName.current[index].value,
            price:
              price.current[index].value === ''
                ? data[index].price
                : price.current[index].value,
            detail:
              detail.current[index].value === ''
                ? data[index].detail
                : detail.current[index].value,
          };
        };
        // 업데이트 자료 담기
        const updateResult = await result();
        console.log('hihihiihihihi', updateResult);

        // 이미지 외 자료들 formdata에 담음
        const size = {
          OS: updateResult.OS,
          S: updateResult.S,
          M: updateResult.M,
          L: updateResult.L,
        };

        const formData = new FormData();

        const filterImageArr = imgFile.current.filter((el) => el !== null);

        for (let i = 0; i < filterImageArr.length; i += 1) {
          formData.append('img', filterImageArr[i].file);
        }

        console.log(formData.get('img'));

        formData.append(
          'data',
          //제이슨 형식으로 바꿔줘야함
          JSON.stringify({
            productName: updateResult.productName,
            size: size,
            price: updateResult.price,
            detail: updateResult.detail,
          }),
        );

        const response = await fetch(
          //요청할 페이지 날림 -> 이 서버 라우터에서 몽고디비에 인설트 하는 컨트롤을 가지고 있음
          `http://localhost:4000/admin/productlist/modify/${productCode}`,
          {
            method: 'POST',
            headers: {},
            //여기가 데이터 담아 보내는 것
            body: formData,
          },
        );

        if (!response.status === 200)
          return (
            productUpdateCancel(index),
            setRedirect((cur) => !cur),
            alert('수정실패')
          );

        console.log(response.data);
        productUpdateCancel(index), setRedirect((cur) => !cur);
        return alert('수정 완료');
      }
    } catch (error) {
      console.error(error);
      return (
        productUpdateCancel(index),
        setRedirect((cur) => !cur),
        alert('수정오류, 서버오류')
      );
    }
  };

  // 컴포넌트가 마운트될때 API 요청을 보냄
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          'http://localhost:4000/admin/productlist',
        );

        setData(response.data);
        setDisableControll(new Array(response.data.length).fill(true));
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [redirect]);

  // 이미지 파일 업로드 영역은 따로 정리 -----------------------
  // 클릭용 Ref
  const imgClick = useRef([]);
  // 실제 업로드 파일 저장하는 Ref
  const imgFile = useRef([null, null, null, null, null]);
  console.log(imgFile);
  // 해당 key ref에 클릭 접근
  const imgInputClick = (num) => {
    imgClick.current[num]?.click();
  };
  // 프레뷰 이미지 URL 담는 곳
  const [previewShow, setPreviewShow] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);

  //이미지배열을 위한 임의적 배열생성. 데이터가 없는 요소는 undefined임
  const generateArr = (item) => {
    const imageArray = Array.from({ length: 5 }, (_, index) =>
      item[index] === undefined ? 'upload.png' : item[index],
    );

    return imageArray;
  };

  // 단일 파일 업로드 최대 1개 사진을 하나씩 변경 가능한 것으로 진행
  const uploadImgFile = (e, num, productCode) => {
    const selectFile = Array.from(e.target.files);
    if (selectFile.length > 1) {
      alert('1개의 사진만 업로드 가능합니다');
    } else {
      const uploadFileList = e.target.files;
      const length = uploadFileList.length;
      // 파일리스트 2번 가공함
      // 첫 번째 가공배열 담을 배열
      let copy = [...previewShow];
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
      setPreviewShow((cur) => copy);
    }
  };

  // 프레뷰이미지 뿌려주는 곳
  const showImage = useCallback(
    (num) => {
      if (
        previewShow[num] === null ||
        previewShow[num] === undefined ||
        previewShow[num] === {} ||
        previewShow[num] === ''
      )
        return <></>;

      // 해당 배열 요소가 비어있지 않다면 프레뷰 쇼를 해준다.
      return (
        <>
          <img
            className={adminPdList.origianl_img_on}
            src={previewShow[num].thumbnail}
            alt="modify preview Img"
            onClick={() => imgInputClick(num)}
          />
          <p className={adminPdList.imgTitle}>
            {num === 0 ? 'Main' : `Sub_${num}`}
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
    setPreviewShow((cur) => copy);
    imgFile.current = copy;
  };

  // 이미지 프레뷰 업로드 등 끝  -------------------------

  // 핸들 모음
  // 수정 버튼 누를시 핸들
  const productUpdate = (index) => {
    // 다른 곳에서 수정된 사항이 있어서 초기화 해주고 수정작업 해야함
    let copy = [...previewShow];
    copy = [null, null, null, null, null];
    setPreviewShow((cur) => copy);
    imgFile.current = copy;

    setDisableControll((prevState) => {
      const newState = [...prevState];
      for (let i = 0; i < newState.length; i++) {
        productName.current[i].value = [];
        os.current[i].value = [];
        s.current[i].value = [];
        m.current[i].value = [];
        l.current[i].value = [];
        price.current[i].value = [];
        detail.current[i].value = [];
        newState[i] = true;
      }
      newState[index] = false;
      return newState;
    });
  };

  // 수정 취소시 핸들
  const productUpdateCancel = (index) => {
    setDisableControll((prevState) => {
      const newState = [...prevState];
      for (let i = 0; i < newState.length; i++) {
        newState[i] = true;
      }
      productName.current[index].value = [];
      os.current[index].value = [];
      s.current[index].value = [];
      m.current[index].value = [];
      l.current[index].value = [];
      price.current[index].value = [];
      detail.current[index].value = [];
      let copy = [...previewShow];
      copy = [null, null, null, null, null];
      setPreviewShow((cur) => copy);
      imgFile.current = copy;
      return newState;
    });
  };

  const productList = data.map((item, index) => (
    // 이미지 포함하여 모든 내용 뿌려주는 곳
    <div className={adminPdList.indi_Pd_list_container} key={item._id}>
      <div className={adminPdList.imgList}>
        {/* 이미지 배열 뿌려주는 영역 */}
        {/* 수정 모드일 때만 5개 임의 배열 쓰기 */}
        {(disableControll[index] === true
          ? item.img
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
                      ? `http://localhost:4000/uploads/${el}`
                      : `http://localhost:4000/uploads/upload.png`
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
      <div className={adminPdList.pd_InfoText_list_Row1}>
        <p>상품코드</p>
        <input
          type="text"
          name="productCode"
          placeholder={item?.productCode}
          disabled
        />
        <p>상품명</p>
        <input
          ref={(el) => (productName.current[index] = el)}
          key={item?.id}
          type="text"
          name="productName"
          placeholder={item?.productName}
          disabled={disableControll[index]}
        />
        <p>가격 &nbsp;&nbsp;&nbsp;</p>
        <input
          ref={(el) => (price.current[index] = el)}
          key={item?.id}
          type="text"
          name="price"
          placeholder={item?.price}
          disabled={disableControll[index]}
        />
      </div>
      <div className={adminPdList.pd_InfoText_list_Row2}>
        <p>OS 재고</p>
        <input
          ref={(el) => (os.current[index] = el)}
          key={item?.id}
          type="text"
          name="sizeOS"
          placeholder={item?.size.OS}
          disabled={disableControll[index]}
        />
        <p>S 재고</p>
        <input
          ref={(el) => (s.current[index] = el)}
          key={item.id}
          type="text"
          name="sizeS"
          placeholder={item?.size.S}
          disabled={disableControll[index]}
        />
        <p>M 재고</p>
        <input
          ref={(el) => (m.current[index] = el)}
          key={item.id}
          type="text"
          name="sizeM"
          placeholder={item?.size.M}
          disabled={disableControll[index]}
        />
        <p>L 재고</p>
        <input
          ref={(el) => (l.current[index] = el)}
          key={item?.id}
          type="text"
          name="sizeL"
          placeholder={item?.size.L}
          disabled={disableControll[index]}
        />
      </div>

      <div className={adminPdList.pd_InfoText_list_Row3}>
        <p>상세설명</p>
        <textarea
          type="text"
          name="detail"
          rows="5"
          maxLength="200"
          ref={(el) => (detail.current[index] = el)}
          placeholder={item?.detail}
          key={item?.id}
          disabled={disableControll[index]}
          className={adminPdList.detilTextArea}
        />
      </div>

      {disableControll[index] === false && (
        <p className={adminPdList.updateDesc}>
          * 수정시 입력되지 않은 사항은 수정 전 내용이 보존됩니다.
          <br />* 이미지는 1:1 비율을 유지해주세요. 그렇지 않으면 잘립니다.
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
            // onClickEvent={() => productDelete(item._id)}
            >
              삭제
            </BTN_black_nomal_comp>
          </>
        )}
      </div>
    </div>
  ));

  return <div className={adminPdList.whol_container}>{productList}</div>;
}
