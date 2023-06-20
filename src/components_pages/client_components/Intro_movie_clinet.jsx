/* eslint-disable no-undef */
import React, { useEffect, useRef } from 'react';
import '../../styles/intro_Movie_client.scss';
import Plyr from 'plyr';

export default function Intro_movie_client() {
  const videoRef = useRef(null);

  useEffect(() => {
    const player = new Plyr(videoRef.current, {
      inheritedControls: true,
      controls: false,
      autoplay: false,
      muted: true,
      volume: 0,
      preload: 'metadata',
    });
    player.source = {
      type: 'video',
      sources: [{ src: '/videos/intro.mp4', type: 'video/mp4' }],
    };

    const handleUser = () => {
      player.play();
    };

    document.addEventListener('click', handleUser);

    return () => {
      document.removeEventListener('click', handleUser);
      player.destroy();
    };
  }, []);

  return (
    <section className="intro_moive">
      <div className="intro_moive_container">
        {' '}
        <video className="intro_content" ref={videoRef}></video>
      </div>
    </section>
  );
}
