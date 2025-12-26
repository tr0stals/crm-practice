import { Transform } from 'class-transformer';

export const EmptyToNullNumber = () =>
  Transform(({ value }) => {
    if (value === '' || value === undefined || value === null) return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  });
