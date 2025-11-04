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
  function validateField(fieldName: string, section?: string): boolean {
    const value = getFieldValue(fieldName, section);
    errors[fieldName] = "";

    switch (fieldName) {
      /** --- Числовые поля --- */
      case "price":
      // case "standId":
      case "licenseTypeId":
      case "totalAmount":
      case "width":
      case "height":
      case "thickness":
      case "weightNetto":
      case "weightBrutto":
      case "weight":
      case "manufactureTime":
      case "standTypeId":
      case "employeeId":
      case "order":
      case "componentOutCount":
      case "professionId":
      case "componentId":
      case "placementTypeId":
      case "placementId":
      case "componentCount":
      case "billId":
      case "supplierId":
      case "factoryId":
      case "inventarizationQuality":
      case "rating":
      case "organizationTypeId":
      case "contactPeopleId":
      case "orderRequestId":
      case "employeeCreatorId":
      // Добавленные поля из DTO
      case "count":
      case "pcbId":
      case "pcbManufacturerId":
      case "pcbOrderStatusId":
      case "writeoffReasonId":
      case "componentCount": // StandTasksComponentsDTO
      case "standTaskId":
      case "shipmentId":
      case "employeeId": // уже был, но оставляем
      // Новые поля из добавленных DTO
      case "stateId":
      case "currentTaskId":
      case "componentId": // уже был, но оставляем
        if (value === undefined || value === null || value === "") {
          errors[fieldName] = "Заполните поле";
        } else if (isNaN(Number(value))) {
          errors[fieldName] = "Введите числовое значение";
        } else if (Number(value) < 0) {
          errors[fieldName] = "Значение не может быть отрицательным";
        }
        break;

      /** --- Строковые поля --- */
      case "licenseCode":
      case "numberBill":
      case "numberInvoice":
      case "title":
      case "vendorCode":
      case "building":
      case "room":
      case "material":
      case "drawingReference":
      case "fullName":
      case "shortName":
      case "lawAddress":
      case "factAddress":
      case "postAddress":
      case "inn":
      case "kpp":
      case "orgn":
      case "phone":
      case "email":
      // Добавленные поля из DTO
      case "billNumber":
      case "article":
      case "userName":
      case "password":
      case "firstName":
      case "lastName":
      // Новые поля из добавленных DTO
      case "title": // ShipmentPackageStatesDTO и PCBSDTO (уже был, но оставляем)
        if (!value || String(value).trim() === "") {
          errors[fieldName] = "Заполните поле";
        }
        break;

      /** --- Фото и файлы --- */
      case "photo":
      case "specificationImage":
      case "scanPhoto":
      case "image":
        if (!value || (Array.isArray(value) && value.length === 0)) {
          errors[fieldName] = "Добавьте хотя бы один файл";
        }
        break;

      /** --- Комментарий --- */
      // case "comment":
      //   if (!value) {
      //     errors[fieldName] = "Заполните поле";
      //   } else if (String(value).length > 256) {
      //     errors[fieldName] =
      //       "Длина комментария не может превышать 256 символов";
      //   }
      //   break;

      /** --- Ссылки --- */
      case "link":
        if (value && !/^https?:\/\/.+/i.test(value)) {
          errors[fieldName] = "Введите корректную ссылку (http или https)";
        }
        break;

      /** --- Даты --- */
      case "addedDate":
      case "shipmentDate":
      case "arrivalDate":
      case "date":
      case "expectedSupplyDate":
      case "receiptDate":
      case "dateTimeToWarehouse":
      case "inventarizationDate":
      case "orgnDate":
      case "requestDatetime":
      case "executionDatetime":
      // Добавленные поля из DTO
      case "orderDate":
      case "datetime":
      case "birthDate":
      case "tripStartDate":
      case "tripEndDate":
      // Новые поля из добавленных DTO
      case "dateTime": // ServerWriteoffDTO и ServerArrivalsDTO
        if (!value) {
          errors[fieldName] = "Заполните дату";
        } else if (isNaN(Date.parse(value))) {
          errors[fieldName] = "Некорректная дата";
        }
        break;

      /** --- Булевы поля --- */
      case "vat":
      case "isCompleted":
      case "digitalDocs":
        if (typeof value !== "boolean") {
          errors[fieldName] = "Выберите значение (Да / Нет)";
        }
        break;

      /** --- Селекты (ID-ссылки) --- */
      case "licenseId":
      case "factoryId":
      case "transporterId":
      case "clientId":
      case "supplierId":
      case "placementId":
      case "componentId":
      case "organizationTypeId":
      case "contactPeopleId":
      case "orderRequestId":
      // case "standId":
      // Добавленные поля из DTO
      case "pcbId":
      case "pcbManufacturerId":
      case "pcbOrderStatusId":
      case "writeoffReasonId":
      case "standTaskId":
      case "shipmentId":
      case "employeeId": // уже был, но оставляем
      // Новые поля из добавленных DTO
      case "stateId":
      case "currentTaskId":
      case "componentId": // уже был, но оставляем
      // case "standId": // уже был, но оставляем
      case "factoryId": // уже был, но оставляем
        if (!value) {
          errors[fieldName] = "Выберите значение";
        }
        break;

      /** --- Особые случаи --- */
      // Для ShipmentPackageDTO - числовые поля, но хранятся как string в DTO
      case "width":
      case "height":
      case "thickness":
      case "weight":
        if (value === undefined || value === null || value === "") {
          errors[fieldName] = "Заполните поле";
        } else if (isNaN(Number(value))) {
          errors[fieldName] = "Введите числовое значение";
        } else if (Number(value) < 0) {
          errors[fieldName] = "Значение не может быть отрицательным";
        }
        break;

      // Для ServerWriteoffDTO - componentCount как string
      case "componentCount":
        if (value === undefined || value === null || value === "") {
          errors[fieldName] = "Заполните поле";
        } else if (isNaN(Number(value))) {
          errors[fieldName] = "Введите числовое значение";
        } else if (Number(value) < 0) {
          errors[fieldName] = "Значение не может быть отрицательным";
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
