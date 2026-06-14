/**
 * Анимация появления - 3 секунды
 * @param nodeTitle - название класса узла, для которого будет применена анимация появления
 * @param animationDuration -
 */
export function setFadeAnimation(nodeTitle: string) {
  const targetNode = document.querySelector(nodeTitle);
  console.debug(targetNode);
  targetNode?.classList.add("fadeAnimation");
  setTimeout(() => {
    targetNode?.classList.remove("fadeAnimation");
  }, 100);
}
