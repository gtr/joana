// export default App
import React, { useState, useEffect } from 'react'
import { MoonPhases } from './MoonPhases';

function App() {
  // Array of all images
  const images = [
    {
      src: "/src/img/image_01.png",
      title: "Comme des Garçons",
      details: "SIX Magazine Pages 9-10 (1990)"
    },
    {
      src: "/src/img/image_02.png",
      title: "Comme des Garçons",
      details: "SIX Magazine Pages 21-22 (1990)"
    },
    {
      src: "/src/img/image_03.png",
      title: "Comme des Garçons",
      details: "SIX Magazine Pages 25-26 (1990)"
    },
    {
      src: "/src/img/image_04.png",
      title: "Comme des Garçons",
      details: "SIX Magazine Pages 33-34 (1990)"
    },
    {
      src: "/src/img/image_05.png",
      title: "Comme des Garçons",
      details: "SIX Magazine Pages 37-38 (1990)"
    },
    {
      src: "/src/img/image_06.png",
      title: "Comme des Garçons",
      details: "SIX Magazine Pages 63-64 (1990)"
    },
    {
      src: "/src/img/image_07.png",
      title: "Comme des Garçons",
      details: "SIX Magazine Pages 67-68 (1990)"
    },
    {
      src: "/src/img/image_08.png",
      title: "Comme des Garçons",
      details: "SIX Magazine Pages 71-72 (1990)"
    },
  ];

  const [showAbout, setShowAbout] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerId, setTimerId] = useState(null);

  const startTimer = () => {
    if (timerId) {
      clearInterval(timerId);
    }
    const newTimer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 10000);
    setTimerId(newTimer);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, []);


  const nextImage = () => {
    setCurrentIndex(prev => (prev + 1) % images.length);
    startTimer();
  };

  const prevImage = () => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    startTimer();
  };

  const AboutContent = () => (
    <div className="about-content">
      <MoonPhases />
      <p>
        Hello, I'm Joana Muñoz. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Quisque sagittis leo eget eros condimentum imperdiet. Aliquam dignissim eget sem
        interdum suscipit. Sed et turpis nunc. Donec malesuada fermentum est in
        ullamcorper. Fusce vel rhoncus dui. Praesent lobortis mattis dapibus. Aliquam
        eget massa orci. Curabitur fringilla tempor volutpat. Pellentesque dapibus nibh
        vitae felis hendrerit, ac malesuada lorem sodales. Vestibulum ultricies nibh
        erat, in fermentum nibh sodales nec.Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Quisque sagittis leo eget eros condimentum imperdiet. Aliquam
        dignissim eget sem interdum suscipit. Sed et turpis nunc.
      </p>
    </div>
  );
  return (
    <div className="container">
      <header>
        <div className="name">Joana Muñoz</div>
        <div className="nav">
          <button onClick={() => setShowAbout(!showAbout)}>
            {showAbout ? "Work" : "About"}
          </button>
        </div>
      </header>
      
      <main>
        {showAbout ? (
          <AboutContent />
        ) : (
          <>
            <div className="carousel">
              <button onClick={prevImage} className="nav-button prev">←</button>
              <img 
                src={images[currentIndex].src} 
                alt={images[currentIndex].title} 
              />
              <button onClick={nextImage} className="nav-button next">→</button>
            </div>
            <div className="caption">
              <em>{images[currentIndex].title}, {images[currentIndex].details}</em>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App