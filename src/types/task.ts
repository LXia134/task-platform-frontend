export type TaskStatus = "Pending" | "In Progress" | "Completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
export interface TaskHistory {
    oldStatus: string;
    newStatus: string;
    changedAt: string;
    changeReason?: string;
  }
  