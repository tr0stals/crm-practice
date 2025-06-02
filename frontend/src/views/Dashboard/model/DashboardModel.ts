import { getAttr } from "@/shared/utils/getAttr";

export class DashboardModel {
  attrs = {
    sectionData: "[data-js-section-data]",
  };

  constructor() {
    this.#bindEvents();
  }

  #bindEvents() {
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const tr = target.closest("tr");

      if (tr) {
        const attr = getAttr(this.attrs.sectionData).toString();
        const key = JSON.parse(tr.getAttribute(attr));
        console.debug(key);
      }
    });
  }
}
