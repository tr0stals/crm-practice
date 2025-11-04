import type { IExtraAttr } from "@/shared/interface/IExtraAttr";

export interface ICustomDropdown {
  text?: string;
  onClickCallback?: (value?: any) => void;
  extraAttrs?: IExtraAttr[];
  value?: any;
  component?: any;
}
