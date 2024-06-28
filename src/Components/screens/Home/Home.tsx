import { useState } from 'react';
import './Home.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = ["images/imagen1.jpg", "images/imagen2.jpg", "images/imagen3.jpg"]; // nombres de las imágenes

  const nextSlide = () => {
    setCurrentSlide(currentSlide === images.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? images.length - 1 : currentSlide - 1);
  };

  return (
    <div className="slider-container">
      <h1 className="title fw-bold">¡Bienvenidos!</h1>
      <div className="slider">
        {images.map((image, index) => (
          <div
            key={index}
            className="slide"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              left: `${index * 100}%`,
              opacity: index === currentSlide ? 1 : 0, 
            }}
          >
            <img src={image} alt={`Instrumento ${index + 1}`} />
          </div>
        ))}
      </div>
      <button className="prev" onClick={prevSlide}>{''}</button>
      <button className="next" onClick={nextSlide}>{''}</button>
      <div className="descripcion-container">
        <p className="descripcion">¡Te damos la bienvenida a La Casa de la Música, tu parada principal
          para descubrir los más destacados instrumentos musicales, sistemas de
          audio y complementos! Nuestra misión es brindarte una experiencia
          musical excepcional, presentándote una amplia selección de productos
          de primera categoría y un servicio al cliente sin igual. ¡Sumérgete en
          nuestro catálogo y encuentra tu verdadera pasión por la música en La
          Casa de la Música!</p>
      </div>
    </div>
  );
};

export default Home;
