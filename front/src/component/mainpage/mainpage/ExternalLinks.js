import React from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import "./ExternalLinks.css"

const ExternalLinks = () => {
  const links = [
    {
      name: "대학 홈페이지",
      url: "https://www.university.ac.kr",
      image: "/images/external_links_logos/main_slide_logo01.png",
    },
    {
      name: "워크넷",
      url: "https://www.work24.go.kr",
      image: "/images/external_links_logos/main_slide_logo02.png",
    },
    { 
      name: "사람인",
      url: "https://www.saramin.co.kr",
      image: "/images/external_links_logos/main_slide_logo03.png",
    },
    {
      name: "에듀스",
      url: "https://www.educe.co.kr",
      image: "/images/external_links_logos/main_slide_logo04.png",
    },
    {
      name: "레주메팩토리",
      url: "http://resumefactory.co.kr",
      image: "/images/external_links_logos/main_slide_logo05.png",
    },
    {
      name: "월드잡플러스",
      url: "https://www.worldjob.or.kr",
      image: "/images/external_links_logos/main_slide_logo06.png",
    },
    {
      name: "고용노동부",
      url: "https://www.moel.go.kr",
      image: "/images/external_links_logos/main_slide_logo07.png",
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 5 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 2 },
      },
    ],
  }

  return (
    <div className="external-links">
      <Slider {...settings}>
        {links.map((link, index) => (
          <div key={index} className="external-link-wrapper">
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="external-link">
              <img src={link.image || "/placeholder.svg"} alt={link.name} className="external-link-image" />
            </a>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default ExternalLinks

