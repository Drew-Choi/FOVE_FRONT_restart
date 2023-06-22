import React from 'react';
import Iframe from 'react-iframe';

export default function Intro_content() {
  return (
    <>
      <Iframe
        url="https://player.vimeo.com/video/837875796?title=0&amp;byline=0&amp;autoplay=1&amp;speed=0&amp;muted=1&amp;controls=0&amp;loop=1&amp;quality=auto&amp;app_id=122963"
        width="1680"
        height="945"
        className="content"
        frameBorder="0"
        allow="autoplay; picture-in-picture"
        allowFullScreen
        title="fovv_intro_example"
      />
    </>
  );
}
