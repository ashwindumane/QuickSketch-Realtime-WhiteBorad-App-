const { ObjectId } = require("mongodb");
const client = require("../dbClient"); // MongoDB client

// Collection reference
const collection = client.db("wbdb").collection("WhiteBoardDB");

// Get all drawings from MongoDB
const getAllDrawings = async () => {
  return await collection.find().toArray();
};

// Create a new drawing
const createDrawing = async (drawing) => {
  const result = await collection.insertOne({
    ...drawing,
    createdAt: new Date(),
  });
  return result.insertedId;
};

// Get a drawing by ID
const getDrawingById = async (drawingId) => {
  if (!ObjectId.isValid(drawingId)) return null;
  return await collection.findOne({ _id: new ObjectId(drawingId) });
};

// Update a drawing by ID
const updateDrawing = async (drawingId, drawing) => {
  if (!ObjectId.isValid(drawingId)) return null;
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(drawingId) },
    { $set: drawing },
    { returnDocument: "after" }
  );
  return result.value;
};

// Delete a drawing by ID
const deleteDrawing = async (drawingId) => {
  if (!ObjectId.isValid(drawingId)) return null;
  const result = await collection.deleteOne({ _id: new ObjectId(drawingId) });
  return result.deletedCount > 0;
};

module.exports = {
  getAllDrawings,
  createDrawing,
  getDrawingById,
  updateDrawing,
  deleteDrawing,
};
