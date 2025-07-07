import { getDataAsync } from "../api/getDataAsync";

const localizationResponse = await getDataAsync({
  endpoint: "localization/tables",
});

export const localizatedSectionsList = Object.fromEntries(
  Object.entries(localizationResponse.data)
);
