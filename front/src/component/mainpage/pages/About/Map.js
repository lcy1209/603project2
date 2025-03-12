import React, { useEffect } from "react";

const Map = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=851371ace959b575e7199c7815a19c33&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(37.283611, 126.934444), // 한세대학교 좌표
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);

        // 마커 추가
        const markerPosition = new window.kakao.maps.LatLng(37.283611, 126.934444);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
      });
    };
  }, []);

  return <div id="map" style={{ width: "100%", height: "400px" }} />;
};

export default Map;
