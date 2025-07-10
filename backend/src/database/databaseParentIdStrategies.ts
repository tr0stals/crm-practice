import { PCB_CATEGORIES } from '../pcbs/pcbs_categories';
import { COMPONENT_CATEGORIES } from '../components/component_categories';

export const databaseParentIdStrategies = {
  components: {
    // Для компонентов parentId — это id подкатегории, label — название подкатегории
    label: (id: number) => {
      // Найти подкатегорию по id
      for (const cat of COMPONENT_CATEGORIES) {
        const subcat = cat.subcategories.find((s) => s.id === id);
        if (subcat) return subcat.name;
      }
      return `ID: ${id}`;
    },
    // Для выпадающего списка нужны все подкатегории
    options: (): Array<{ id: number; label: string }> => {
      const opts: Array<{ id: number; label: string }> = [];
      for (const cat of COMPONENT_CATEGORIES) {
        for (const subcat of cat.subcategories) {
          opts.push({ id: subcat.id, label: subcat.name });
        }
      }
      return opts;
    },
  },
  organizations: {
    // Для организаций parentId — это id типа организации, label — название типа
    label: (row: any) => row.organizationType?.title || `ID: ${row.organizationTypeId}`,
  },
  pcbs: {
    // parentId — это id подкатегории, label — название подкатегории
    label: (id: number) => {
      for (const cat of PCB_CATEGORIES) {
        const subcat = cat.subcategories.find((s) => s.id === id);
        if (subcat) return subcat.name;
      }
      return `ID: ${id}`;
    },
    options: (): Array<{ id: number; label: string }> => {
      const opts: Array<{ id: number; label: string }> = [];
      for (const cat of PCB_CATEGORIES) {
        for (const subcat of cat.subcategories) {
          opts.push({ id: subcat.id, label: subcat.name });
        }
      }
      return opts;
    },
  },
};