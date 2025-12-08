import { useAuthorizedUserStore } from "@/entities/AuthorizedUserEntity/model/store";
import { getDataAsync } from "@/shared/api/getDataAsync";

/**
 * Функция стала бесполезной, так как профессии сотрудника ищутся по user/getAllByEmployeeId
 * @param user
 * @returns
 */
export async function getUserProfession(user: any) {
  const employeeProfessions = await getDataAsync({
    endpoint: `employees_professions/getAllByEmployeeId/${user.employees?.id}`,
  });

  console.debug(employeeProfessions.data);
  const profession: any[] = [];

  employeeProfessions.data.forEach((item: any) =>
    profession.push(item.professions)
  );

  return profession;
}
