import { ModalManager } from "@/shared/plugins/modalManager";
import { getAttr } from "@/shared/utils/getAttr";
import { updateAsync } from "../api/updateAsync";

export class EditModalWindowModel {
  private endpoint: string;
  private data: any;
  private cb: () => void;

  private handleClick: (e: Event) => void;

  attrs = {
    applyBtn: "[data-js-apply-btn]",
    cancelBtn: "[data-js-cancel-btn]",
  };

  constructor(cb: () => void) {
    this.cb = cb;
    this.endpoint = "";
    this.handleClick = this.#onClick.bind(this);
    document.addEventListener("click", this.handleClick);
  }

  private async applyData() {
    if (this.data && this.endpoint) {
      return await updateAsync(this.endpoint.toLowerCase(), this.data);
    }
  }

  private async employeesUpdate() {
    const employeeData = {
      id: this.data.id,
      hiringDate: this.data.hiringDate,
      dismissalDate: this.data.dismissalDate,
    };
  }

  #onClick(e: Event) {
    const target = e.target as HTMLElement;

    if (target === document.querySelector(this.attrs.applyBtn)) {
      const attr = getAttr(this.attrs.applyBtn).toString();
      const key = JSON.parse(target.getAttribute(attr) || "{}");

      this.endpoint = key.sectionName;
      this.data = key.formData;

      if (this.endpoint !== "employees")
        this.applyData()
          .then((res) => {
            if (res?.status === 200) {
              this.cb();
              ModalManager.getInstance().closeModal();
              console.debug("this.cb()", this.cb);
            }
          })
          .catch((e) => console.error("Error!", e));
      else {
        this.employeesUpdate();
      }
    }

    if (target === document.querySelector(this.attrs.cancelBtn)) {
      ModalManager.getInstance().closeModal();
    }
  }

  public destroy() {
    ModalManager.getInstance().closeModal();
    document.removeEventListener("click", this.handleClick);
  }
}
