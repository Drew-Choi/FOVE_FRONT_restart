//천단위 콤마생성
export const changeEnteredNumComma = (el: number | string) => {
  const comma = (el: number | string) => {
    el = String(el);
    return el.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  };
  const uncomma = (el: number | string) => {
    el = String(el);
    return el.replace(/[^\d]+/g, '');
  };
  return comma(uncomma(el));
};

//콤마제거하고 연산 가능한 숫자로 바꾸기
export const resultCommaRemove = (el: string) => {
  return Number(el.split(',').reduce((cur, acc) => cur + acc, ''));
};
//-------
