import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DrawingBoard from '../components/DrawingBoard';
import LoadingSpin from '../components/LoadingSpin';
import { getDrawingById, updateDrawingById } from '../utils/api';

const UpdateDrawing = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [drawing, setDrawing] = useState(null);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const fetchDrawing = async () => {
            try {
                const data = await getDrawingById(id);
                setDrawing(data);
                setTitle(data.title);
            } catch (error) {
                console.error('Error fetching drawing:', error);
            }
        };

        fetchDrawing();
    }, [id]);

    const handleUpdate = async () => {
        // Show a confirmation alert before proceeding with the update
        const isConfirmed = window.confirm('Are you sure you want to update this drawing?');

        if (isConfirmed) {
            try {
                // Proceed with updating the drawing if the user confirms
                await updateDrawingById(id, { title, drawingData: drawing.drawingData });
                alert('Drawing updated successfully!');
                navigate(`/`);  // Redirect to the drawing details page
            } catch (error) {
                console.error('Error updating drawing:', error);
            }
        } else {
            alert('Update cancelled');
        }
    };

    if (!drawing) {
        return <LoadingSpin />
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4">Update Drawing</h1>
            <label className="block mb-4">
                <span className="text-gray-700 font-semibold text-xl">Drawing Title: </span>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter text and touch the canvas to add"
                    className="border p-2 rounded w-full max-w-xs"
                />
            </label>
            <DrawingBoard initialData={drawing} />
            <button
                onClick={handleUpdate}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
                Update Drawing
            </button>
        </div>
    );
};

export default UpdateDrawing;
