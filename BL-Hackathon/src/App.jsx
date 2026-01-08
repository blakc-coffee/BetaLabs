import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { SoloProfileCreate } from "./pages/SoloProfileCreate";
import { SoloProfileView } from "./pages/SoloProfileView";
import { TeamProfileCreate } from "./pages/TeamProfileCreate";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-profile" element={<SoloProfileCreate />} />
      <Route path="/profile/:id" element={<SoloProfileView />} />
      <Route path="/create-team" element={<TeamProfileCreate />} />
    </Routes>
  );
}

export default App;
