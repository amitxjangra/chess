import { BrowserRouter, Routes, Route } from "react-router-dom";
import GameScreen from "./pages/game";
import Home from "./pages/home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<GameScreen />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
