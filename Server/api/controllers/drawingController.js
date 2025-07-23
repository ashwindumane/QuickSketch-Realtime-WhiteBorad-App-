const drawingService = require("../services/drawingService");

// Controller to get all drawings
const getAllDrawings = async (req, res) => {
  try {
    const drawings = await drawingService.getAllDrawings();
    res.json(drawings);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve drawings" });
  }
};

// Controller to create a new drawing
const createDrawing = async (req, res) => {
  const { title, elements } = req.body;
  try {
    const newDrawingId = await drawingService.createDrawing({ title, elements });
    res.status(201).json({ id: newDrawingId });
  } catch (err) {
    res.status(500).json({ error: "Failed to create drawing" });
  }
};

// Controller to get a drawing by ID
const getDrawingById = async (req, res) => {
  const drawingId = req.params.id;
  try {
    const drawing = await drawingService.getDrawingById(drawingId);
    if (!drawing) {
      return res.status(404).json({ error: "Drawing not found" });
    }
    res.json(drawing);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve drawing" });
  }
};

// Controller to update a drawing
const updateDrawing = async (req, res) => {
  const drawingId = req.params.id;
  const { title, elements } = req.body;
  try {
    const updatedDrawing = await drawingService.updateDrawing(drawingId, { title, elements });
    if (!updatedDrawing) {
      return res.status(404).json({ error: "Drawing not found" });
    }
    res.json(updatedDrawing);
  } catch (err) {
    res.status(500).json({ error: "Failed to update drawing" });
  }
};

// Controller to delete a drawing
const deleteDrawing = async (req, res) => {
  const drawingId = req.params.id;
  try {
    const result = await drawingService.deleteDrawing(drawingId);
    if (!result) {
      return res.status(404).json({ error: "Drawing not found" });
    }
    res.json({ message: "Drawing deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete drawing" });
  }
};

module.exports = {
  getAllDrawings,
  createDrawing,
  getDrawingById,
  updateDrawing,
  deleteDrawing,
};
