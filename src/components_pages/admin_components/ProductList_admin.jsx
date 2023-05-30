import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import adminPdList from '../../styles/productList_admin.module.scss';
import BTN_black_nomal_comp from '../../styles/BTN_black_nomal_comp';
import BTN_white_nomal_comp from '../../styles/BTN_white_nomal_comp';

export default function ProductList_admin() {
  const [data, setData] = useState([]);
  const [disableControll, setDisableControll] = useState([]);
  const [redirect, setRedirect] = useState(false);

  console.log(data);

  const productName = useRef([]);
  const os = useRef([]);
  const s = useRef([]);
  const m = useRef([]);
  const l = useRef([]);
  const price = useRef([]);
  const detail = useRef([]);

  // 수정 버튼 누를시
  const productUpdate = (index) => {
    setDisableControll((prevState) => {
      const newState = [...prevState];
      for (let i = 0; i < newState.length; i++) {
        newState[i] = true;
      }
      newState[index] = false;
      return newState;
    });
  };

  // 수정 취소시
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
      return newState;
    });
  };

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

  const productList = data.map((item, index) => (
    // 이미지 포함하여 모든 내용 뿌려주는 곳
    <div className={adminPdList.indi_Pd_list_container} key={item._id}>
      <div className={adminPdList.imgList}>
        {/* 이미지 배열 뿌려주는 영역 */}
        {item.img.map((el, index) => (
          <div className={adminPdList.imgWrap} key={index}>
            <img
              className={adminPdList.origianl_img}
              src={`http://localhost:4000/uploads/${el}`}
              alt="register Img"
            />
            <p className={adminPdList.imgTitle}>
              {index === 0 ? 'Main' : `Sub_${index}`}
            </p>
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

      {disableControll.includes(false) && (
        <p className={adminPdList.updateDesc}>
          * 수정시 입력되지 않은 사항은 수정 전 내용이 보존됩니다.
        </p>
      )}

      <div className={adminPdList.BTN_Wrap}>
        {disableControll.includes(false) ? (
          <>
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
