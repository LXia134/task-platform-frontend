"use client";

import { useState, useEffect } from "react";
import { deleteTask, fetchTasks, fetchTaskHistory, updateTask } from "../api/tasks";
import { Task } from "../types/task";

interface TaskListProps {
  refreshTasks: () => Promise<void>;
}

const TaskList: React.FC<TaskListProps> = ({ refreshTasks }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskHistories, setTaskHistories] = useState<{ [key: string]: any[] }>({});
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ title: string; description: string; status: string }>({
    title: "",
    description: "",
    status: "Pending",
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(5); // Items per page
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const loadTasks = async () => {
    try {
      console.log("Fetching tasks with filters:", { page, statusFilter, searchQuery }); 
      const filter = statusFilter ?? undefined;
      const query = searchQuery.trim() === "" ? undefined : searchQuery; 
      const response = await fetchTasks(page, limit, "createdAt", "ASC", filter, query);
      console.log("Fetched tasks:", response); 
      setTasks(response.tasks);
      setTotalPages(Math.ceil(response.total / limit));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    loadTasks();  
  }, [page, statusFilter, searchQuery]);

  const loadTaskHistory = async (taskId: string) => {
    const historyData = await fetchTaskHistory(taskId);
    setTaskHistories((prev) => ({ ...prev, [taskId]: historyData }));
  };

  const toggleHistory = async (taskId: string) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
      return;
    }
    await loadTaskHistory(taskId);
    setExpandedTaskId(taskId);
  };

  const startEditing = (task: Task) => {
    setIsEditing(task.id);
    setEditValues({ title: task.title, description: task.description || "", status: task.status });
  };

  const saveEdit = async (id: string) => {
    await updateTask(id, editValues);
    setIsEditing(null);
    await refreshTasks(); 
    if (expandedTaskId === id) {
      await loadTaskHistory(id);
    }
  };

  // Delete a task
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(id);
      await refreshTasks(); 
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>

      {}
      <select
        value={statusFilter || ""}
        onChange={(e) => setStatusFilter(e.target.value || null)}
        className="p-2 border rounded mb-4"
      >
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      {}
      <input
        type="text"
        placeholder="Search tasks by title or description..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 border rounded mb-4"
      />

      <ul>
        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          tasks.map((task) => (
            <li key={task.id} className="border p-4 mb-2 rounded-lg shadow flex flex-col">
              {isEditing === task.id ? (
                <div className="w-full">
                  <input
                    type="text"
                    value={editValues.title}
                    onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <textarea
                    value={editValues.description}
                    onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <select
                    value={editValues.status}
                    onChange={(e) => setEditValues({ ...editValues, status: e.target.value })}
                    className="w-full p-2 mb-2 border rounded"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <button onClick={() => saveEdit(task.id)} className="bg-green-500 text-white p-2 rounded mr-2">
                    Save
                  </button>
                  <button onClick={() => setIsEditing(null)} className="bg-gray-500 text-white p-2 rounded">
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between w-full">
                    <div>
                      <strong>{task.title}</strong> - {task.status}
                      <p>{task.description}</p> {}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => toggleHistory(task.id)} className="text-blue-500">
                        View History
                      </button>
                      <button onClick={() => startEditing(task)} className="text-yellow-500">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(task.id)} className="text-red-600">
                        Delete
                      </button>
                    </div>
                  </div>

                  {}
                  {expandedTaskId === task.id && (
                    <div className="mt-2 p-2 border-t w-full">
                      <h3 className="text-sm font-bold">Task History:</h3>
                      {taskHistories[task.id]?.length ? (
                        <ul className="text-sm">
                          {taskHistories[task.id].map((entry, index) => (
                            <li key={index} className="border-b py-1">
                              <span className="font-semibold">Old:</span> {entry.oldStatus} → <span className="font-semibold">New:</span> {entry.newStatus}
                              {entry.changeReason && <p><span className="font-semibold">Reason:</span> {entry.changeReason}</p>}
                              <p className="text-xs text-gray-500">{new Date(entry.changedAt).toLocaleString()}</p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No history available.</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </li>
          ))
        )}
      </ul>
        {/* Pagination Controls */}
        {tasks.length > 0 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`p-2 mx-1 border rounded ${page === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
          >
            Previous
          </button>
          <span className="p-2">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page >= totalPages}
            className={`p-2 mx-1 border rounded ${page >= totalPages ? "bg-gray-300" : "bg-blue-500 text-white"}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
