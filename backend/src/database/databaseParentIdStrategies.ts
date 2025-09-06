import { DataSource } from 'typeorm';

export const databaseParentIdStrategies = {
  organizations: {
    // Для организаций parentId — это id типа организации, label — название типа
    label: (row: any) => row.organizationType?.title || `ID: ${row.organizationTypeId}`,
  },
};