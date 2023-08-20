/* eslint-disable no-undef */
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import productRegister from '../../styles/productRegister_admin.module.scss';
import Input_Custom from '../../components_elements/Input_Custom';
import BTN_black_nomal_comp from '../../components_elements/BTN_black_nomal_comp';
import Select_Custom from '../../components_elements/Select_Custom';
import TextArea_Custom from '../../components_elements/TextArea_Custom';
import styled from 'styled-components';
import axios from 'axios';
import MediaQuery from 'react-responsive';
import Loading_Spinner from '../client_components/Loading_Spinner';
import { changeEnteredNumComma, resultCommaRemove } from '../../constant/comma';

const Preview = styled.div<{ thumbnail: string }>`
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

const { REACT_APP_KEY_BACK } = process.env;

// constant
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

//카테고리 모음
const kindArr = ['BEANIE', 'CAP', 'TRAINING', 'WINDBREAKER'];

export default function ProductRegister_admin() {
  // 스피너
  const [spinner, setSpinner] = useState<boolean>(false);
  //고유번호를 위해 값을 실식간 렌더링
  const [selectCategory, setSeloectCategory] = useState<string>('BEANIE');
  //상품고유코드 저장하는 곳
  const [pdCode, setPdCode] = useState<string>('');

  //-------
  //가격 콤마용
  const [enterNumPrice, setEnterNumPrice] = useState<string>('');
  //재고수량 콤마용
  const [enterNumQuantity1, setEnterNumQuantity1] = useState<string>('');
  const [enterNumQuantity2, setEnterNumQuantity2] = useState<string>('');
  const [enterNumQuantity3, setEnterNumQuantity3] = useState<string>('');
  const [enterNumQuantity4, setEnterNumQuantity4] = useState<string>('');

  // 재고 유효사항을 위한 상태관리
  // OS사이즈
  const [os_Value, setOS_Value] = useState<string>('');
  // S사이즈
  const [s_Value, setS_Value] = useState<string>('');
  // M사이즈
  const [m_Value, setM_Value] = useState<string>('');
  // L사이즈
  const [l_Value, setL_Value] = useState<string>('');

  //input 값을 받을 useRef생성
  const pd_code = useRef<HTMLInputElement>(null);
  const pd_productName = useRef<HTMLInputElement>(null);
  const pd_price = useRef<HTMLInputElement>(null);
  const pd_category = useRef<HTMLSelectElement>(null);
  const pd_sizeOS = useRef<HTMLInputElement>(null);
  const pd_sizeS = useRef<HTMLInputElement>(null);
  const pd_sizeM = useRef<HTMLInputElement>(null);
  const pd_sizeL = useRef<HTMLInputElement>(null);
  const pd_detail = useRef<HTMLTextAreaElement>(null);
  const [pd_img, setPd_img] = useState<{ file: File }[] | null>(null);

  //--------이미지 영역 특수해서 따로 분리----------
  //이미지 파일 업로드용 Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  //이미지 url접근값 저장 state
  const [imageFile, setImageFile] = useState<
    | {
        file: File;
        thumbnail: string;
        type: string;
      }[]
    | null
  >(null);
  //이미지인풋클릭 함수
  const handleClickFileInput = () => {
    fileInputRef.current?.click();
  };

  //이미지 접근하여 state를 이미지 값으로 변경
  //및 이미지 숫자를 5개로 제한
  //Array.from은 배열과 유사한 것을 배열화 시킴, 이미지 갯수 대문에 배열화

  const uploadProfile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      const selectedFilesLength = selectedFiles!.length;
      if (selectedFilesLength > 5) {
        alert('최대 5개까지 업로드 가능합니다.');
      } else {
        // 파일리스트 2번 가공함
        // 첫 번째 가공배열 담을 배열
        const copy = [];
        // 두 번째 가공배열 담을 배열
        const copyUpload = [];

        if (selectedFiles) {
          for (let i = 0; i < length; i += 1) {
            const imgInfo = {
              file: selectedFiles[i],
              thumbnail: URL.createObjectURL(selectedFiles[i]),
              type: selectedFiles[i].type.slice(0, 5),
            };
            copy.push(imgInfo);
            // 파일리스트 두 번째 가공: 업로드 백엔드 요청용으로 가공.
            // 파일명을 상품코드로 작성하여 정리함
            const uploadPdInfo = {
              file: new File(
                [selectedFiles[i]],
                `${pdCode}_${i + 1}.${selectedFiles[i].name.split('.').pop()}`,
                { type: selectedFiles[i].type },
              ),
            };
            copyUpload.push(uploadPdInfo);
          }
        }
        setImageFile(copy);
        setPd_img(copyUpload);
      }
    },
    [fileInputRef],
  );

  //이미지 뿌려주기, 유즈 메모로 image파일이 업로드 될때만 반응하도록
  const showImage = useMemo(() => {
    if (imageFile === null || imageFile.length === 0) {
      return (
        <>
          <MediaQuery minWidth={426}>
            <p className={productRegister.previewDesc}>Image Preview Area</p>
          </MediaQuery>

          <MediaQuery maxWidth={425}>
            <p className={productRegister.previewDesc}>
              Image Preview Area <br />* 상품 사진 2장 필수, 최대 5장 / 비율은
              1:1을 유지해주세요. 그렇지 않으면 사진이 잘립니다.
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
    setSpinner(true);
    try {
      //이미지 외 자료들 남기
      const productCode = pd_code.current?.value;
      const productName = pd_productName.current?.value;
      const price = resultCommaRemove(pd_price.current!.value);
      const sizeOS =
        os_Value === 'OS' ? resultCommaRemove(pd_sizeOS.current!.value) : -1;
      const sizeS =
        s_Value === 'S' ? resultCommaRemove(pd_sizeS.current!.value) : -1;
      const sizeM =
        m_Value === 'M' ? resultCommaRemove(pd_sizeM.current!.value) : -1;
      const sizeL =
        l_Value === 'L' ? resultCommaRemove(pd_sizeL.current!.value) : -1;
      const category = pd_category.current?.value;
      const detail = pd_detail.current?.value;

      //이미지 폼데이터 만들기
      const formData = new FormData();
      //이미지 체크 및 form에 담기
      if (pd_img === undefined || pd_img === null || pd_img.length < 2) {
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
          price === 0 ||
          category === undefined ||
          category === null ||
          category === ''
        ) {
          return alert('상품 필수 정보를 모두 입력해주세요.');
        } else {
          if (
            (sizeOS === -1 || sizeOS === undefined || sizeOS === null) &&
            (sizeS === -1 || sizeS === undefined || sizeS === null) &&
            (sizeM === -1 || sizeM === undefined || sizeM === null) &&
            (sizeL === -1 || sizeL === undefined || sizeL === null)
          ) {
            return alert('최소 1개의 사이즈를 입력해주세요.');
          } else {
            //여러 이미지라 formdata에 담아줌
            pd_img.forEach((el) => {
              formData.append('img', el.file);
            });
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
              `${REACT_APP_KEY_BACK}/admin/register-product`,
              {
                method: 'POST',
                headers: {},
                //여기가 데이터 담아 보내는 것
                body: formData,
              },
            );
            //페이지 요청 성공하면 200번, 아니면 오류표시
            if (newPdPostData.status === 200) {
              alert(await newPdPostData.json());
              setSpinner(false);
              return window.location.reload();
            }
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.response.status === 400) {
        setSpinner(false);
        return alert(await err.response.data.json());
      } else if (err.response.status === 500) {
        setSpinner(false);
        return alert(await err.response.data.json());
      } else {
        setSpinner(false);
        return alert(await err.response.data.json());
      }
    }
  };

  useEffect(() => {
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

        const getUniqueCode = await axios.post(
          `${REACT_APP_KEY_BACK}/admin/register-product/uniqueCheck`,
          { headCode: code },
        );

        const uniqueCode = getUniqueCode.data;

        if (getUniqueCode.status === 200 && uniqueCode.uniqueNumber) {
          setPdCode(uniqueCode.uniqueNumber);
          return;
        } else {
          return;
        }
      } catch (err) {
        console.error(err);
        return;
      }
    };

    productCodeCreat();
  }, [selectCategory]);

  return (
    <div className={productRegister.productRegister_admin}>
      {spinner && <Loading_Spinner />}
      <div className={productRegister.register_container}>
        <div className={productRegister.indi_container_title}>
          <p className={productRegister.mainTitle}>PRODUCT REGISTRATION</p>
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
            onChangeEvent={() => setSeloectCategory(pd_category.current!.value)}
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
            pStyle={{ display: 'block' }}
            disabled={true}
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
            maxLength={30}
            pStyle={{ display: 'block' }}
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
              setEnterNumPrice(changeEnteredNumComma(pd_price.current!.value))
            }
            pStyle={{ display: 'block' }}
          />
        </div>

        {/* 사이즈 별 수량 */}
        <p className={productRegister.sizeDesc}>
          → * 유효한 사이즈 체크 후 재고입력 (최소 1개 체크)
        </p>
        <p
          className={productRegister.sizeDesc}
          style={{ marginBottom: '20px' }}
        >
          → * 사이즈체크 후 미입력시 SoldOut처리
        </p>
        <div className={productRegister.sizeUsed_check}>
          <Input_Custom
            classNameInput={productRegister.pd_size_checkbox}
            type="checkbox"
            value="OS"
            onChangeEvent={(e) => {
              e.target.checked ? setOS_Value(e.target.value) : setOS_Value('');
            }}
          >
            OS
          </Input_Custom>
          <Input_Custom
            classNameInput={productRegister.pd_size_checkbox}
            type="checkbox"
            value="S"
            onChangeEvent={(e) => {
              e.target.checked ? setS_Value(e.target.value) : setS_Value('');
            }}
          >
            S
          </Input_Custom>
          <Input_Custom
            classNameInput={productRegister.pd_size_checkbox}
            type="checkbox"
            value="M"
            onChangeEvent={(e) => {
              e.target.checked ? setM_Value(e.target.value) : setM_Value('');
            }}
          >
            M
          </Input_Custom>
          <Input_Custom
            classNameInput={productRegister.pd_size_checkbox}
            type="checkbox"
            value="L"
            onChangeEvent={(e) => {
              e.target.checked ? setL_Value(e.target.value) : setL_Value('');
            }}
          >
            L
          </Input_Custom>
        </div>

        {os_Value === 'OS' && (
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
                  changeEnteredNumComma(pd_sizeOS.current!.value),
                )
              }
              pStyle={{ display: 'block' }}
            />
          </div>
        )}

        {s_Value === 'S' && (
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
                  changeEnteredNumComma(pd_sizeS.current!.value),
                )
              }
              pStyle={{ display: 'block' }}
            />
          </div>
        )}

        {m_Value === 'M' && (
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
                  changeEnteredNumComma(pd_sizeM.current!.value),
                )
              }
              pStyle={{ display: 'block' }}
            />
          </div>
        )}

        {l_Value === 'L' && (
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
                  changeEnteredNumComma(pd_sizeL.current!.value),
                )
              }
              pStyle={{ display: 'block' }}
            />
          </div>
        )}

        {/* 상품이미지 등록 */}
        <div className={productRegister.imgWrap}>
          <p className={productRegister.imgTitle}>
            *IMAGES <br />
            <MediaQuery minWidth={426}>
              <span className={productRegister.subDesc}>
                * 상품 사진 2장 필수, 최대 5장 / 비율은 1:1을 유지해주세요.
                그렇지 않으면 사진이 잘립니다.
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
