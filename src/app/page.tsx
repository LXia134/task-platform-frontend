"use client";

import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import { useState, useEffect } from "react";
import { fetchTasks } from "../api/tasks";
import { Task } from "../types/task";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const { tasks } = await fetchTasks();
      setTasks(tasks);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-4">Task Manager</h1>
      <TaskForm onTaskCreated={loadTasks} />
      {loading ? <p className="text-center">Loading tasks...</p> : <TaskList refreshTasks={loadTasks} />}
    </div>
  );
}
