"use client";

import { useEffect, useState } from "react";
import Modal from "react-modal";
import { fetchTaskHistory } from "../api/tasks";
import { Task } from "../types/task";

interface TaskHistoryModalProps {
  task: Task;
}

const TaskHistoryModal: React.FC<TaskHistoryModalProps> = ({ task }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<{ oldStatus: string; newStatus: string; changeReason?: string; changedAt: string }[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      Modal.setAppElement(document.body); 
    }
  }, []);

  const openModal = async () => {
    setIsOpen(true);
    const historyData = await fetchTaskHistory(task.id);
    setHistory(historyData);
  };

  const closeModal = () => setIsOpen(false);

  if (!isClient) return null; 

  return (
    <>
      <button onClick={openModal} className="text-blue-500 ml-4">View History</button>

      <Modal isOpen={isOpen} onRequestClose={closeModal} contentLabel="Task History" className="modal" overlayClassName="overlay">
        <h2 className="text-xl font-bold">Task History</h2>
        <ul className="mt-2">
          {history.length === 0 ? (
            <p>No history available.</p>
          ) : (
            history.map((entry, index) => (
              <li key={index} className="border-b py-2">
                <p><strong>Old Status:</strong> {entry.oldStatus}</p>
                <p><strong>New Status:</strong> {entry.newStatus}</p>
                {entry.changeReason && <p><strong>Reason:</strong> {entry.changeReason}</p>}
                <p className="text-sm text-gray-500">{new Date(entry.changedAt).toLocaleString()}</p>
              </li>
            ))
          )}
        </ul>
        <button onClick={closeModal} className="mt-4 bg-red-500 text-white p-2 rounded">Close</button>
      </Modal>
    </>
  );
};

export default TaskHistoryModal;
