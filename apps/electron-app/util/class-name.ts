/**
 * 조건에 해당하는 css 적용하는 함수
 * @param classes 조건에 따른 css
 * @returns css
 */
export function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
