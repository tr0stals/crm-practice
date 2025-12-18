export interface INotification {
  id: string;
  message: string;
  type: string;
  read: boolean;
  timestamp: number;
  userId: number;
}
