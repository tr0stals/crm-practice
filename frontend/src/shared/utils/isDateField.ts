export const isDateField = (key: string) => {
  const lower = key.toLowerCase();

  return (
    lower.includes("date") ||
    lower === "start" ||
    lower === "end" ||
    lower === "deadline" ||
    lower === "manufacturedate"
  );
};
