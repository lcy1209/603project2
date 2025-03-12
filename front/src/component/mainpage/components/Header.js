import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import useAuth, { LOGIN_STATUS } from '../../login/hooks/useAuth';
import { LoginContext } from '../../login/security/contexts/LoginContextProvider';
import { menuItems } from '../utils/menuItems';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [headerHeight, setHeaderHeight] = useState("135px");
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { logout } = useContext(LoginContext);
  const { loginStatus, name } = useAuth(); // ✅ name 가져오기


  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, []); // 로그인 기능 구현

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };      // 로그아웃 기능 구현

  const handleMenuHover = (index) => {
    setActiveSubmenu(index);
    setHeaderHeight(index !== null ? "350px" : "135px");
  };

  // 화면 크기가 변경될 때마다 모바일 여부를 설정
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768
      setIsMobile(newIsMobile)
      if (newIsMobile !== isMobile) {
        setIsMobileMenuOpen(false)
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 초기 화면 크기 체크

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }


  return (
    <header className="header" style={{ height: headerHeight }}>
      <div className="header-container">
        <div className="header-top">
          <div className="logo-container">
            <a href="https://www.hansei.ac.kr/" target="_blank" rel="noopener noreferrer" className="logo">
              <img src="/images/logos/logo.png" alt="한세대학교 로고" />
            </a>
            <Link to="/" className="site-title">
              대학 일자리플러스센터
            </Link>
          </div>
          <div className="auth-container">
            {
              loginStatus === LOGIN_STATUS.LOGGED_IN ? (
                <>
                  <div id="top_login" className="header-login-container">
                    <div className="flex-container">
                      <p className="userid">{name}님</p>
                      <button
                        type="button"
                        style={{ marginLeft: "10px" }}
                        className="auth-button"
                        onClick={() => logout()}
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div id="top_login" className="auth-buttons">
                  <a className="auth-button" href="/kakao-login">
                    지역 청년 로그인
                  </a>
                  <a className="auth-button" href="/login">
                    로그인
                  </a>
                  <span> | </span>
                  <a className="auth-button" href="/join">
                    회원가입
                  </a>
                </div>
              )
            }

          </div>
        </div>

       {/* 메뉴 아이콘 버튼 (작은 화면에서만 표시) */}
       {isMobile && (
          <>
            <button className="menu-toggle" onClick={toggleMobileMenu}>
              ☰
            </button>
            {isMobileMenuOpen && (
              <div className="mobile-menu">
                <button className="close-menu" onClick={toggleMobileMenu}>
                  ×
                </button>
                <ul className="mobile-nav-menu">
                  {menuItems.map((item, index) => (
                    <li key={index} className="mobile-nav-item">
                      <button onClick={() => setActiveSubmenu(activeSubmenu === index ? null : index)}>
                        {item.title}
                      </button>
                      {activeSubmenu === index && (
                        <ul className="mobile-submenu">
                          {item.submenu.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                to={subItem.link}
                                className="mobile-submenu-item"
                                onClick={toggleMobileMenu}
                              >
                                {subItem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {!isMobile && (
          <nav className="header-nav">
            <ul className="nav-menu">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className="nav-item"
                  onMouseEnter={() => handleMenuHover(index)}
                  onMouseLeave={() => handleMenuHover(null)}
                >
                  <div key={index} className="menu-item">
                    {/* 메인 메뉴 */}
                    <Link
                      to={item.submenu[0]?.link || "/default"}
                      className="nav-button"
                    >
                      {item.title}
                    </Link>

                    {/* 서브메뉴 */}
                    <div className="submenu">
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.link}
                          className="submenu-item"
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>

                </li>
              ))}
            </ul>
          </nav>
        )} {/* !isMobile */}
      </div>
    </header>
  );
};

export default Header;

