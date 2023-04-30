/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import '../../styles/intro_Movie_client.scss';
import ReactPlayer from 'react-player';

export default function Intro_movie_client() {
  const [playING, setPlayING] = useState(false);

  useEffect(() => {
    setPlayING((cur) => true);

    return () => {
      setPlayING((cur) => false);
    };
  }, []);

  return (
    <section className="intro_moive">
      <div className="intro_moive_container">
        <div className="intro_moive_wrap">
          <ReactPlayer
            url="/videos/intro.mp4"
            width="100%"
            height="auto"
            playing={playING}
            muted={true}
            loop={playING}
            volume={0}
          />
        </div>
      </div>
    </section>
  );
}
