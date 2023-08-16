/* eslint-disable no-undef */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import '../../../styles/store_client.scss';
import { Container, Row, Col } from 'react-bootstrap';
import SwiperCore, { Navigation, Pagination, A11y, Mousewheel } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MediaQuery from 'react-responsive';
import Loading2 from '../../client_components/Loading2';
import SwiperPaginationBTN from '../../../styles/SwiperPaginationBTN';
import SwiperPaginationContainer from '../../../styles/SwiperPaginationContainer';
import Product_client_indiLayout from './Product_client_indiLayout';

// 스와이퍼 기능 설치
SwiperCore.use([Navigation]);
const { REACT_APP_KEY_BACK } = process.env;

export default function Store_client() {
  // 모든 상품 또는 카테고리별 상품 요청 위한 파람스 서칭
  const { category } = useParams();
  // All상품데이터 get
  const [pd_Datas, setPd_Datas] = useState<ProductsType[] | []>([]);
  // 검색용
  const searchText = useSelector(
    (state: { search: { searchData: string } }) => state.search.searchData,
  );
  // 오리진데이터 보관용
  const orignData = useRef<any>([]);
  // 스피너
  const [isLoading, setIsLoading] = useState<boolean>(true);
  //네비게이트
  const navigate = useNavigate();

  //스와이퍼 커스텀
  const [swiperEl, setSwiperEl] = useState<any>(null);
  const [pagination1, setPagination1] = useState<'on' | 'off'>('on');
  const [pagination2, setPagination2] = useState<'on' | 'off'>('off');
  const [pagination3, setPagination3] = useState<'on' | 'off'>('off');
  const [pagination4, setPagination4] = useState<'on' | 'off'>('off');
  const [pagination5, setPagination5] = useState<'on' | 'off'>('off');

  // 사이즈에 재고가 있는 지 확인 매개변수만 받으면 되서 callback
  const stockCheck = useCallback(
    (data: { OS: number; S: number; M: number; L: number } | undefined) => {
      if (!data) {
        return [];
      }
      const arr = Object.values(data);
      const filter = arr.filter((el) => el !== -1 && el !== 0);
      return filter;
    },
    [],
  );

  //상품데이터 db에서 가져오기 및 검색기능
  useEffect(() => {
    // 스피너
    setIsLoading(true);
    const time = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    //--

    //엑시오스로 모든 상품 정보 요청--
    const getAllProducts = async () => {
      if (!category) {
        try {
          const productsData = await axios.get(
            `${REACT_APP_KEY_BACK}/store/all`,
          );
          if (productsData.status === 200) {
            orignData.current = productsData.data;
            setPd_Datas(productsData.data);
            return;
          }
        } catch (err: any) {
          navigate(
            `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
          );
          console.error(err);
        }
      } else {
        try {
          const productsData = await axios.get(
            `${REACT_APP_KEY_BACK}/store/${category}`,
          );
          if (productsData.status === 200) {
            orignData.current = productsData.data;
            setPd_Datas(productsData.data);
            return;
          }
        } catch (err: any) {
          navigate(
            `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
          );
          console.error(err);
        }
      }
    };
    // --

    // 검색체크 및 상품검색 --
    const searchProducts = (text: string) => {
      if (text === '') return;

      const lowercaseText = text.toLowerCase();
      setPd_Datas((cur: ProductsType[]) => {
        return [...cur].filter((el) => {
          const lowercaseProductName = el.productName.toLowerCase();
          return lowercaseProductName.indexOf(lowercaseText) !== -1;
        });
      });
    };
    //---

    // 순차적으로 진행 --
    getAllProducts().then(() => {
      searchProducts(searchText);
    });
    // -----

    return () => {
      clearTimeout(time);
    };
  }, [searchText, category]);

  return (
    <main className="store_main">
      {isLoading && <Loading2 />}

      <section className="product_display">
        <MediaQuery minWidth={576}>
          <Swiper
            // install Swiper modules
            modules={[Navigation, Pagination, A11y, Mousewheel]}
            spaceBetween={50}
            slidesPerView={1}
            onSwiper={(swiper) => setSwiperEl(swiper)}
            onActiveIndexChange={(swiper) => {
              swiper.activeIndex !== 0
                ? setPagination1('off')
                : setPagination1('on');
              swiper.activeIndex !== 1
                ? setPagination2('off')
                : setPagination2('on');
              swiper.activeIndex !== 2
                ? setPagination3('off')
                : setPagination3('on');
              swiper.activeIndex !== 3
                ? setPagination4('off')
                : setPagination4('on');
              swiper.activeIndex !== 4
                ? setPagination5('off')
                : setPagination5('on');
            }}
            mousewheel={false}
            className="swiper_container"
          >
            {/* 1열 */}
            <SwiperSlide className="swiper_slide">
              <Container>
                <Row xs={1} sm={2} md={4} lg={5}>
                  {pd_Datas.map((el, index) => {
                    if (index < 10 && index >= 0)
                      return (
                        <Col
                          onClick={() =>
                            navigate(`/store/detail/${el.productCode}`)
                          }
                          className="store_col"
                          key={el._id}
                        >
                          <Product_client_indiLayout
                            imgFileName={el.img}
                            productName={el.productName}
                            price={
                              stockCheck(el.size).length === 0
                                ? 'Sold-Out'
                                : `₩ ${el.price?.toLocaleString('ko-KR')}`
                            }
                          />
                        </Col>
                      );
                  })}
                </Row>
              </Container>
            </SwiperSlide>

            {/* 2열 */}
            {pd_Datas.length <= 10 ? (
              <></>
            ) : (
              <SwiperSlide className="swiper_slide">
                <Container>
                  <Row xs={1} sm={2} md={4} lg={5}>
                    {pd_Datas.map((el, index) => {
                      if (index < 20 && index >= 10)
                        return (
                          <Col
                            onClick={() =>
                              navigate(`/store/detail/${el.productCode}`)
                            }
                            className="store_col"
                            key={el._id}
                          >
                            <Product_client_indiLayout
                              imgFileName={el.img}
                              productName={el.productName}
                              price={
                                stockCheck(el.size).length === 0
                                  ? 'Sold-Out'
                                  : `₩ ${el.price?.toLocaleString('ko-KR')}`
                              }
                            />
                          </Col>
                        );
                    })}
                  </Row>
                </Container>
              </SwiperSlide>
            )}

            {/* 3열 */}
            {pd_Datas.length <= 20 ? (
              <></>
            ) : (
              <SwiperSlide className="swiper_slide">
                <Container>
                  <Row xs={1} sm={2} md={4} lg={5}>
                    {pd_Datas.map((el, index) => {
                      if (index < 30 && index >= 20)
                        return (
                          <Col
                            onClick={() =>
                              navigate(`/store/detail/${el.productCode}`)
                            }
                            className="store_col"
                            key={el._id}
                            onMouseEnter={() => {}}
                          >
                            <Product_client_indiLayout
                              imgFileName={el.img}
                              productName={el.productName}
                              price={
                                stockCheck(el.size).length === 0
                                  ? 'Sold-Out'
                                  : `₩ ${el.price?.toLocaleString('ko-KR')}`
                              }
                            />
                          </Col>
                        );
                    })}
                  </Row>
                </Container>
              </SwiperSlide>
            )}

            {/* 4열 */}
            {pd_Datas.length <= 30 ? (
              <></>
            ) : (
              <SwiperSlide className="swiper_slide">
                <Container>
                  <Row xs={1} sm={2} md={4} lg={5}>
                    {pd_Datas.map((el, index) => {
                      if (index < 40 && index >= 30)
                        return (
                          <Col
                            onClick={() =>
                              navigate(`/store/detail/${el.productCode}`)
                            }
                            className="store_col"
                            key={el._id}
                            onMouseEnter={() => {}}
                          >
                            <Product_client_indiLayout
                              imgFileName={el.img}
                              productName={el.productName}
                              price={
                                stockCheck(el.size).length === 0
                                  ? 'Sold-Out'
                                  : `₩ ${el.price?.toLocaleString('ko-KR')}`
                              }
                            />
                          </Col>
                        );
                    })}
                  </Row>
                </Container>
              </SwiperSlide>
            )}

            {/* 5열 */}
            {pd_Datas.length <= 40 ? (
              <></>
            ) : (
              <SwiperSlide className="swiper_slide">
                <Container>
                  <Row xs={1} sm={2} md={4} lg={5}>
                    {pd_Datas.map((el, index) => {
                      if (index < 50 && index >= 40)
                        return (
                          <Col
                            onClick={() =>
                              navigate(`/store/detail/${el.productCode}`)
                            }
                            className="store_col"
                            key={el._id}
                            onMouseEnter={() => {}}
                          >
                            <Product_client_indiLayout
                              imgFileName={el.img}
                              productName={el.productName}
                              price={
                                stockCheck(el.size).length === 0
                                  ? 'Sold-Out'
                                  : `₩ ${el.price?.toLocaleString('ko-KR')}`
                              }
                            />
                          </Col>
                        );
                    })}
                  </Row>
                </Container>
              </SwiperSlide>
            )}
          </Swiper>
        </MediaQuery>

        <MediaQuery maxWidth={575}>
          {/* 반응형 상품진열 ---- */}
          {
            <Container>
              <Row xs={1}>
                {pd_Datas.map((el) => {
                  return (
                    <Col
                      onClick={() =>
                        navigate(`/store/detail/${el.productCode}`)
                      }
                      className="store_col"
                      key={el._id}
                      onMouseEnter={() => {}}
                    >
                      <Product_client_indiLayout
                        imgFileName={el.img}
                        productName={el.productName}
                        price={
                          stockCheck(el.size).length === 0
                            ? 'Sold-Out'
                            : `₩ ${el.price?.toLocaleString('ko-KR')}`
                        }
                      />
                    </Col>
                  );
                })}
              </Row>
            </Container>
          }
        </MediaQuery>

        <MediaQuery minWidth={576}>
          <div className="navi_pagi_fix">
            <div className="pagi_liner"></div>
            <SwiperPaginationContainer className="swiper_pagination_container">
              <SwiperPaginationBTN
                color="gray"
                hoverColor="lightgray"
                className="nav_arrow_pre"
                onClickEvent={() => swiperEl.slidePrev()}
              >
                〈
              </SwiperPaginationBTN>

              <SwiperPaginationBTN
                className={`pagi1 ${pagination1}`}
                color="gray"
                hoverColor="lightgray"
                onClickEvent={() => swiperEl.slideTo(0)}
              >
                1
              </SwiperPaginationBTN>

              {pd_Datas.length <= 10 ? (
                <></>
              ) : (
                <SwiperPaginationBTN
                  className={`pagi2 ${pagination2}`}
                  color="gray"
                  hoverColor="lightgray"
                  onClickEvent={() => swiperEl.slideTo(1)}
                >
                  2
                </SwiperPaginationBTN>
              )}

              {pd_Datas.length <= 20 ? (
                <></>
              ) : (
                <SwiperPaginationBTN
                  className={`pagi3 ${pagination3}`}
                  color="gray"
                  hoverColor="lightgray"
                  onClickEvent={() => swiperEl.slideTo(2)}
                >
                  3
                </SwiperPaginationBTN>
              )}

              {pd_Datas.length <= 30 ? (
                <></>
              ) : (
                <SwiperPaginationBTN
                  className={`pagi4 ${pagination4}`}
                  color="gray"
                  hoverColor="lightgray"
                  onClickEvent={() => swiperEl.slideTo(3)}
                >
                  4
                </SwiperPaginationBTN>
              )}

              {pd_Datas.length <= 40 ? (
                <></>
              ) : (
                <SwiperPaginationBTN
                  className={`pagi5 ${pagination5}`}
                  color="gray"
                  hoverColor="lightgray"
                  onClickEvent={() => swiperEl.slideTo(4)}
                >
                  5
                </SwiperPaginationBTN>
              )}

              <SwiperPaginationBTN
                color="gray"
                hoverColor="lightgray"
                className="nav_arrow_next"
                onClickEvent={() => swiperEl.slideNext()}
              >
                〉
              </SwiperPaginationBTN>
            </SwiperPaginationContainer>
          </div>
        </MediaQuery>
      </section>
    </main>
  );
}
