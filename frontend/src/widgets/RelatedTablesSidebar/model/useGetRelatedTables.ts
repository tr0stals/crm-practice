import { defaultEndpoint } from "@/shared/api/axiosInstance";
import useFetch from "@/shared/lib/useFetch";
import { watchEffect, type Ref } from "vue";

export function useGetRelatedTables(sectionName: string) {
  const { abort, canAbort, data, error, loading, refetch } = useFetch<any>(
    `${defaultEndpoint}/database/${sectionName}/relations`,
    {
      immediate: true,
      timeout: 3000,
    }
  );

  return {
    data,
    loading,
    refetch,
    abort,
  };
}
