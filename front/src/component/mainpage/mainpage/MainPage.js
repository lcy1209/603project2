import React from "react"
import BannerSlider from "./BannerSlider"
import IconMenu from "./IconMenu"
import CommunitySection from "./CommunitySection"
import ExternalLinks from "./ExternalLinks"
import "./MainPage.css"

const MainPage = () => {
  return (
    <div className="main-background">
      <div className="main-page">
        <BannerSlider />
        <IconMenu />
        { /*<InfoBoxes /> */}
        <CommunitySection />
        <ExternalLinks />
      </div>
    </div>
  )
}

export default MainPage