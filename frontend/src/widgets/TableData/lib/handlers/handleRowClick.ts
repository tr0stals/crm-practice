import { editClick } from "../emits/editClick";

export const handleRowClick = (
  emit: (e: "edit-click", payload: any) => void,
  item: any
) => {
  editClick(emit, item);
};
