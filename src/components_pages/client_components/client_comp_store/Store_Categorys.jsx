import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import '../../../styles/store_client.scss';
import Product_client_indiLayout from '../Product_client_indiLayout';
import { Container, Row, Col } from 'react-bootstrap';
import SwiperCore, { Navigation, Pagination, A11y, Mousewheel } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import SwiperPaginationBTN from '../../../styles/SwiperPaginationBTN';
import SwiperPaginationContainer from '../../../styles/SwiperPaginationContainer';
import SubNav_client from '../../client_components/SubNav_client';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MediaQuery from 'react-responsive';
import Loading2 from '../Loading2';

SwiperCore.use([Navigation]);

export default function Store_Categorys() {
  const { category } = useParams();
  const searchText = useSelector((state) => state.search.searchData);
  const orignData = useRef([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  //네비게이트 리액트Dom 설정
  const navigate = useNavigate();

  //네비게이트 로딩
  const navLoading = (address) => {
    setIsVisible((cur) => true);
    setTimeout(() => {
      setIsVisible((cur) => false);
    }, 400);
    navigate(address);
  };

  //스와이퍼 커스텀
  const [swiperEl, setSwiperEl] = useState(null);
  const [pagination1, setPagination1] = useState('on');
  const [pagination2, setPagination2] = useState('off');
  const [pagination3, setPagination3] = useState('off');
  const [pagination4, setPagination4] = useState('off');
  const [pagination5, setPagination5] = useState('off');

  //카테고리 상품데이터 get
  const [pd_Datas_Cateroys, setPd_Datas_Categorys] = useState([]);

  //상품검색
  const searchProducts = (text) => {
    setPd_Datas_Categorys((cur) => {
      const newData = [...orignData.current];
      const lowercaseText = text.toLowerCase();
      if (lowercaseText !== '') {
        return newData.filter((el) => {
          const lowercaseProductName = el.productName.toLowerCase();
          return lowercaseProductName.indexOf(lowercaseText) !== -1;
        });
      } else {
        return newData;
      }
    });
  };

  //엑시오스로 모든 상품 정보 요청
  const getCategoryProducts = async () => {
    try {
      const productsData = await axios.get(
        `http://localhost:4000/store/${category}`,
      );
      if (productsData.status === 200) {
        await setPd_Datas_Categorys(productsData.data);
        setIsLoading(false);
        return;
      } else {
        return console.log('데이터 실패');
      }
    } catch (err) {
      console.error(err);
    }
  };

  //상품데이터 db에서 가져오기
  useEffect(() => {
    if (!category) return;

    getCategoryProducts();
  }, [category]);

  useEffect(() => {
    searchProducts(searchText);
  }, [searchText]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

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

  //반응형 영역
  //반응형 카테고리 구현
  const categotryMenus_act = [
    'VIEW ALL',
    'NEW ARRIVALS',
    'BEANIE',
    'CAP',
    'TRAINING',
    'WINDBREAKER',
  ];

  //반응형 셀렉터 핸들
  const handleCategoryChange = (e) => {
    let eValue = e.target.value;
    if (eValue === 'VIEW ALL') {
      navigate('/store');
      return;
    } else if (eValue === 'NEW ARRIVALS') {
      navigate('/store/new');
      return;
    } else if (eValue === 'BEANIE') {
      navLoading('/store/beanie');
      return;
    } else if (eValue === 'CAP') {
      navLoading('/store/cap');
      return;
    } else if (eValue === 'TRAINING') {
      navLoading('/store/training');
      return;
    } else if (eValue === 'WINDBREAKER') {
      navLoading('/store/windbreaker');
      return;
    }
  };

  const selectCategory = () => {
    if (category === 'beanie') return 'BEANIE';
    else if (category === 'cap') return 'CAP';
    else if (category === 'training') return 'TRAINING';
    else if (category === 'windbreaker') return 'WINDBREAKER';
  };

  return (
    <main className="store_main">
      <MediaQuery minWidth={576}>
        <SubNav_client
          onClickEvent1={() => navigate('/store')}
          onClickEvent2={() => navigate('/store/new')}
          onClickEvent3={() => {
            navLoading('/store/beanie');
          }}
          onClickEvent4={() => navLoading('/store/cap')}
          onClickEvent5={() => navLoading('/store/training')}
          onClickEvent6={() => navLoading('/store/windbreaker')}
          menu1="VIEW ALL"
          menu2="NEW ARRIVALS"
          menu3="BEANIE"
          menu4="CAP"
          menu5="TRAINING"
          menu6="WINDBREAKER"
        />
      </MediaQuery>

      <MediaQuery maxWidth={575}>
        <select
          className="selectCategorys"
          value={selectCategory()}
          onChange={handleCategoryChange}
        >
          {categotryMenus_act.map((el) => (
            <option value={el} key={el}>
              {el}
            </option>
          ))}
        </select>
      </MediaQuery>

      {isLoading ? (
        <Loading2 />
      ) : (
        <>
          {isVisible && <Loading2 />}

          <section className="product_display">
            <MediaQuery minWidth={576}>
              <Swiper
                // install Swiper modules
                modules={[Navigation, Pagination, A11y, Mousewheel]}
                spaceBetween={50}
                slidesPerView={1}
                // navigation={true}
                // pagination={{ clickable: true }}
                onSwiper={(swiper) => setSwiperEl((cur) => swiper)}
                // onSlideChange={() => console.log('slide change')}
                onActiveIndexChange={(swiper) => {
                  swiper.activeIndex !== 0
                    ? setPagination1((cur) => 'off')
                    : setPagination1((cur) => 'on');
                  swiper.activeIndex !== 1
                    ? setPagination2((cur) => 'off')
                    : setPagination2((cur) => 'on');
                  swiper.activeIndex !== 2
                    ? setPagination3((cur) => 'off')
                    : setPagination3((cur) => 'on');
                  swiper.activeIndex !== 3
                    ? setPagination4((cur) => 'off')
                    : setPagination4((cur) => 'on');
                  swiper.activeIndex !== 4
                    ? setPagination5((cur) => 'off')
                    : setPagination5((cur) => 'on');
                }}
                mousewheel={false}
                className="swiper_container"
              >
                <SwiperSlide className="swiper_slide">
                  <Container>
                    <Row xs={1} sm={2} md={4} lg={5}>
                      {pd_Datas_Cateroys.map((el, index) => {
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
                                price={frontPriceComma(el.price)}
                              />
                            </Col>
                          );
                      })}
                    </Row>
                  </Container>
                </SwiperSlide>

                <SwiperSlide className="swiper_slide">
                  <Container>
                    <Row xs={1} sm={2} md={4} lg={5}>
                      {pd_Datas_Cateroys.map((el, index) => {
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
                                price={frontPriceComma(el.price)}
                              />
                            </Col>
                          );
                      })}
                    </Row>
                  </Container>
                </SwiperSlide>

                <SwiperSlide className="swiper_slide">
                  <Container>
                    <Row xs={1} sm={2} md={4} lg={5}>
                      {pd_Datas_Cateroys.map((el, index) => {
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
                                price={frontPriceComma(el.price)}
                              />
                            </Col>
                          );
                      })}
                    </Row>
                  </Container>
                </SwiperSlide>

                <SwiperSlide className="swiper_slide">
                  <Container>
                    <Row xs={1} sm={2} md={4} lg={5}>
                      {pd_Datas_Cateroys.map((el, index) => {
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
                                price={frontPriceComma(el.price)}
                              />
                            </Col>
                          );
                      })}
                    </Row>
                  </Container>
                </SwiperSlide>

                <SwiperSlide className="swiper_slide">
                  <Container>
                    <Row xs={1} sm={2} md={4} lg={5}>
                      {pd_Datas_Cateroys.map((el, index) => {
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
                                price={frontPriceComma(el.price)}
                              />
                            </Col>
                          );
                      })}
                    </Row>
                  </Container>
                </SwiperSlide>
              </Swiper>
            </MediaQuery>

            <MediaQuery maxWidth={575}>
              {/* 반응형 상품진열 ---- */}
              {
                <Container>
                  <Row xs={1}>
                    {pd_Datas_Cateroys.map((el, index) => {
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
                            price={frontPriceComma(el.price)}
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
                  <SwiperPaginationBTN
                    className={`pagi2 ${pagination2}`}
                    color="gray"
                    hoverColor="lightgray"
                    onClickEvent={() => swiperEl.slideTo(1)}
                  >
                    2
                  </SwiperPaginationBTN>
                  <SwiperPaginationBTN
                    className={`pagi3 ${pagination3}`}
                    color="gray"
                    hoverColor="lightgray"
                    onClickEvent={() => swiperEl.slideTo(2)}
                  >
                    3
                  </SwiperPaginationBTN>
                  <SwiperPaginationBTN
                    className={`pagi4 ${pagination4}`}
                    color="gray"
                    hoverColor="lightgray"
                    onClickEvent={() => swiperEl.slideTo(3)}
                  >
                    4
                  </SwiperPaginationBTN>
                  <SwiperPaginationBTN
                    className={`pagi5 ${pagination5}`}
                    color="gray"
                    hoverColor="lightgray"
                    onClickEvent={() => swiperEl.slideTo(4)}
                  >
                    5
                  </SwiperPaginationBTN>

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
        </>
      )}
    </main>
  );
}
