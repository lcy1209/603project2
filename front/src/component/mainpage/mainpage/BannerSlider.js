"use client";

import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./BannerSlider.css";

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [sliderSettings, setSliderSettings] = useState({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  });

  useEffect(() => {
    fetch("http://localhost:8090/api/banners")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched banners:", data);

        if (Array.isArray(data)) {
          setBanners(data);
          if (data.length > 0) {
            setSliderSettings((prevSettings) => ({
              ...prevSettings,
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
            }));
          }
        } else {
          console.error("API 응답이 배열이 아닙니다:", data);
          setBanners([]); // 응답이 배열이 아니면 빈 배열로 설정
        }
      })
      .catch((error) => {
        console.error("Error fetching banners:", error);
        setBanners([]); // 요청 실패 시 빈 배열 설정
      });
  }, []);

  if (!Array.isArray(banners) || banners.length === 0) {
    return <div className="banner-placeholder">배너 이미지가 없습니다.</div>;
  }

  return (
    <div className="banner-slider-container">
      <div className="banner-slider">
        <Slider {...sliderSettings}>
          {banners.map((banner) => (
            <div key={banner.id}>
              <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={banner.imageUrl || "/placeholder.svg"}
                  alt={banner.alt || "배너"}
                  className="banner-image"
                />
              </a>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default BannerSlider;
