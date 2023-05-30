import React, { useEffect, useMemo, useRef, useState } from 'react';
import productRegister from '../../styles/productRegister_admin.module.scss';
import Input_Custom from '../../components_elements/Input_Custom';
import BTN_black_nomal_comp from '../../styles/BTN_black_nomal_comp';
import Select_Custom from '../../components_elements/Select_Custom';
import TextArea_Custom from '../../components_elements/TextArea_Custom';
import styled from 'styled-components';
import axios from 'axios';
import MediaQuery from 'react-responsive';

const Preview = styled.div`
  position: relative;
  display: block;
  width: 600px;
  height: 600px;
  margin: 0px auto;
  margin-top: 20px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(${(props) => props.thumbnail});
  cursor: pointer;

  @media screen and (max-width: 968px) {
    width: 480px;
    height: 480px;
  }

  @media screen and (max-width: 755px) {
    width: 380px;
    height: 380px;
  }

  @media screen and (max-width: 425px) {
    width: 230px;
    height: 230px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const ImageOrder = styled.p`
  position: relative;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 60px;
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
    if (imageFile === null || imageFile === [] || imageFile.length === 0) {
      return (
        <>
          <MediaQuery minWidth={426}>
            <p className={productRegister.previewDesc}>Image Preview Area</p>
          </MediaQuery>

          <MediaQuery maxWidth={425}>
            <p className={productRegister.previewDesc}>
              Image Preview Area <br />* 상품 사진 2장 필수 / 비율은 1:1을
              유지해주세요. 그렇지 않으면 사진이 잘립니다.
            </p>
          </MediaQuery>
        </>
      );
    }
    return imageFile.map((el, index) => (
      <div key={index}>
        <Preview
          thumbnail={el.thumbnail}
          onClick={handleClickFileInput}
        ></Preview>
        <ImageOrder>
          {index === 0 ? `--- Main ---` : `--- Sub_${index} ---`}
        </ImageOrder>
      </div>
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
    <div className={productRegister.productRegister_admin}>
      <div className={productRegister.register_container}>
        <div className={productRegister.indi_container_title}>
          <p className={productRegister.mainTitle}>Product Register</p>
        </div>

        {/* 종류인풋(셀렉터) */}
        <div className={productRegister.indi_container}>
          <p className={productRegister.kind_title}>종류 *</p>
          <Select_Custom
            classNameDiv={productRegister.kind_selectBox}
            classNameSelect={productRegister.selectBoxContent}
            selectList={kindArr}
            inputRef={pd_category}
            name="category"
            onChangeEvent={(cur) =>
              setSeloectCategory(pd_category.current.value)
            }
          />
        </div>

        {/* 상품고유번호 인풋 */}
        <div className={productRegister.indi_container}>
          <p className={productRegister.pd_uniqueCode_title}>
            상품코드<span style={{ fontSize: '12px' }}>(자동생성)</span> *
          </p>
          <Input_Custom
            classNameDiv={productRegister.pd_uniqueCode_input}
            inputref={pd_code}
            type="text"
            name="productCode"
            value={pdCode}
            disabled
          />
        </div>

        {/* 상품명 인풋 */}
        <div className={productRegister.indi_container}>
          <p className={productRegister.pd_name_title}>상품명 *</p>
          <Input_Custom
            classNameDiv={productRegister.pd_name_input}
            inputref={pd_productName}
            type="text"
            name="productName"
            placeholder="상품이름을 입력해주세요."
          />
        </div>

        {/* 가격인풋 */}
        <div className={productRegister.indi_container}>
          <p className={productRegister.pd_price_title}>가격 *</p>
          <Input_Custom
            classNameDiv={productRegister.pd_price_input}
            inputref={pd_price}
            type="text"
            name="price"
            placeholder="가격을 입력해주세요."
            value={enterNumPrice}
            onChangeEvent={() =>
              setEnterNumPrice(changeEnteredNumComma(pd_price.current.value))
            }
          />
        </div>

        {/* 사이즈 별 수량 */}
        <p className={productRegister.sizeDesc}>
          → * 재고는 최소 1개 사이즈 입력 필수
        </p>
        <div className={productRegister.indi_container}>
          <p className={productRegister.pd_OS_title}>
            재고수량 <strong style={{ fontSize: '18px' }}>OS</strong>
          </p>
          <Input_Custom
            classNameDiv={productRegister.pd_OS_Input}
            inputref={pd_sizeOS}
            type="text"
            placeholder="OS 사이즈 재고수량을 입력해주세요."
            name="size[OS]"
            value={enterNumQuantity1}
            onChangeEvent={() =>
              setEnterNumQuantity1(
                changeEnteredNumComma(pd_sizeOS.current.value),
              )
            }
          />
        </div>

        <div className={productRegister.indi_container}>
          <p className={productRegister.pd_S_title}>
            재고수량 <strong style={{ fontSize: '18px' }}>S</strong>
          </p>
          <Input_Custom
            classNameDiv={productRegister.pd_S_Input}
            inputref={pd_sizeS}
            type="text"
            placeholder="S 사이즈 재고수량을 입력해주세요."
            name="size[S]"
            value={enterNumQuantity2}
            onChangeEvent={() =>
              setEnterNumQuantity2(
                changeEnteredNumComma(pd_sizeS.current.value),
              )
            }
          />
        </div>

        <div className={productRegister.indi_container}>
          <p className={productRegister.pd_M_title}>
            재고수량 <strong style={{ fontSize: '18px' }}>M</strong>
          </p>
          <Input_Custom
            classNameDiv={productRegister.pd_M_Input}
            inputref={pd_sizeM}
            type="text"
            placeholder="M 사이즈 재고수량을 입력해주세요."
            name="size[M]"
            value={enterNumQuantity3}
            onChangeEvent={() =>
              setEnterNumQuantity3(
                changeEnteredNumComma(pd_sizeM.current.value),
              )
            }
          />
        </div>

        <div className={productRegister.indi_container}>
          <p className={productRegister.pd_L_title}>
            재고수량 <strong style={{ fontSize: '18px' }}>L</strong>
          </p>
          <Input_Custom
            classNameDiv={productRegister.pd_L_Input}
            inputref={pd_sizeL}
            type="text"
            placeholder="L 사이즈 재고수량을 입력해주세요."
            name="size[L]"
            value={enterNumQuantity4}
            onChangeEvent={() =>
              setEnterNumQuantity4(
                changeEnteredNumComma(pd_sizeL.current.value),
              )
            }
          />
        </div>

        {/* 상품이미지 등록 */}
        <div className={productRegister.imgWrap}>
          <p className={productRegister.imgTitle}>
            *IMAGES <br />
            <MediaQuery minWidth={426}>
              <span className={productRegister.subDesc}>
                * 상품 사진 2장 필수 / 비율은 1:1을 유지해주세요. 그렇지 않으면
                사진이 잘립니다.
              </span>
            </MediaQuery>
          </p>
          <div className={productRegister.previewContainer}>{showImage}</div>
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

          {/* 상품상세설명 인풋 */}
          <div className={productRegister.detail_desc_container}>
            <p className={productRegister.detail_desc_title}>상품상세설명</p>
            <TextArea_Custom
              textAreaClassName={productRegister.textArea}
              inputref={pd_detail}
              type="text"
              name="detail"
              placeholder=" ex )
            Jacquard and embroidery artwork (상품상세설명)
            Acrylic 100% (혼용률)
            Made in China (제조국) --> 200자 내"
              maxLength={200}
            />
          </div>

          {/* 클릭시 axios각 작동할 수 있게 위에 만든 함수를 넣어준다. */}
          <BTN_black_nomal_comp
            className={productRegister.save_btn}
            fontSize="14px"
            transFontSize="13px"
            onClickEvent={() => {
              newProductPost();
            }}
          >
            등록
          </BTN_black_nomal_comp>
        </div>
      </div>
    </div>
  );
}
