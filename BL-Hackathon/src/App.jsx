import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { MyProfiles } from "./pages/MyProfiles";
import { SoloProfileCreate } from "./pages/SoloProfileCreate";
import { SoloProfileView } from "./pages/SoloProfileView";
import { TeamProfileCreate } from "./pages/TeamProfileCreate";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/my-profiles" element={<MyProfiles />} />
      <Route path="/create-profile" element={<SoloProfileCreate />} />
      <Route path="/profile/:id" element={<SoloProfileView />} />
      <Route path="/create-team" element={<TeamProfileCreate />} />
      <Route path="/team/:id" element={<SoloProfileView />} />
    </Routes>
  );
}

export default App;
