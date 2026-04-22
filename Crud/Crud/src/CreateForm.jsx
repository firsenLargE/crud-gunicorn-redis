import React, { useState } from "react"
const CreateForm = ({ 
    editing=false,
}) => {

const  [formData,SetFormData] = useState({title:"", description:""})

    return (

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
    )
}

export default CreateForm