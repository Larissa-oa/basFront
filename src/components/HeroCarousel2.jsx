import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import '../components/ComponentsStyles/HeroCarousel2.css'
import image1 from '../assets/images/image6.jpg'
import image2 from '../assets/images/image7.jpg'
import image3 from '../assets/images/image8.jpg'
import image4 from '../assets/images/image9.jpg'
import image5 from '../assets/images/image10.jpg'  
import image6 from '../assets/images/image11.jpg' 

const HeroCarousel2 = () => {
  const images = [
    { id: 1, src: image1, title: '' },
    { id: 2, src: image2, title: '' },
    { id: 3, src: image3, title: '' },
    { id: 4, src: image4, title: '' },
    { id: 5, src: image5, title: '' },
    { id: 6, src: image6, title: '' }
  ];

  const handleScrollDown = (e) => {
    e.preventDefault();
    const nextSection = document.getElementById('next-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop
        spaceBetween={0}
      >
        {images.map((img, idx) => (
          <SwiperSlide key={img.id}>
            <img
              src={img.src}
              alt={`slide-${idx}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default HeroCarousel2
