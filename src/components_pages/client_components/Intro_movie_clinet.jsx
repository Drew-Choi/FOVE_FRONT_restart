/* eslint-disable no-undef */
import React, { Suspense, useEffect, useState } from 'react';
import '../../styles/intro_Movie_client.scss';
import Loading from './Loading';

const Intro_content = React.lazy(() => import('./Intro_content'));

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
    <section className="intro_moive">
      {isLoading && <Loading />}
      <Suspense fallback={<Loading />}>
        <Intro_content />
      </Suspense>
      <div className="intro_moive_container"></div>
    </section>
  );
}
