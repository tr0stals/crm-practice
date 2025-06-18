import { getDataAsync } from "@/shared/api/getDataAsync";
import { ref } from "vue";

/**
 * Получение с сервера ID зареганного юзера
 */
const getUserId = async (): Promise<number> => {
  const token = localStorage.getItem("token");

  let cfg = {
    endpoint: "auth/check",
    data: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };

  return await getDataAsync(cfg)
    .then((res) => res.data.user.id)
    .catch((e) => console.error(e));
};

/**
 * Ищем информацию о зарегистрированном пользователе по токену
 */
export const getUserInfoAsync = async () => {
  const userId = ref<number>();

  await getUserId()
    .then((res) => (userId.value = res))
    .catch((e) => console.error(e));

  if (!userId.value) {
    console.error("Пользователь не найден!");
    return {};
  }

  /**
   * Возвращаем объект Peoples
   */
  return await getDataAsync({ endpoint: `user/get/${userId.value}` })
    .then((res) => {
      const user = res.data;
      if (user && user.peoples) {
        return {
          firstName: user.peoples.firstName,
          lastName: user.peoples.lastName,
        };
      }
      return {};
    })
    .catch((e) => {
      console.error(e);
      return {};
    });
};
