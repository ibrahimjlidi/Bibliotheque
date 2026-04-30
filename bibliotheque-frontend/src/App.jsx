import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Accueil from "./pages/Accueil";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Livres from "./pages/Livres";
import LivresDetailles from "./pages/LivresDetailles"; // ✅ note la majuscule
import AdminDashboard from "./pages/AdminDashboard";
import EmployeDashboard from "./pages/Employedashboard";
import MesReservations from "./pages/MesReservations";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/livres" element={<Livres />} />
        <Route path="/livres/:id" element={<LivresDetailles />} /> {/* Route avec paramètre */}
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/EmployeDashboard" element={<EmployeDashboard />} />
        <Route path="/mes-reservations" element={<MesReservations />} />
      </Routes>
    </Router>
  );
}

export default App;
