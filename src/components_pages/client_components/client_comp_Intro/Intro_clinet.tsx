import React, { useEffect, useState } from 'react';
import style from '../../../styles/intro.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import '../../../styles/swiper.css';
import SwiperCore, { Autoplay } from 'swiper';
import Loading from '../Loading';

export default function Intro_clinet() {
  SwiperCore.use([Autoplay]);
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
    <section className={style.container}>
      {isLoading && <Loading top="40%" />}
      <div className={style.intro_logo_box}>
        <img src="/FOVV_mainLogo.png" className={style.intro_logo} />
        <p>
          FOVE is brand that stands for Fever, Freedom, Fortitude, Faith, and is
          a brand of passion, energy and challenge.
        </p>
      </div>
      <div className={style.image_box}>
        <Swiper
          loopPreventsSliding={true}
          slidesPerView={1}
          loop={true}
          modules={[Autoplay]}
          className={style.swiper}
          autoplay={{
            delay: 5000, // 각 슬라이드 간의 시간 간격 (5초)
            disableOnInteraction: false, // 사용자 상호작용 후에도 자동 재생 유지
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <SwiperSlide key={index}>
              <div
                style={{
                  backgroundImage: `url(${process.env.PUBLIC_URL}/images/main${
                    index + 1
                  }.webp)`,
                  width: '500px',
                  height: '700px',
                  backgroundPosition:
                    index === 1 ? '0 10%' : index === 3 ? '0 80%' : '0 40%',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
