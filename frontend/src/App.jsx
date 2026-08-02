import { Routes, Route } from "react-router"
import Register from "./pages/Register";
import Home from "./pages/Home"
function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
}

export default App