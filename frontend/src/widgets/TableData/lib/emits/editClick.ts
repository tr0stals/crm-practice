export const editClick = (
  emit: (e: "edit-click", payload: any) => void,
  item: any
) => {
  emit("edit-click", item);
};
