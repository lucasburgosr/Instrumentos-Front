import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Estadisticas from "./Components/screens/Estadisticas/Estadisticas";
import NavBar from "./Components/ui/common/NavBar/NavBar";
import Login from "./Components/screens/Login/Login";
import Register from "./Components/screens/Register/Register";
import PrivateRoute from "./Components/PrivateRoute";
import Detalles from "./Components/screens/Detalles/Detalles";
import { useAuth } from "./contexts/AuthContext";
import { useCart } from "./contexts/CartContext";
import NotFound from "./Components/screens/NotFound/NotFound";
import DondeEstamos from "./Components/screens/DondeEstamos/DondeEstamos";
import Instrumentos from "./Components/screens/Instrumentos/Instrumentos";
import Home from "./Components/screens/Home/Home";
import Dashboard from "./Components/screens/Dashboard/Dashboard";

const App: React.FC = () => {
  const { login, userRole } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    const authInfo = localStorage.getItem("authInfo");
    if (authInfo) {
      const { username, role, id } = JSON.parse(authInfo);
      login(username, role, id);
    }
  }, [login]);

  return (
    <Router>
      <div style={{ paddingBottom: "56px", position: "relative" }}>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/instrumentos" element={<Instrumentos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dondeestamos" element={<DondeEstamos />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute
                allowedRoles={["ADMIN", "OPERADOR"]}
                element={<Dashboard />}
              />
            }
          />
          <Route
            path="/estadisticas"
            element={
              <PrivateRoute
                allowedRoles={["ADMIN"]}
                element={<Estadisticas />}
              />
            }
          />
          <Route
            path="/detalles/:id"
            element={<Detalles addToCart={addToCart} userRole={userRole} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
