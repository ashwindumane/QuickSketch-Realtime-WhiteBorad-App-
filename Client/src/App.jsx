import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AllDrawings from './pages/AllDrawings';
import CreateDrawingPage from './pages/CreateDrawingPage';
import DrawingDetails from './pages/DrawingDetails';
import UpdateDrawing from './pages/UpdateDrawing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllDrawings />} />
        <Route path="/drawing/:id" element={<DrawingDetails />} />
        <Route path="/updateDrawing/:id" element={<UpdateDrawing />} />
        <Route path="/new-drawing" element={<CreateDrawingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
