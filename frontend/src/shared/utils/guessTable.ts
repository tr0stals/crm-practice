/**
 *  Метод, который ищет внешнюю таблицу по внешнему ключу
 * @param fieldName - поле внешней таблицы (LicenseTypeId)
 * @returns
 */
export const guessTableName = (fieldName: string): string => {
  // убираем 'Id' с конца
  const base = fieldName.slice(0, -2);

  // вставляем дефис перед каждой заглавной буквой, делаем нижний регистр
  const kebab = base.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();

  // делаем множественное число (наивно, можно заменить на `pluralize`)
  return kebab.endsWith("s") ? kebab : kebab + "s";
};
