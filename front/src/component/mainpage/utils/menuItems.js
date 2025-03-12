// 메뉴 항목 데이터
export const menuItems = [
    {
      title: "센터소개",
      submenu: [
        { title: "부서소개", link: "/about/department-intro" },
        { title: "진로 취업 로드맵", link: "/about/career-roadmap" },
        { title: "진로 취업 프로그램", link: "/about/career-program" }
      ]
    },
    {
      title: "채용정보",
      submenu: [
        { title: "채용정보", link: "/mainRecruitment" },
        { title: "취업솔루션", link: "/" }
      ]
    },
    {
      title: "프로그램",
      submenu: [
        { title: "전체 프로그램", link: "/programs" },
        { title: "취업 프로그램", link: "/programs/job" },
        { title: "진로 프로그램", link: "/programs/career" },
        { title: "창업 프로그램", link: "/programs/startup" },
        { title: "신청내역", link: "/" }
      ]
    },
    {
      title: "커뮤니티",
      submenu: [
        { title: "공지사항", link: "/community/notice" },
        { title: "FAQ", link: "/community/faq" },
        { title: "자료실", link: "/community/archive" },
        { title: "상담", link: "/counsel" }
      ]
    },
    {
      title: "마이페이지",
      submenu: [
        { title: "회원 정보", link: "/myEdit" },
        { title: "나의 채용 정보", link: "/myEmployment" },
        { title: "나의 취업 프로그램", link: "/myProgram" },
        { title: "나의 최근 상담", link: "/myCounsel" }
      ]
    },
  ]
  
  // 특정 타이틀에 해당하는 서브메뉴 항목 가져오기
  export const getSubmenuByTitle = (title) => {
    const menuItem = menuItems.find((item) => item.title === title)
    return menuItem ? menuItem.submenu : []
  }
  
  