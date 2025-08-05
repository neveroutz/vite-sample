// 페이지별 레이아웃 설정
export const pageConfigs = {
  '/': {
    showMainNav: true,
    navType: 'main',
    hasFooter: true,
    layoutClass: 'home-layout',
  },
  '/page1': {
    showMainNav: true,
    navType: 'main',
    hasFooter: true,
    layoutClass: 'standard-layout',
  },
  '/page2': {
    showMainNav: false,
    navType: 'custom', // Page2는 자체 네비게이션
    hasFooter: false,
    layoutClass: 'page2-layout',
  },
  // 향후 추가될 페이지들 예시:
  // '/admin': {
  //   showMainNav: false,
  //   navType: 'admin',
  //   hasFooter: false,
  //   layoutClass: 'admin-layout'
  // },
  // '/dashboard': {
  //   showMainNav: false,
  //   navType: 'dashboard',
  //   hasFooter: true,
  //   layoutClass: 'dashboard-layout'
  // }
};

// 기본 설정 (설정되지 않은 페이지용)
export const defaultConfig = {
  showMainNav: true,
  navType: 'main',
  hasFooter: true,
  layoutClass: 'default-layout',
};

// 설정 가져오기 헬퍼 함수
export const getPageConfig = pathname => {
  return pageConfigs[pathname] || defaultConfig;
};
