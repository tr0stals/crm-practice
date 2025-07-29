import { useNavigationStore } from "@/entities/NavigationEntity/model/store";

type SectionEmit = (e: "select-section", value: string) => void;

export function useSectionSelect() {
  const navigationStore = useNavigationStore();

  const handleSelect = (section: string) => {
    navigationStore.setCurrentSection(section);
  };

  return { handleSelect };
}
