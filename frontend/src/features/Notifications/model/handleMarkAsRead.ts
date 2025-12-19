import { markNotificationAsRead } from "./markNotificationAsRead";

export async function handleMarkAsRead(
  notificationId: number,
  userId: number,
  onSuccessCb: () => void
) {
  await markNotificationAsRead(notificationId, userId);

  onSuccessCb();
}
