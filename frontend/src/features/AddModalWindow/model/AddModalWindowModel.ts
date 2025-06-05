import { getAttr } from "@/shared/utils/getAttr";
import { createEntityAsync } from "../api/createEntityAsync";
import { ModalManager } from "@/shared/plugins/modalManager";

export class AddModalWindowModel {
  private attrs = {
    addBtn: "[data-js-add-btn]",
    cancelBtn: "[data-js-cancel-btn]",
  };

  private cb: () => {};

  private endpoint: string;

  private data: any;

  constructor(cb: () => {}) {
    this.cb = cb;
    this.endpoint = "";
    this.#bindEvents();
  }

  private async executeData() {
    if (this.endpoint && this.data) {
      return await createEntityAsync(this.endpoint, this.data);
    } else {
      throw new Error("Недостаточно данных");
    }
  }

  #bindEvents() {
    console.debug("Inited");

    document.addEventListener("click", (e: any) => {
      const target = e.target;

      if (target && target === document.querySelector(this.attrs.addBtn)) {
        const attr = getAttr(this.attrs.addBtn).toString();
        const key = JSON.parse(target.getAttribute(attr));

        this.endpoint = key.sectionName;
        this.data = key.data;

        const response = this.executeData();

        response
          .then((res) => {
            if (res?.status === 201) {
              console.debug("Success");
              ModalManager.getInstance().closeModal();
              this.cb();
            }
          })
          .catch((e) => console.error("Error!", e));
      }

      if (target && target === document.querySelector(this.attrs.cancelBtn)) {
        ModalManager.getInstance().closeModal();
      }
    });
  }
}
