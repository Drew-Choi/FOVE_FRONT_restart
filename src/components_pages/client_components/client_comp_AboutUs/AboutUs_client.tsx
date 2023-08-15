import style from '../../../styles/aboutus_client.module.scss';

export default function AboutUs_client() {
  return (
    <>
      <div className={style.aboutus}>
        <div className={style.about_left}>
          <img src="images/aboutus.gif"></img>
        </div>
        <div className={style.about_right}>
          <div className={style.maintitle}>
            <h2 className={style.subtitle}>
              ABOUT
              <br />
              <br />
              <br />
            </h2>
            <div className={style.aboutus}>
              <p>
                FOVE is brand that stands for Fever, Freedom, Fortitude, Faith,
                <br />
                and is a brand of passion, energy and challenge.
                <br />
                <br />
                FOVE는 Fervor(열정), Freedom(자유), Fortitude(불굴의정신),
                Faith(신념)을 상징하며,
                <br />
                열정과 에너지 그리고 도전의 정신이 담긴 브랜드입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
