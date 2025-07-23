const drawingData = require("../data/drawingData");

// Get all drawings
const getAllDrawings = async () => {
  return await drawingData.getAllDrawings();
};

// Create a new drawing
const createDrawing = async (drawing) => {
  return await drawingData.createDrawing(drawing);
};

// Get a drawing by ID
const getDrawingById = async (drawingId) => {
  return await drawingData.getDrawingById(drawingId);
};

// Update a drawing
const updateDrawing = async (drawingId, drawing) => {
  return await drawingData.updateDrawing(drawingId, drawing);
};

// Delete a drawing
const deleteDrawing = async (drawingId) => {
  return await drawingData.deleteDrawing(drawingId);
};

module.exports = {
  getAllDrawings,
  createDrawing,
  getDrawingById,
  updateDrawing,
  deleteDrawing,
};
