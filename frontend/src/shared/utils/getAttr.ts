/**
 * Удаляет квадратные скобки с обеих сторон строки.
 *
 * @param {string} str - Строка, из которой нужно удалить скобки.
 * @return {string} - Строка без квадратных скобок.
 */
export const getAttr = (str: string) => {
  return str.replace(/^\[|\]$/g, "").trim(); // Убираем скобки и обрезаем пробелы
};

// Примеры использования
// console.log(getAttr("[example]")); // "example"
// console.log(getAttr("[  example  ]")); // "example"
// console.log(getAttr("no brackets")); // "no brackets"
// console.log(getAttr("[data-js-delete-mark-btn]")); // "data-js-delete-mark-btn"
