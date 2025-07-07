import { createApp } from "vue";
import BillsMoreDetails from "../ui/BillsMoreDetails.vue";
import { getDataAsync } from "@/shared/api/getDataAsync";
import ArrivalInvoicesMoreDetails from "../ui/ArrivalInvoicesMoreDetails.vue";

/**
 * Класс для создания виджета для просмотра подробной информации о записи.
 */
export class MoreDetailsCollapseModel {
  private selectedRow: any;
  public get SelectedRow(): any {
    return this.selectedRow;
  }

  private currentSection: string;
  public get CurrentSection(): string {
    return this.currentSection;
  }

  #moreDetailsInstance: any;
  private static instance: any;

  private attrs = {
    contentSection: "[data-js-content-section]",
    closeIcon: "[data-js-close-icon]",
  };

  /**
   *
   * @param selectedRow - выбранная строка
   * @param currentSection - секция таблицы, в которой находятся интересующие записи
   */
  constructor({
    selectedRow,
    currentSection,
  }: {
    selectedRow: string;
    currentSection: string;
  }) {
    MoreDetailsCollapseModel.instance = this;
    this.selectedRow = selectedRow;
    this.currentSection = currentSection;

    this.#createInstance();
    this.#bindEvents();
  }

  /**
   * Выполняется API-Запрос на сервер для получения всех записей, у которых совпадают указанные поля (id)
   * @param endpoint - путь таблицы записи
   * @returns
   */
  async fetchData(endpoint: string) {
    try {
      /**
       * Пример запроса
       * `${currentSection.value}/generateData/${props.model.SelectedRow.id}`
       */
      return (await getDataAsync({ endpoint: `${endpoint}` })).data;
    } catch (e) {
      throw new Error(
        "Ошибка при запросе на сервер MoreDetailsCollapseModel.fetchData"
      );
    }
  }

  #createInstance() {
    const moreDetailsInstance = document.createElement("div");
    moreDetailsInstance.setAttribute("id", "moreDetailsInstance");
    moreDetailsInstance.classList.add("moreDetailsInstance");

    const contentSection = document.querySelector(this.attrs.contentSection);

    if (!contentSection)
      throw new Error("Не найдена секция для отображения Collapse");

    contentSection.appendChild(moreDetailsInstance);

    switch (this.currentSection) {
      case "arrival_invoices":
        this.#moreDetailsInstance = createApp(ArrivalInvoicesMoreDetails, {
          model: this,
        });

        this.#moreDetailsInstance.mount(moreDetailsInstance);
        break;

      case "bills_for_pay":
        this.#moreDetailsInstance = createApp(BillsMoreDetails, {
          model: this,
        });

        this.#moreDetailsInstance.mount(moreDetailsInstance);
        break;
    }
  }

  closeCollapse() {
    this.#moreDetailsInstance.unmount();

    const el = document.getElementById("moreDetailsInstance");
    el?.remove();

    MoreDetailsCollapseModel.instance = null;
  }

  static getInstance({
    selectedRow,
    currentSection,
  }: {
    selectedRow: string;
    currentSection: string;
  }) {
    if (!MoreDetailsCollapseModel.instance) {
      MoreDetailsCollapseModel.instance = new MoreDetailsCollapseModel({
        selectedRow,
        currentSection,
      });
    }
    return MoreDetailsCollapseModel.instance;
  }

  #bindEvents() {
    document.addEventListener("click", (e: any) => {});
  }
}
