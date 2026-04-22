import React, { useState,useEffect } from "react";
import axiosInstance from "./axiosInstance";
const Categories = () => { 
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ name: "" })
    const [editingId,setEditingId] = useState(null);
    const [categories,setCategories] = useState([]);
    const handleCreate = () => {
        axiosInstance.post("/categories/", formData, {
            headers: {
                Authorization: `Token ${localStorage.getItem("access_token")}`
            }
        }).then((response) => { 
              console.log("Category created:", response.data);
        }).catch((error) => {
              console.error("Error creating category:", error);
        })
    }
    const initialFetch = () => {
        axiosInstance.get("/categories/", {
            headers: {
                Authorization: `Token ${localStorage.getItem("access_token")}`
            }
        }).then((response) => {
            console.log("Fetched categories:", response.data);
            setCategories([...categories, ...response.data]);
        }).catch((error) => {
              console.error("Error fetching categories:", error);
        })
    }
    const handleEdit = (id) => {    
        const category = categories.find((c) => c.id === id);
        setEditingId(id);
        console.log("The category is:",category)

    if (!category) {
        console.error("Category not found");
        return;
    }

    setEditing(true);
    setFormData({ name: category.name });
};
    const handleUpdate = () => {
        axiosInstance.put(`/categories/${editingId}/`, formData, {
            headers: {
            Authorization:`Token ${localStorage.getItem("access_token")}`
        }}).then((response) => { 
            setCategories(categories.map((c) => (c.id === editingId ? response.data : c)));
            setFormData({ name: "" });
            setEditing(false);
            setEditingId(null);
            console.log("Category updated:", response.data);
        })
    }
    const handleDelete = (id) => {
        axiosInstance.delete(`/categories/${id}/`, {
            headers: {
            Authorization: `Token ${localStorage.getItem("access_token")}`
            }
        }).then((response) => {
            setCategories(categories.filter((c) => c.id !== id));
            console.log("Category deleted:", response.data);
         }).catch((error) => {
            console.log(error)
         })
    }
    useEffect(() => {
        initialFetch();
    },[])
      const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
    return (
     <div className=" bg-[#445d50] w-full h-screen">
    
    <div className="p-8 max-w-7xl mx-auto">
      {/* <WelcomeMessage username={user.username} /> */}
      {/* <p className="text-[#445d50]">{  user.username  }</p> text-[#445d50] */}
      <h2 className="text-2xl font-bold mb-6 text-[#f5c9b5]">CRUD Table</h2>
      
      {/* Form Section */}
      <div className="flex flex-col md:flex-row gap-3 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <input
          className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          type="text"
          name="name"
          placeholder="Category Name"
          value={formData.name}
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
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 border-b">ID</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 border-b">NAME</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-800">{cat.id}</td>
                <td className="px-6 py-4 text-gray-600">{cat.name}</td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button 
                            className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded hover:bg-blue-50"
                            onClick={() => handleEdit(cat.id)}
                  >
                    Edit
                  </button>
                  <button 
                            className="text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded hover:bg-red-50"
                            onClick={() => handleDelete(cat.id)}
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
      </div>
    )
}
export default Categories