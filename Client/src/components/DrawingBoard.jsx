import React, { useEffect, useRef, useState } from 'react';

const DrawingBoard = ({ initialData, onDrawingChange }) => {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [drawMode, setDrawMode] = useState('pen'); // 'pen', 'line', 'rectangle', 'text', 'eraser'
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
    const [text, setText] = useState('');
    const [isTextMode, setIsTextMode] = useState(false);
    const [drawings, setDrawings] = useState([]);
    const [currentDrawing, setCurrentDrawing] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [lineWidth, setLineWidth] = useState(3);
    const [eraserSize, setEraserSize] = useState(10);

    // Initialize canvas and load initial data if provided
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = lineWidth;
        ctxRef.current = ctx;

        if (initialData) {
            loadInitialData(initialData);
        }
    }, []);

    const loadInitialData = (data) => {
        // Implement loading of initial data if needed
        // This would depend on how your initial data is structured
    };

    // Save canvas state to history
    const saveToHistory = () => {
        const canvas = canvasRef.current;
        const imageData = ctxRef.current.getImageData(0, 0, canvas.width, canvas.height);
        
        // If we're not at the end of history, truncate the future history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(imageData);
        
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    // Undo functionality
    const undo = () => {
        if (historyIndex <= 0) return;
        
        const newIndex = historyIndex - 1;
        ctxRef.current.putImageData(history[newIndex], 0, 0);
        setHistoryIndex(newIndex);
    };

    // Redo functionality
    const redo = () => {
        if (historyIndex >= history.length - 1) return;
        
        const newIndex = historyIndex + 1;
        ctxRef.current.putImageData(history[newIndex], 0, 0);
        setHistoryIndex(newIndex);
    };

    // Mouse event handlers
    const handleMouseDown = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        startDrawing(offsetX, offsetY);
    };

    const handleMouseMove = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        if (isDrawing && drawMode !== 'text') draw(offsetX, offsetY);
    };

    const handleMouseUp = () => {
        finishDrawing();
        setIsDrawing(false);
        saveToHistory(); // Save to history when drawing is complete
    };

    // Touch event handlers
    const handleTouchStart = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const { left, top } = canvasRef.current.getBoundingClientRect();
        startDrawing(touch.clientX - left, touch.clientY - top);
    };

    const handleTouchMove = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const { left, top } = canvasRef.current.getBoundingClientRect();
        if (isDrawing && drawMode !== 'text') draw(touch.clientX - left, touch.clientY - top);
    };

    const handleTouchEnd = () => {
        finishDrawing();
        setIsDrawing(false);
        saveToHistory(); // Save to history when drawing is complete
    };

    const startDrawing = (x, y) => {
        if (drawMode === 'text' && text.trim()) {
            addText(x, y, text);
            setText('');
            setIsTextMode(false);
            saveToHistory();
            return;
        }

        const newDrawing = {
            id: Date.now(),
            drawMode,
            createdAt: new Date().toLocaleString(),
            updatedAt: new Date().toLocaleString(),
            points: [],
        };
        setCurrentDrawing(newDrawing);
        setDrawings([...drawings, newDrawing]);

        setIsDrawing(true);
        setStartPoint({ x, y });
        
        // Set appropriate styles based on draw mode
        if (drawMode === 'eraser') {
            ctxRef.current.globalCompositeOperation = 'destination-out';
            ctxRef.current.lineWidth = eraserSize;
        } else {
            ctxRef.current.globalCompositeOperation = 'source-over';
            ctxRef.current.strokeStyle = 'black';
            ctxRef.current.lineWidth = lineWidth;
        }
        
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(x, y);
    };

    const draw = (x, y) => {
        if (!isDrawing) return;

        if (currentDrawing) {
            const updatedDrawing = {
                ...currentDrawing,
                updatedAt: new Date().toISOString(),
            };
            setCurrentDrawing(updatedDrawing);

            if (drawMode === 'pen' || drawMode === 'eraser') {
                ctxRef.current.lineTo(x, y);
                ctxRef.current.stroke();
            } else if (drawMode === 'line') {
                drawLine(startPoint.x, startPoint.y, x, y);
            } else if (drawMode === 'rectangle') {
                drawRectangle(startPoint.x, startPoint.y, x, y);
            }
        }
    };

    const finishDrawing = () => {
        if (currentDrawing) {
            const updatedDrawings = drawings.map((drawing) =>
                drawing.id === currentDrawing.id
                    ? { ...currentDrawing, updatedAt: new Date().toISOString() }
                    : drawing
            );
            setDrawings(updatedDrawings);
            setCurrentDrawing(null);
        }
        
        // Reset composite operation after eraser use
        if (drawMode === 'eraser') {
            ctxRef.current.globalCompositeOperation = 'source-over';
        }
    };

    const drawLine = (x1, y1, x2, y2) => {
        ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        redrawHistory(); // Redraw everything from history first
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(x1, y1);
        ctxRef.current.lineTo(x2, y2);
        ctxRef.current.stroke();
        ctxRef.current.closePath();
    };

    const drawRectangle = (x1, y1, x2, y2) => {
        ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        redrawHistory(); // Redraw everything from history first
        ctxRef.current.beginPath();
        ctxRef.current.rect(x1, y1, x2 - x1, y2 - y1);
        ctxRef.current.stroke();
        ctxRef.current.closePath();
    };

    // Redraw all history up to current index
    const redrawHistory = () => {
        if (historyIndex >= 0) {
            ctxRef.current.putImageData(history[historyIndex], 0, 0);
        }
    };

    const addText = (x, y, inputText) => {
        ctxRef.current.font = '20px Arial';
        ctxRef.current.fillStyle = 'black';
        ctxRef.current.fillText(inputText, x, y);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        saveToHistory(); // Save cleared state to history
    };

    return (
        <div className="container mx-auto py-4 px-4">
            <div className="flex flex-wrap items-center justify-center space-x-2 space-y-2 sm:space-y-0 mb-4">
                <button 
                    onClick={() => setDrawMode('pen')} 
                    className={`btn ${drawMode === 'pen' ? 'bg-black text-white' : 'bg-gray-200'} px-3 py-1 rounded`}
                >
                    Pen
                </button>
                <button 
                    onClick={() => setDrawMode('line')} 
                    className={`btn ${drawMode === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200'} px-3 py-1 rounded`}
                >
                    Line
                </button>
                <button
                    onClick={() => setDrawMode('rectangle')}
                    className={`btn ${drawMode === 'rectangle' ? 'bg-purple-700 text-white' : 'bg-gray-200'} px-3 py-1 rounded`}
                >
                    Rectangle
                </button>
                <button
                    onClick={() => {
                        setDrawMode('text');
                        setIsTextMode(true);
                    }}
                    className={`btn ${drawMode === 'text' ? 'bg-gray-600 text-white' : 'bg-gray-200'} px-3 py-1 rounded`}
                >
                    Text
                </button>
                <button 
                    onClick={() => setDrawMode('eraser')} 
                    className={`btn ${drawMode === 'eraser' ? 'bg-red-500 text-white' : 'bg-gray-200'} px-3 py-1 rounded`}
                >
                    Eraser
                </button>
                {drawMode === 'eraser' && (
                    <div className="flex items-center ml-2">
                        <span className="mr-2">Size:</span>
                        <input 
                            type="range" 
                            min="5" 
                            max="50" 
                            value={eraserSize} 
                            onChange={(e) => setEraserSize(parseInt(e.target.value))}
                            className="w-24"
                        />
                    </div>
                )}
                <button 
                    onClick={undo} 
                    disabled={historyIndex <= 0}
                    className={`btn ${historyIndex <= 0 ? 'bg-gray-300' : 'bg-gray-500 text-white'} px-3 py-1 rounded`}
                >
                    Undo
                </button>
                <button 
                    onClick={redo} 
                    disabled={historyIndex >= history.length - 1}
                    className={`btn ${historyIndex >= history.length - 1 ? 'bg-gray-300' : 'bg-gray-500 text-white'} px-3 py-1 rounded`}
                >
                    Redo
                </button>
                <button 
                    onClick={clearCanvas} 
                    className="btn bg-red-500 text-white px-3 py-1 rounded"
                >
                    Clear
                </button>
            </div>

            {isTextMode && (
                <div className="my-4 flex justify-center">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text and touch the canvas to add"
                        className="border p-2 rounded w-full max-w-xs"
                    />
                </div>
            )}

            <div className="flex justify-center">
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={500} // Reduced height to fit better on screen
                    className="border border-gray-500 w-full max-w-full h-[400px]"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                />
            </div>
        </div>
    );
};

export default DrawingBoard;