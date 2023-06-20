/* eslint-disable no-undef */
import React, { useEffect, useRef, useState } from 'react';
import '../../styles/intro_Movie_client.scss';

export default function Intro_movie_client() {
  return (
    <section className="intro_moive">
      <div className="intro_moive_container">
        <video muted playsInline className="intro_content">
          <source src="/videos/intro.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
