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
      console.debug();
      console.debug("???", e.target.closest(this.attrs.saveBtn));
    });
  }
}
