import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DrawingList from '../components/DrawingList';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingSpin from '../components/LoadingSpin.jsx';
import { deleteDrawingById, fetchDrawings } from '../utils/api.js';

const AllDrawings = () => {
    const [drawings, setDrawings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDrawings = async () => {
            try {
                const data = await fetchDrawings();
                setDrawings(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadDrawings();
    }, []);

    const deleteDrawing = async (id) => {
        if (window.confirm('Are you sure you want to delete this drawing?')) {
            try {
                await deleteDrawingById(id);
                setDrawings(drawings.filter(drawing => drawing._id !== id));
            } catch (error) {
                console.error('Error deleting drawing:', error);
                setError('Failed to delete drawing.');
            }
        }
    };

    if (loading) {
        return <LoadingSpin />;
    }

    if (error) {
        return <ErrorMessage error={error} />;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <nav className="bg-white shadow-md px-6 py-4 flex items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                    QuickSketch
                </h1>
                <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                    Beta
                </span>
            </nav>

            <main className="container mx-auto py-8 flex-1">
                <h1 className="text-3xl font-bold mb-6">All Drawings</h1>

                {drawings.length > 0 ? (
                    <DrawingList drawings={drawings} onDelete={deleteDrawing} />
                ) : (
                    <p>No drawings available</p>
                )}

                <Link to="/new-drawing">
                    <button className="my-8 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                        New Drawing
                    </button>
                </Link>
            </main>

            <footer className="text-center text-[10px] text-black-900 pb-0.1">
                Designed and Developed By Ashwin Dumane
            </footer>
        </div>
    );
};

export default AllDrawings;