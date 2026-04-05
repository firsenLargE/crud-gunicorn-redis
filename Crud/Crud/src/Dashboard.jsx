import React, { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import WelcomeMessage from "./WelcomeMsg";

const CrudTable = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({title: "", description:""});
  const [editing, setEditing] = useState(false);

const [user, setUser] = useState({ 
    username: localStorage.getItem("username") || "Guest" 
  });


  const initialFetch = () => { 
    axiosInstance.get("/tasks/", {
      headers: {
        "Authorization": `Token ${localStorage.getItem("access_token")}`
      }
    }).then((response) => {
      setTasks(response.data);
      console.log("Fetched tasks:", response.data);
    }).catch((error) => {
      console.error("Error fetching tasks:", error);
    });
  }  

// ✅ Now useEffect can safely call it
useEffect(() => {
  initialFetch();
}, []);




  

 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    axiosInstance.post("/tasks/", formData, {
      headers: {
      "Authorization": `Token ${localStorage.getItem("access_token")}`
    }}).then((response) => { 
      setTasks([...tasks, response.data]);
      setFormData({ title: "", description: "" });
      console.log("Task created:", response.data);
    })
  };

const [editingId, setEditingId] = useState(null);


const handleEdit = (id) => {
  const task = tasks.find((t) => t.id === id);
  setEditing(true);
  setEditingId(id);
  setFormData({ title: task.title, description: task.description });
};


const handleUpdate = () => {
  axiosInstance
    .put(`/tasks/${editingId}/`, formData, {
      headers: { Authorization: `Token ${localStorage.getItem("access_token")}` },
    })
    .then((response) => {
      setTasks(tasks.map((t) => (t.id === editingId ? response.data : t)));
      setFormData({ title: "", description: "" });
      setEditing(false);
      setEditingId(null);
      console.log("Task updated:", response.data);
    });
};

  const handleDelete = (id) => {
    axiosInstance.delete(`/tasks/${id}/`, { headers: { Authorization: `Token ${localStorage.getItem("access_token")}` } }).then((res) => { 
      setTasks(tasks.filter((t) => t.id !== id));
      console.log("Task deleted:", id);
      console.log("Current tasks after deletion:", res.data);
    })
  };

  return (
    
    <div className="p-8 max-w-4xl mx-auto">
      <WelcomeMessage username={user.username} />
      <p>{  user.username  }</p>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">CRUD Table</h2>
      
      {/* Form Section */}
      <div className="flex flex-col md:flex-row gap-3 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <input
          className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          type="text"
          name="title"
          placeholder="title"
          value={formData.title}
          onChange={handleChange}
        />
        <input
          className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        {editing ? (
          <button 
            onClick={handleUpdate}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded font-medium transition-colors"
          >
            Update
          </button>
        ) : (
          <button 
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors"
          >
            Add
          </button>
        )}
      </div>

      {/* Table Section */}
      <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
        <table className="w-full text-left border-collapse bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 border-b">Title</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 border-b">Description</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-800">{task.title}</td>
                <td className="px-6 py-4 text-gray-600">{task.description}</td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button 
                    onClick={() => handleEdit(task.id)}
                    className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded hover:bg-blue-50"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(task.id)}
                    className="text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CrudTable;