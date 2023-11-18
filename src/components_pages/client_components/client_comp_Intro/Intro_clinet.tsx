import React, { useEffect, useState } from 'react';
import style from '../../../styles/intro.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import '../../../styles/swiper.css';
import 'swiper/css';
import 'swiper/css/effect-fade';
import SwiperCore, { Autoplay, EffectFade } from 'swiper';
import Loading from '../Loading';

// import MediaQuery from 'react-responsive';

SwiperCore.use([Autoplay, EffectFade]);

export default function Intro_clinet() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const time = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(time);
    };
  }, []);

  return (
    <>
      {isLoading && <Loading top="40%" />}
      <section className={style.container}>
        <div className={style.image_box}>
          <Swiper
            loopPreventsSliding={true}
            slidesPerView={1}
            loop={true}
            modules={[Autoplay, EffectFade]}
            className={style.swiper}
            autoplay={{
              delay: 5000, // 각 슬라이드 간의 시간 간격 (5초)
              disableOnInteraction: false, // 사용자 상호작용 후에도 자동 재생 유지
            }}
            effect="fade"
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <SwiperSlide key={index} className={style.swiper_slide}>
                <div className={style.image_wrap}>
                  <img
                    className={style.image_content}
                    src={`${process.env.PUBLIC_URL}/images/main${
                      index + 1
                    }.webp`}
                    style={{
                      transform:
                        index === 0
                          ? 'translateY(-11%)'
                          : index === 1
                          ? 'translateY(-9%)'
                          : index === 2
                          ? 'translateY(-12%)'
                          : index === 3
                          ? 'translateY(-17%)'
                          : '',
                    }}
                    alt="메인이미지"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
}
