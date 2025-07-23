import { Link } from 'react-router-dom';

const DrawingCard = ({ drawing, onDelete }) => {
    return (
        <div className='border p-4 shadow-md mb-4'>
            <div className='mb-6'>
                <h2 className="text-xl font-semibold">{drawing.title}</h2>
                <p>{drawing.description}</p>
            </div>
            <div className="flex justify-between items-center">
                <Link to={`/drawing/${drawing._id}`} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 md:text-base sm:text-xs">
                    Details
                </Link>

                <div className="flex gap-4">
                    <Link
                        to={`/updateDrawing/${drawing._id}`}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                    >
                        Update
                    </Link>
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete this drawing?')) {
                                onDelete(drawing._id);
                            }
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const DrawingList = ({ drawings, onDelete }) => {
    return (
        <div>
            {drawings.map((drawing) => (
                <DrawingCard key={drawing._id} drawing={drawing} onDelete={onDelete} />
            ))}
        </div>
    );
};

export default DrawingList;
