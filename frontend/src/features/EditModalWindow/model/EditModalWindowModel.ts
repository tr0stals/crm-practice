import { ModalManager } from "@/shared/plugins/modalManager";
import { getAttr } from "@/shared/utils/getAttr";
import { updateAsync } from "../api/updateAsync";

export class EditModalWindowModel {
  private endpoint: string;
  private data: any;
  private cb: () => {};

  attrs = {
    applyBtn: "[data-js-apply-btn]",
    cancelBtn: "[data-js-cancel-btn]",
  };

  constructor(cb: () => {}) {
    this.cb = cb;
    this.endpoint = "";
    this.#bindEvents();
  }

  private async applyData() {
    // console.debug("!!!!!", this.endpoint, this.data);
    if (this.data && this.endpoint) {
      return await updateAsync(this.endpoint.toLowerCase(), this.data);
    }
  }

  #bindEvents() {
    document.addEventListener("click", (e: any) => {
      const target = e.target;

      /**
       * В кнопке "Сохранить" находится объект с отредактированными данными.
       * Здесь их достаем в переменную key.
       */
      if (target && target === document.querySelector(this.attrs.applyBtn)) {
        const attr = getAttr(this.attrs.applyBtn).toString();
        const key = JSON.parse(target.getAttribute(attr));
        console.debug(key);

        this.endpoint = key.sectionName;
        this.data = key.formData;

        const response = this.applyData();
        console.debug("response!!!!!", response);

        response
          .then((res) => {
            if (res?.status === 200) {
              console.debug("Success");
              ModalManager.getInstance().closeModal();
              this.cb();
            }
          })
          .catch((e) => console.error("Error!", e));
      }

      /**
       * При клике на кнопку "Отмена" модальное окно закрывается.
       */
      if (target === document.querySelector(this.attrs.cancelBtn)) {
        ModalManager.getInstance().closeModal();
      }
    });
  }
}
