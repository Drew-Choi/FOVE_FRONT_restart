import React, { useEffect, useMemo, useRef, useState } from 'react';
import productRegister from '../../styles/productRegister_admin.module.scss';
import Input_Custom from '../../components_elements/Input_Custom';
import BTN_black_nomal_comp from '../../styles/BTN_black_nomal_comp';
import Select_Custom from '../../components_elements/Select_Custom';
import TextArea_Custom from '../../components_elements/TextArea_Custom';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  display: block !important;
  position: relative !important;
`;

const Layout = styled.div`
  display: flex;
`;

const Preview = styled.div`
  position: relative;
  display: block;
  width: 150px;
  height: 150px;
  margin: 5px;
  margin-right: 10px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(${(props) => props.thumbnail});
  cursor: pointer;
`;

const Text = styled.span`
  position: relative;
  left: 60px;
  padding: 10px;
  margin-right: 110px;
  margin-bottom: 20px;
`;

export default function ProductRegister_admin() {
  // 한국시간 구하기
  // UTC기준 시간을 한국 시간으로 바꾸기 시차 9시간
  const nowDayTime = () => {
    const utcTimeNow = Date.now();
    // 9시간 더하기
    const kstTimeStamp = utcTimeNow + 9 * 60 * 60 * 1000;
    // 9시간 더한 밀리세컨드를 Date로 생성
    const kstData = new Date(kstTimeStamp);

    return kstData;
  };

  //고유번호를 위해 ref값을 실식간 렌더링
  const [selectCategory, setSeloectCategory] = useState('BEANIE');

  //상품고유코드 저장하는 곳
  const [pdCode, setPdCode] = useState('');

  //-------
  //가격 콤마용
  const [enterNumPrice, setEnterNumPrice] = useState('');
  //재고수량 콤마용
  const [enterNumQuantity1, setEnterNumQuantity1] = useState('');
  const [enterNumQuantity2, setEnterNumQuantity2] = useState('');
  const [enterNumQuantity3, setEnterNumQuantity3] = useState('');
  const [enterNumQuantity4, setEnterNumQuantity4] = useState('');

  //카테고리 모음
  const kindArr = ['BEANIE', 'CAP', 'TRAINING', 'WINDBREAKER'];

  //천단위 콤마생성
  const changeEnteredNumComma = (el) => {
    const comma = (el) => {
      el = String(el);
      return el.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    };
    const uncomma = (el) => {
      el = String(el);
      return el.replace(/[^\d]+/g, '');
    };
    return comma(uncomma(el));
  };

  //콤마제거하고 연산 가능한 숫자로 바꾸기
  const resultCommaRemove = (el) => {
    return Number(el.split(',').reduce((curr, acc) => curr + acc, ''));
  };
  //-------

  //input 값을 받을 useRef생성
  const pd_code = useRef();
  const pd_productName = useRef();
  const pd_price = useRef();
  const pd_category = useRef();
  const pd_sizeOS = useRef();
  const pd_sizeS = useRef();
  const pd_sizeM = useRef();
  const pd_sizeL = useRef();
  const pd_detail = useRef();
  const pd_img = useRef();

  //--------이미지 영역 특수해서 따로 분리----------
  //이미지 파일 업로드용 Ref
  const fileInputRef = useRef();
  //이미지 url접근값 저장 state
  const [imageFile, setImageFile] = useState(null);
  //이미지인풋클릭 함수
  const handleClickFileInput = () => {
    fileInputRef.current?.click();
  };

  //이미지 접근하여 state를 이미지 값으로 변경
  //및 이미지 숫자를 5개로 제한
  //Array.from은 배열과 유사한 것을 배열화 시킴, 이미지 갯수 대문에 배열화

  const uploadProfile = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 5) {
      alert('최대 5개까지 업로드 가능합니다.');
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
          const imgInfo = {
            file: fileList[i],
            thumbnail: URL.createObjectURL(fileList[i]),
            type: fileList[i].type.slice(0, 5),
          };
          copy.push(imgInfo);
          // 파일리스트 두 번째 가공: 업로드 백엔드 요청용으로 가공.
          // 파일명을 상품코드로 작성하여 정리함
          const uploadPdInfo = {
            file: new File(
              [fileList[i]],
              `${pdCode}_${i + 1}.${fileList[i].name.split('.').pop()}`,
              { type: fileList[i].type },
            ),
          };
          copyUpload.push(uploadPdInfo);
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
        thumbnail={el.thumbnail}
        key={index}
        onClick={handleClickFileInput}
      ></Preview>
    ));
  }, [imageFile]);
  //----- 이미지 끝-------

  //클릭이벤트시 실행될 함수 생성
  //기능: 클릭 발생하면 fetch로 서버에 해당 페이지 요청을 보냄
  //Post요청이므로 ref값에 접근하여 객체(혹은 배열)를 만들고 데이터를 담아서 보낸다.
  //express에서는 이 값을 req.body.data / 혹은 req.files로 받는다.

  const newProductPost = async () => {
    try {
      //이미지 외 자료들 남기
      let productCode = pd_code.current.value;
      let productName = pd_productName.current.value;
      let price = resultCommaRemove(pd_price.current.value);
      let sizeOS = resultCommaRemove(pd_sizeOS.current.value);
      let sizeS = resultCommaRemove(pd_sizeS.current.value);
      let sizeM = resultCommaRemove(pd_sizeM.current.value);
      let sizeL = resultCommaRemove(pd_sizeL.current.value);
      let category = pd_category.current.value;
      let detail = pd_detail.current.value;

      //이미지 폼데이터 만들기
      const formData = new FormData();
      //이미지 체크 및 form에 담기
      if (
        pd_img.current === undefined ||
        pd_img.current === null ||
        pd_img.current.length < 2
      ) {
        return alert('제품 사진을 최소 2개 이상 올려주세요.(필수사항)');
      } else {
        if (
          productCode === undefined ||
          productCode === null ||
          productCode === '' ||
          productName === undefined ||
          productName === null ||
          productName === '' ||
          price === undefined ||
          price === null ||
          price === '' ||
          price === 0 ||
          category === undefined ||
          category === null ||
          category === ''
        ) {
          return alert('상품 필수 정보를 모두 입력해주세요.');
        } else {
          if (
            (sizeOS === 0 ||
              sizeOS === undefined ||
              sizeOS === null ||
              sizeOS === '') &&
            (sizeS === 0 ||
              sizeS === undefined ||
              sizeS === null ||
              sizeS === '') &&
            (sizeM === 0 ||
              sizeM === undefined ||
              sizeM === null ||
              sizeM === '') &&
            (sizeL === 0 ||
              sizeL === undefined ||
              sizeL === null ||
              sizeL === '')
          ) {
            return alert('최소 1개의 사이즈의 재고를 입력해주세요.');
          } else {
            //여러 이미지라 formdata에 담아줌
            for (let i = 0; i < pd_img.current.length; i += 1) {
              formData.append('img', pd_img.current[i].file);
            }
            //이미지 외 자료들 formdata에 담음
            formData.append(
              'data',
              //제이슨 형식으로 바꿔줘야함
              JSON.stringify({
                productCode: productCode,
                productName: productName,
                price: price,
                category: category,
                size: {
                  OS: sizeOS,
                  S: sizeS,
                  M: sizeM,
                  L: sizeL,
                },
                createAt: nowDayTime(),
                detail: detail,
              }),
            );

            console.log(formData.get('img'));

            //async/await를 이용해 fetch 구현
            const newPdPostData = await fetch(
              //요청할 페이지 날림 -> 이 서버 라우터에서 몽고디비에 인설트 하는 컨트롤을 가지고 있음
              'http://localhost:4000/admin/register-product',
              {
                method: 'POST',
                headers: {},
                //여기가 데이터 담아 보내는 것
                body: formData,
              },
            );
            //페이지 요청 성공하면 200번, 아니면 오류표시

            switch (newPdPostData.status) {
              case 200:
                alert(await newPdPostData.json());
                return window.location.reload();

              case 400:
                return alert(await newPdPostData.json());

              case 500:
                return alert(await newPdPostData.json());
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      return;
    }
  };

  //고유번호 자동생성 함수
  const productCodeCreat = async () => {
    try {
      let code = 'F';

      if (selectCategory === 'BEANIE') {
        code += 'BE_';
      } else if (selectCategory === 'CAP') {
        code += 'CA_';
      } else if (selectCategory === 'TRAINING') {
        code += 'TR_';
      } else if (selectCategory === 'WINDBREAKER') {
        code += 'WI_';
      } else {
        return;
      }

      const getUniqueCode = await axios.get(
        'http://localhost:4000/admin/register-product/uniqueCheck',
      );

      const uniqueCode = getUniqueCode.data;

      if (getUniqueCode.status === 200 && uniqueCode.uniqueNumber) {
        code += await uniqueCode.uniqueNumber;
        setPdCode((cur) => code);
        return;
      } else {
        return;
      }
    } catch (err) {
      console.error(err);
      return;
    }
  };

  useEffect(() => {
    productCodeCreat();
  }, [selectCategory]);

  return (
    <section className={productRegister.productRegister_admin}>
      <div className={productRegister.register_container}>
        {/* 종류인풋(셀렉터) */}
        <Select_Custom
          selectList={kindArr}
          inputRef={pd_category}
          name="category"
          onChangeEvent={(cur) => setSeloectCategory(pd_category.current.value)}
        >
          종류&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </Select_Custom>

        {/* 상품고유번호 인풋 */}
        <Input_Custom
          inputref={pd_code}
          type="text"
          name="productCode"
          value={pdCode}
          //백에서 DB추가될때 마다 숫자 추가해주면 될듯
          disabled
        >
          상품고유번호
        </Input_Custom>

        {/* 상품명 인풋 */}
        <Input_Custom
          inputref={pd_productName}
          type="text"
          name="productName"
          placeholder="상품이름을 입력해주세요."
        >
          상품명 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </Input_Custom>

        {/* 가격인풋 */}
        <Input_Custom
          inputref={pd_price}
          type="text"
          placeholder="가격을 입력해주세요."
          name="price"
          value={enterNumPrice}
          onChangeEvent={() =>
            setEnterNumPrice(changeEnteredNumComma(pd_price.current.value))
          }
        >
          가격 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </Input_Custom>

        {/* 사이즈 별 수량 */}
        <Input_Custom
          inputref={pd_sizeOS}
          type="text"
          placeholder="OS 사이즈 재고수량을 입력해주세요."
          name="size[OS]"
          value={enterNumQuantity1}
          onChangeEvent={() =>
            setEnterNumQuantity1(changeEnteredNumComma(pd_sizeOS.current.value))
          }
        >
          재고수량 <strong>OS</strong>&nbsp;&nbsp;
        </Input_Custom>
        <Input_Custom
          inputref={pd_sizeS}
          type="text"
          placeholder="S 사이즈 재고수량을 입력해주세요."
          name="size[M]"
          value={enterNumQuantity2}
          onChangeEvent={() =>
            setEnterNumQuantity2(changeEnteredNumComma(pd_sizeS.current.value))
          }
        >
          재고수량 <strong>S </strong>&nbsp;&nbsp;&nbsp;&nbsp;
        </Input_Custom>
        <Input_Custom
          inputref={pd_sizeM}
          type="text"
          placeholder="M 사이즈 재고수량을 입력해주세요."
          name="size[M]"
          value={enterNumQuantity3}
          onChangeEvent={() =>
            setEnterNumQuantity3(changeEnteredNumComma(pd_sizeM.current.value))
          }
        >
          재고수량 <strong>M </strong>&nbsp;&nbsp;&nbsp;
        </Input_Custom>
        <Input_Custom
          inputref={pd_sizeL}
          type="text"
          placeholder="L 사이즈 재고수량을 입력해주세요."
          name="stock"
          value={enterNumQuantity4}
          onChangeEvent={() =>
            setEnterNumQuantity4(changeEnteredNumComma(pd_sizeL.current.value))
          }
        >
          재고수량 <strong>L </strong>&nbsp;&nbsp;&nbsp;&nbsp;
        </Input_Custom>

        {/* 상품이미지 등록 */}
        <Container>
          <Layout>{showImage}</Layout>
          <Text>메인</Text>
          <Text>서브1</Text>
          <Text>서브2</Text>
          <Text>서브3</Text>
          <Text>서브4</Text>
          <input
            style={{ display: 'none' }}
            type="file"
            accept="image/jpg, image/jpeg, image/png"
            ref={fileInputRef}
            onChange={uploadProfile}
            name="img"
            multiple
          />
          <BTN_black_nomal_comp
            className={productRegister.select_btn}
            onClickEvent={handleClickFileInput}
            fontSize="12px"
          >
            파일선택
          </BTN_black_nomal_comp>
        </Container>
        {/* 상품상세설명 인풋 */}
        <TextArea_Custom
          inputref={pd_detail}
          type="text"
          name="detail"
          placeholder=" ex )
          Jacquard and embroidery artwork (상품상세설명)
          Acrylic 100% (혼용률)
          Made in China (제조국)"
          maxLength={100}
          cols={30}
          rows={10}
        >
          상품상세설명
        </TextArea_Custom>

        {/* 클릭시 axios각 작동할 수 있게 위에 만든 함수를 넣어준다. */}
        <BTN_black_nomal_comp
          className="save_btn"
          fontSize="14px"
          transFontSize="13px"
          onClickEvent={() => {
            newProductPost();
          }}
        >
          등록
        </BTN_black_nomal_comp>
      </div>
    </section>
  );
}
