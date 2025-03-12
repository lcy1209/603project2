"use client"

import { useState, useEffect } from "react"
import "./BannerManagement.css"

const BannerManagement = () => {
  const [banners, setBanners] = useState([])
  const [newBannerImage, setNewBannerImage] = useState(null)
  const [newBannerLink, setNewBannerLink] = useState("")

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch("http://localhost:8090/api/banners")
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const data = await response.json()
      setBanners(data)
    } catch (error) {
      console.error("Error fetching banners:", error)
    }
  }

  const handleImageChange = (e) => {
    setNewBannerImage(e.target.files[0])
  }

  const handleAddBanner = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("image", newBannerImage)
    formData.append("linkUrl", newBannerLink)

    try {
      const response = await fetch("http://localhost:8090/api/banners", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      fetchBanners()
      setNewBannerImage(null)
      setNewBannerLink("")
    } catch (error) {
      console.error("Error adding banner:", error)
    }
  }

  const handleRemoveBanner = async (id) => {
    try {
      const response = await fetch(`http://localhost:8090/api/banners/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      fetchBanners()
    } catch (error) {
      console.error("Error removing banner:", error)
    }
  }

  return (
    <div className="banner-management">
      <h1>배너 관리</h1>
      <form onSubmit={handleAddBanner} className="banner-form">
        <input type="file" onChange={handleImageChange} required />
        <input
          type="text"
          value={newBannerLink}
          onChange={(e) => setNewBannerLink(e.target.value)}
          placeholder="배너 링크 URL"
          required
        />
        <button type="submit">배너 추가</button>
      </form>
      <div className="banner-list">
        {banners.map((banner) => (
          <div key={banner.id} className="banner-item">
            <img src={banner.imageUrl || "/placeholder.svg"} alt="Banner" />
            <p>링크: {banner.linkUrl}</p>
            <button onClick={() => handleRemoveBanner(banner.id)}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BannerManagement

