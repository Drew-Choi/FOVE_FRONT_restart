import React, { useEffect, useState } from 'react';
import style from '../../../styles/intro_Movie_client.module.scss';
import Loading from '../Loading';
import Iframe from 'react-iframe';

export default function Intro_movie_clinet() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const time = setTimeout(() => {
      setIsLoading(false);
    }, 1300);

    return () => {
      clearTimeout(time);
    };
  }, []);

  return (
    <section className={style.intro_moive}>
      <div className={style.intro_moive_container}>
        {isLoading && <Loading />}
        <Iframe
          url="https://player.vimeo.com/video/837875796?title=0&amp;byline=0&amp;autoplay=1&amp;speed=0&amp;muted=1&amp;controls=0&amp;loop=1&amp;quality=auto&amp;app_id=122963"
          width="1680"
          height="945"
          className={style.content}
          frameBorder="0"
          allow="autoplay; picture-in-picture"
          allowFullScreen
          title="fovv_intro_example"
        />
      </div>
    </section>
  );
}
