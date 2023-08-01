// 서브 메뉴 생성용
export const sub_menu = [
  {
    label: 'VIEW ALL',
    clickPath: '/store',
  },
  {
    label: 'NEW ARRIVALS',
    clickPath: '/store/new',
  },
  {
    label: 'BEANIE',
    clickPath: '/store/beanie',
  },
  {
    label: 'CAP',
    clickPath: '/store/cap',
  },
  {
    label: 'TRAINING',
    clickPath: '/store/training',
  },
  {
    label: 'WINDBREAKER',
    clickPath: '/store/windbreaker',
  },
];

// 서브메뉴 반응형 셀렉터 핸들러 => sub_menu에는 위 sub_menu라는 객체 배열을 넣어준다.
export const handleCategoryChange = (e, sub_menu, navigate) => {
  let eValue = e.target.value;

  for (let el of sub_menu) {
    if (eValue === el.label) {
      return navigate(`${el.clickPath}`);
    }
  }
};

// 서브메뉴에서 카테고리 영역의 Value설정 핸들러 => sub_menu에는 위 sub_menu라는 객체 배열을 넣어준다.
export const selectCategory = (sub_menu, category) => {
  for (let el of sub_menu) {
    if (category === el.label.toLowerCase()) {
      return el.label;
    }
  }
};
