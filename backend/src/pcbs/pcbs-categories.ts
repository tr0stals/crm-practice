// Пример статической структуры категорий и подкатегорий
export const PCB_CATEGORIES = [
  {
    id: 1,
    name: 'Сварочные технологии - WT',
    subcategories: [
      { id: 101, name: 'ТСВ-02 (WT02)' },
      { id: 102, name: 'ТСВ-03 (WT03)' },
      { id: 103, name: 'ТСВ-04 (WT04)' },
    ],
  },
  {
    id: 2,
    name: 'Волоконно-оптические линии связи',
    subcategories: [
      { id: 201, name: 'ВОЛС-03' },
      { id: 202, name: 'ВОЛС-04' },
    ],
  },
  {
    id: 3,
    name: 'Системы управления',
    subcategories: [
      { id: 301, name: 'СУ-01' },
      { id: 302, name: 'СУ-02' },
    ],
  },
  {
    id: 4,
    name: 'Энергоснабжение',
    subcategories: [
      { id: 401, name: 'ЭН-01' },
      { id: 402, name: 'ЭН-02' },
    ],
  },
];