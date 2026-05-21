import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>  
        <Route path="/" element={<Home />} />

        <Route path="/lobby" element={<Lobby />} />

        <Route path="/game" element={<Game />} />
      </Routes>
    </>
  );
}

export default App;
