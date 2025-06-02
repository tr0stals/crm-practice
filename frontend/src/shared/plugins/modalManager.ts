import { createApp } from "vue";

export class ModalManager {
  static instance: any;
  #appInstance: any;

  config: any;

  constructor(config = {}) {
    this.config = config;
    ModalManager.instance = this;
    this.bindEvents();
  }

  private bindEvents() {
    document.addEventListener("click", (e: any) => {
      /* Закрытие модального окна при клике на крестик */
      const parent = e.target.closest("#closeIcon");

      if (parent) {
        this.closeModal();
      }
    });
  }

  open(component: string, props: any | undefined, options = {}) {
    this.createModalInstance(component, props);
  }

  /**
   * Создание модального окна в DOM-дереве
   * @param component - компонент, который будет отрисовываться при открытии модального окна
   */
  private createModalInstance(component: any, props: any | undefined) {
    const modalInstanceNode = document.createElement("div");
    modalInstanceNode.setAttribute("id", "modalInstance");
    modalInstanceNode.classList.add("modalInstance");

    this.#appInstance = createApp(component, props);
    this.#appInstance.mount(modalInstanceNode);

    document.querySelector("body")?.appendChild(modalInstanceNode);
    document.querySelector("body")?.classList.add("modal-active");
  }

  /**
   * Закрытие модального окна
   */
  closeModal() {
    document.querySelector("#modalInstance")?.remove();
    document.querySelector("body")?.classList.remove("modal-active");
  }

  static getInstance(config = {}) {
    if (!ModalManager.instance) {
      ModalManager.instance = new ModalManager(config);
    }
    return ModalManager.instance;
  }
}
