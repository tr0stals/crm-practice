import { ModalManager } from "@/shared/plugins/modalManager";
import { getAttr } from "@/shared/utils/getAttr";
import { updateAsync } from "../api/updateAsync";
import { api } from "@/shared/api/axiosInstance";

export class EditModalWindowModel {
  private endpoint: string;
  private data: any;
  private cb: () => void;
  private uploadedImage: any | null;

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

  public setUploadedImage(image: any) {
    this.uploadedImage = image;
  }

  private async uploadOrUpdateImage(type: "organization_types" | "components") {
    if (!this.uploadedImage) return;

    const formData = new FormData();
    formData.append("file", this.uploadedImage);
    formData.append("targetType", type); // универсально
    formData.append("targetId", this.data.id);

    const res = await api.get(`/images/byTarget/${type}/${this.data.id}`);
    const images = res.data;

    if (!images || images.length === 0) {
      await api.post(`/images/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      await api.patch(`/images/${images[0].id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
  }

  async #onClick(e: Event) {
    const target = e.target as HTMLElement;

    if (target === document.querySelector(this.attrs.applyBtn)) {
      const attr = getAttr(this.attrs.applyBtn).toString();
      const key = JSON.parse(target.getAttribute(attr) || "{}");

      this.endpoint = key.sectionName;
      this.data = key.formData;

      if (this.endpoint === "organization_types") {
        await this.uploadOrUpdateImage("organization_types");
      }

      if (this.endpoint === "components") {
        await this.uploadOrUpdateImage("components");
      }

      if (this.endpoint !== "employees") {
        await this.applyData()
          .then((res) => {
            if (res?.status === 200) {
              this.cb();
              ModalManager.getInstance().closeModal();
            }
          })
          .catch((e) => console.error("Error!", e));
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
