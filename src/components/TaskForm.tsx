"use client";

import { useState } from "react";
import { createTask } from "../api/tasks";

const TaskForm = ({ onTaskCreated }: { onTaskCreated: () => void }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert("Title is required!");

    try {
      await createTask({ title, description });
      setTitle("");
      setDescription("");
      onTaskCreated();
    } catch (error) {
      console.error("Failed to add task", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-md">
      <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 mb-2 border rounded" />
      <textarea placeholder="Task Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 mb-2 border rounded" />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Task</button>
    </form>
  );
};

export default TaskForm;
