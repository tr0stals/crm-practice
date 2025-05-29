import { getAttr } from "@/shared/utils/getAttr";

export class EditModalWindowModel {
  attrs = {
    saveBtn: "[data-js-save-btn]",
    cancelBtn: "[data-js-cancel-btn]",
  };

  constructor() {
    this.#bindEvents();
  }

  #bindEvents() {
    document.addEventListener("click", (e) => {
      const target = e.target;

      if (target) {
        const attr = getAttr(this.attrs.saveBtn).toString();
        const key = JSON.parse(target.getAttribute(attr));
        console.debug(key);
      }
    });
  }
}
