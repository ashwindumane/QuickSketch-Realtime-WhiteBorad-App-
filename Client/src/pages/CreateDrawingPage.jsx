import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DrawingBoard from '../components/DrawingBoard'; // Assuming you have the DrawingBoard component
import { createDrawing } from '../utils/api'; // Import the createDrawing API function

const CreateDrawingPage = () => {
    const [title, setTitle] = useState(''); // State for the drawing title
    const [drawingData, setDrawingData] = useState(null); // State for the drawing data
    const navigate = useNavigate();

    // Callback function to capture drawing data from DrawingBoard
    const handleDrawingChange = (data) => {
        // Add createdAt and updatedAt when drawing data is received
        const timestampedData = {
            ...data,
            createdAt: new Date().toLocaleString(), // Set the createdAt timestamp
            updatedAt: new Date().toLocaleString(), // Set the updatedAt timestamp
        };
        // console.log("timestampedData=>", timestampedData);
        setDrawingData(timestampedData); // Set the drawing data with timestamps
    };


    const handleCreateDrawing = async (e) => {
        e.preventDefault();

        const newDrawing = {
            title,
            ...drawingData, // Include the drawing data with timestamps
        };

        try {
            await createDrawing(newDrawing); // API call to create a new drawing
            alert('Drawing created successfully');
            navigate('/'); // Redirect to homepage after successful creation
        } catch (error) {
            console.error('Error creating drawing:', error);
            alert('Failed to create drawing');
        }
    };

    return (
        <div className="container mx-auto py-4 px-4">
            <h1 className="text-center text-2xl mb-6">Create a New Drawing</h1>

            {/* Drawing Title Input */}
            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                    Drawing Title:
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter drawing title"
                    className="border rounded px-4 py-2 w-full"
                />
            </div>

            {/* Drawing Board Component */}
            <div className="mb-4">
                <DrawingBoard onDrawingChange={handleDrawingChange} />
            </div>

            {/* Create Button */}
            <div className="text-center">
                <button
                    onClick={handleCreateDrawing}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Create Drawing
                </button>
            </div>
        </div>
    );
};

export default CreateDrawingPage;
