import { ref, shallowRef, onUnmounted } from "vue";

interface Options<T> {
  cacheKey?: string;
  fetcher?: (url: string) => Promise<T>;
  immediate?: boolean;
  timeout?: number;
}

/**
 *
 * @param url - endpoint, по которому должен уходить запрос на сервер
 * @param opts - настройки useFetch
 */
export default function useFetch<T = unknown>(
  url: string,
  opts: Options<T> = {}
) {
  const data = shallowRef<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref<boolean>(false);
  const controller = new AbortController();
  let timer: number | undefined;
  const token = localStorage.getItem("token");

  const fetcher =
    opts.fetcher ??
    ((url) =>
      fetch(url, {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);

        return r.json() as Promise<T>;
      }));

  const exec = async () => {
    loading.value = true;
    error.value = null;

    try {
      if (opts.timeout) {
        timer = window.setTimeout(() => controller.abort(), opts.timeout);
      }

      data.value = await fetcher(url);
    } catch (e) {
      if ((e as DOMException).name !== "AbortError") error.value = e as Error;
    } finally {
      loading.value = false;
      clearTimeout(timer);
    }
  };

  if (opts.immediate !== false) exec();
  onUnmounted(() => controller.abort());

  return {
    data,
    error,
    loading,
    refetch: exec,
    abort: () => controller.abort(),
    canAbort: () => !controller.signal.aborted,
  };
}
