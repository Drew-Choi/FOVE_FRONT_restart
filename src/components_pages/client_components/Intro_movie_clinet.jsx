/* eslint-disable no-undef */
import React, { useEffect, useRef, useState } from 'react';
import '../../styles/intro_Movie_client.scss';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default function Intro_movie_client() {
  const videoRef = useRef(null);

  useEffect(() => {
    const player = videojs(videoRef.current, {
      autoplay: false,
      muted: true,
      volume: false,
      playsinline: true,
      preload: 'metadata',
      controls: true,
    });

    const handleUser = () => {
      player.play();
    };

    document.addEventListener('click', handleUser);

    player.src('/videos/intro.mp4');

    return () => {
      document.removeEventListener('click', handleUser);
      player.dispose();
    };
  }, []);

  return (
    <section className="intro_moive">
      <div className="intro_moive_container">
        <div data-vjs-player>
          <video ref={videoRef} className="video-js" width="1682"></video>
        </div>
      </div>
    </section>
  );
}
