import { useMenuStore } from "@/entities/MenuEntity/model/menuStore";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { computed } from "vue";

export function useMenuEntity() {
  const menuEntityStore = useMenuStore();
  const navigationStore = useNavigationStore();

  // Рекурсивная функция для обхода children
  const getAllChildren = (entity: any) => {
    if (!entity.children || entity.children.length === 0) return [];

    return entity.children.map((child: any) => ({
      ...child,
      children: child.children ? getAllChildren(child) : [],
    }));
  };

  const data = computed(() => {
    navigationStore.selectedRow = null;
    const activeEntity = menuEntityStore.activeEntity;
    if (!activeEntity) return [];

    // Если есть потомки — показываем их
    if (activeEntity.children && activeEntity.children.length > 0) {
      return activeEntity.children;
    }

    // Если нет — просто переходим в таблицу
    navigationStore.setCurrentSection(activeEntity.tableName);
    return [];
  });

  const handleClick = (item: any) => {
    console.debug(item);
    /**
     * Переход в системные настройки
     */
    if (item.tableName === "system") {
      menuEntityStore.activeEntity = item;
      console.debug(menuEntityStore.activeEntity);
    }
    // Если массив children = 1, тогда сразу переходим на таблицу children[0]
    else if (item.children.length === 1) {
      navigationStore.setCurrentSection(item.children[0].tableName);
    }
    // Если есть дочерние узлы — сделать их "текущими"
    else if (item.children && item.children.length > 0) {
      menuEntityStore.activeEntity = item;
    } else {
      // Если дочерних нет — открыть таблицу
      navigationStore.setCurrentSection(item.tableName);
    }
  };

  return {
    data,
    handleClick,
  };
}
