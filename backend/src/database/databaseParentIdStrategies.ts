import { PcbsCategories } from 'src/pcbs_categories/pcbs_categories.entity';
import { ComponentsCategories } from 'src/components_categories/components_categories.entity';
import { DataSource } from 'typeorm';

export const databaseParentIdStrategies = {
  components: {
    // Для компонентов parentId — это id подкатегории, label — название подкатегории
    label: async (dataSource: DataSource, id: number) => {
      const repo = dataSource.getRepository(ComponentsCategories);
      const cats = await repo.find({ relations: ['subcategories'] });
      for (const cat of cats) {
        const found = (cat.subcategories || []).find((s) => s.id === id);
        if (found) return found.name;
      }
      return `ID: ${id}`;
    },
    // Для выпадающего списка нужны все подкатегории
    options: async (
      dataSource: DataSource,
    ): Promise<Array<{ id: number; label: string }>> => {
      const opts: Array<{ id: number; label: string }> = [];
      const cats = await dataSource
        .getRepository(ComponentsCategories)
        .find({ relations: ['subcategories'] });
      for (const cat of cats) {
        for (const sub of cat.subcategories || []) {
          opts.push({ id: sub.id, label: sub.name });
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
    label: async (dataSource: DataSource, id: number) => {
      const cats = await dataSource
        .getRepository(PcbsCategories)
        .find({ relations: ['subcategories'] });
      for (const cat of cats) {
        const found = (cat.subcategories || []).find((s) => s.id === id);
        if (found) return found.name;
      }
      return `ID: ${id}`;
    },
    options: async (
      dataSource: DataSource,
    ): Promise<Array<{ id: number; label: string }>> => {
      const opts: Array<{ id: number; label: string }> = [];
      const cats = await dataSource
        .getRepository(PcbsCategories)
        .find({ relations: ['subcategories'] });
      for (const cat of cats) {
        for (const sub of cat.subcategories || []) {
          opts.push({ id: sub.id, label: sub.name });
        }
      }
      return opts;
    },
  },
};