import React, { useEffect, useState } from 'react';
import '../../styles/intro_Movie_client.scss';
import ReactPlayer from 'react-player';

export default function Intro_movie_client() {
  const [playING, setPlayING] = useState(false);

  useEffect(() => {
    return () => {
      setPlayING((cur) => false);
    };
  }, []);

  // const handle = () => {
  //   setPlayING((cur) => true);
  // };

  return (
    <section className="intro_moive">
      <div className="intro_moive_container">
        <div className="intro_moive_wrap">
          <ReactPlayer
            url="/videos/intro_1.mp4"
            width="100%"
            height="auto"
            playing={false}
            muted={true}
            loop={playING}
            volume={0}
            playsinline={true}
            // onReady={handle}
            controls={true}
          />
        </div>
      </div>
    </section>
  );
}
