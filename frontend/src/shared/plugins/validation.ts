import { reactive } from "vue";

export type ValidationErrors = Record<string, string>;

export function useFormValidation(formData: any) {
  const errors = reactive<ValidationErrors>({});

  const fieldExtensions = [
    "addedDate",
    "shipmentDate",
    "arrivalDate",
    "specificationImage",
  ];

  /** Получаем значение поля, включая вложенные секции */
  function getFieldValue(fieldName: string, section?: string) {
    if (fieldExtensions.includes(fieldName)) {
      return formData[fieldName];
    }
    if (section && formData[section]) {
      return formData[section][fieldName];
    }
    return formData[fieldName];
  }

  /** Проверка конкретного поля */
  /** Проверка конкретного поля */
  function validateField(fieldName: string, section?: string): boolean {
    const value = getFieldValue(fieldName, section);
    errors[fieldName] = "";

    switch (fieldName) {
      /** --- Числовые поля --- */
      case "price":
      case "places":
      case "standId":
      case "licenseTypeId":
      case "totalAmount":
        if (value === undefined || value === null || value === "") {
          errors[fieldName] = "Заполните поле";
        } else if (isNaN(Number(value))) {
          errors[fieldName] = "Введите числовое значение";
        }
        break;

      /** --- Строковые поля --- */
      case "licenseCode":
      case "timeout":
      case "numberBill":
        if (!value || String(value).trim() === "") {
          errors[fieldName] = "Заполните поле";
        }
        break;

      case "comment":
        if (!value) {
          errors[fieldName] = "Заполните поле";
        } else if (String(value).length > 256) {
          errors[fieldName] =
            "Длина комментария не может превышать 256 символов";
        }
        break;

      case "link":
        if (value && !/^https?:\/\/.+/i.test(value)) {
          errors[fieldName] = "Введите корректную ссылку (http или https)";
        }
        break;

      /** --- Даты --- */
      case "start":
      case "end":
      case "addedDate":
      case "shipmentDate":
      case "arrivalDate":
      case "date":
      case "expectedSupplyDate":
        if (!value) {
          errors[fieldName] = "Заполните дату";
        } else if (isNaN(Date.parse(value))) {
          errors[fieldName] = "Некорректная дата";
        }
        break;

      /** --- Файлы --- */
      case "specificationImage":
      case "scanPhoto":
        if (!value || (Array.isArray(value) && value.length === 0)) {
          errors[fieldName] = "Добавьте хотя бы один файл";
        }
        break;

      /** --- Булевы поля --- */
      case "vat":
        if (typeof value !== "boolean") {
          errors[fieldName] = "Выберите значение (Да / Нет)";
        }
        break;

      /** --- Селекты (ID-ссылки) --- */
      case "licenseId":
      case "factoryId":
      case "transporterId":
      case "clientId":
      case "standId":
      case "supplierId":
        if (!value) {
          errors[fieldName] = "Выберите значение";
        }
        break;
    }

    return !errors[fieldName];
  }

  /** Полная проверка всей формы */
  function validateForm(fields: any[]) {
    let valid = true;
    for (const field of fields) {
      const ok = validateField(field, field.section);
      if (!ok) valid = false;
    }
    return valid;
  }

  /**
   * Вызывается при изменении значения поля.
   * Если ошибка уже была — перепроверяем.
   * Если значение теперь валидное — ошибка очищается.
   */
  function handleInput(fieldName: string, section?: string) {
    // если для поля уже есть ошибка — проверяем снова
    if (errors[fieldName]) {
      const wasError = !!errors[fieldName];
      const stillInvalid = !validateField(fieldName, section);

      // если теперь поле валидно — очищаем ошибку
      if (wasError && !stillInvalid) {
        errors[fieldName] = "";
      }
    }

    // 🔥 Дополнительно: для дат и файлов — автоочистка ошибки при появлении значения
    const value = getFieldValue(fieldName, section);
    if (
      ["addedDate", "shipmentDate", "arrivalDate"].includes(fieldName) &&
      value
    ) {
      errors[fieldName] = "";
    }

    if (fieldName.endsWith("Id") && value) {
      errors[fieldName] = "";
    }

    if (fieldName === "specificationImage" && value?.length > 0) {
      errors[fieldName] = "";
    }
  }

  return {
    errors,
    validateForm,
    handleInput,
  };
}
