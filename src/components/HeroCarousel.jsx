import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { EffectFade } from 'swiper/modules'
import '../components/ComponentsStyles/HeroCarousel.css'
import React from 'react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import video1 from "../assets/videos/video1.mp4"
import video2 from "../assets/videos/video2.mp4"
import video3 from "../assets/videos/video3.mp4"


const videoSlides = [
  { id: 1, src: video1, title: '' },
  { id: 2, src: video2, title: '' },
  { id: 3, src: video3, title: '' },
]

const HeroCarousel = () => {
  return (
      <Swiper
      modules={[Navigation, Pagination, Autoplay, EffectFade]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      navigation={true}
      pagination={{ clickable: true }}
      autoplay={{ delay: 7000, disableOnInteraction: false }}
      speed={1000}
      loop={true}
      className="hero-swiper">
        {videoSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
                <div className="video-slide">
                    <video className="hero-video"
                    src={slide.src}
                    autoPlay
                    muted
                    loop
                    playsInline />
                    <div className="video-overlay">
                        <h2>{slide.title}</h2>
                    </div>
                </div>
            </SwiperSlide>
        ))}
      </Swiper>
  )
}

export default HeroCarousel
