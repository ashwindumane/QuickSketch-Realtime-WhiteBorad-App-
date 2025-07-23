const express = require("express");
const drawingController = require("../controllers/drawingController");

const router = express.Router();

// Routes
router.get("/drawings", drawingController.getAllDrawings);
router.post("/drawings", drawingController.createDrawing);
router.get("/drawings/:id", drawingController.getDrawingById);
router.put("/drawings/:id", drawingController.updateDrawing);
router.delete("/drawings/:id", drawingController.deleteDrawing);

module.exports = router;
