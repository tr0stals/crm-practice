import { reactive } from "vue";
import { sectionRules } from "../config/sectionRules";

export type ValidationErrors = {
  [section: string]: Record<string, string>; // секции + "global"
};

export function useFormValidation(formData: any) {
  const errors = reactive<ValidationErrors>({});

  const specialRootFields = [
    "addedDate",
    "shipmentDate",
    "arrivalDate",
    "specificationImage",
  ];
  const employeesFields = ["hiringDate", "dismissalDate"];

  /**
   * Универсальная проверка "пустое значение"
   */
  function isEmpty(value: any): boolean {
    if (value === undefined || value === null) return true;

    // пустая строка или строка из пробелов
    if (typeof value === "string") return value.trim() === "";

    // пустой массив
    if (Array.isArray(value)) return value.length === 0;

    // пустой объект
    if (typeof value === "object") return Object.keys(value).length === 0;

    // NaN в числе
    if (typeof value === "number" && isNaN(value)) return true;

    return false;
  }

  /**
   * Получаем значение поля (учёт вложенной секции)
   */
  function getFieldValue(fieldName: string, section?: string) {
    if (specialRootFields.includes(fieldName)) {
      return formData[fieldName];
    }

    if (section && formData[section]) {
      return formData[section][fieldName];
    }

    return formData[fieldName];
  }

  /**
   * Установить ошибку
   */
  function setError(
    section: string | undefined,
    field: string,
    message: string
  ) {
    const key = section ?? "global";
    if (!errors[key]) errors[key] = {};
    errors[key][field] = message;
  }

  /**
   * Очистить ошибку
   */
  function clearError(section: string | undefined, field: string) {
    const key = section ?? "global";
    if (errors[key]) errors[key][field] = "";
  }

  /**
   * Валидация одного поля
   */
  function validateField(fieldName: string, section?: string): boolean {
    if (section === "employees") section = "peoples";
    const rule = section ? sectionRules[section]?.[fieldName] : null;
    const value = getFieldValue(fieldName, section);

    clearError(section, fieldName);

    // если нет правил — поле валидно
    if (!rule) return true;

    // --- REQUIRED ---
    if (rule.required) {
      if (isEmpty(value)) {
        setError(section, fieldName, "Заполните поле");
        return false;
      }
    }

    // --- NUMBER ---
    if (rule.type === "number" && !isEmpty(value)) {
      if (isNaN(Number(value))) {
        setError(section, fieldName, "Введите числовое значение");
        return false;
      }
      if (Number(value) < 0) {
        setError(section, fieldName, "Значение не может быть отрицательным");
        return false;
      }
    }

    // --- DATE ---
    if (rule.type === "date" && !isEmpty(value)) {
      if (isNaN(Date.parse(value))) {
        setError(section, fieldName, "Некорректная дата");
        return false;
      }
    }

    // --- BOOLEAN ---
    if (rule.type === "boolean") {
      if (typeof value !== "boolean") {
        setError(section, fieldName, "Выберите значение");
        return false;
      }
    }

    return true;
  }

  /**
   * Полная проверка формы
   */
  function validateForm(fields: any, sectionName?: string) {
    console.debug("incoming fields:", fields, "section:", sectionName);

    const fieldList: string[] = Array.isArray(fields)
      ? fields
      : Object.values(fields);

    let valid = true;

    for (const fieldName of fieldList) {
      console.debug(fieldName, sectionName);
      if (sectionName === "employees" && employeesFields.includes(fieldName)) {
        sectionName = "employees";
        console.debug("YEAaaaaaaaaaaaaaaaaaaah");
      } else if (
        sectionName === "employees" &&
        !employeesFields.includes(fieldName)
      ) {
        sectionName = "peoples";
      } else {
        sectionName = sectionName;
      }

      if (!validateField(fieldName, sectionName)) {
        valid = false;
      }
    }

    return valid;
  }

  /**
   * Срабатывает при вводе — повторная проверка если была ошибка
   */
  function handleInput(fieldName: string, section?: string) {
    const key = section ?? "global";
    const hasError = errors[key]?.[fieldName];

    if (hasError) {
      validateField(fieldName, section);
    }

    const value = getFieldValue(fieldName, section);

    // авто-очистка ошибок для особых случаев
    if (specialRootFields.includes(fieldName) && value) {
      clearError(section, fieldName);
    }
    if (fieldName.endsWith("Id") && value) {
      clearError(section, fieldName);
    }
    if (fieldName === "specificationImage" && value?.length > 0) {
      clearError(section, fieldName);
    }
  }

  return {
    errors,
    validateField,
    validateForm,
    handleInput,
  };
}
