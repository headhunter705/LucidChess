import "./App.scss";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GameSelect from "./components/UI/GameSelect/GameSelect";
import Level from "./components/UI/Level/Level";
import FriendPlay from "./views/FriendPlay";
import GameScene from "./views/GameScene";
import MatchPlay from "./views/MatchPlay";
import Orientation from "./components/UI/Orientation/Orientation";
import Connect from "./components/UI/Connect/Connect";
import WalletConnect from "./components/UI/WalletConnect/WalletConnect";
import Ranking from "./components/UI/Ranking/Ranking";

import MetamaskModal from "./components/Wallets/MetaMaskWallet/Modal";
import LoadingPage from "./views/LoadingPage/LoadingPage";

function App() {
  const [orientation, setOrientation] = useState(false);

  useEffect(() => {
    window.screen.orientation.lock("landscape").catch((e) => {
      console.log(e);
    });
    window.addEventListener(
      "resize",
      function () {
        setOrientation(window.innerHeight > window.innerWidth);
      },
      false
    );
    setOrientation(window.innerHeight > window.innerWidth);
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<GameSelect />} />
          <Route path="/matchPlay" element={<MatchPlay />} />
          <Route path="/friendPlay/*" element={<FriendPlay />} />
          <Route path="/machinePlay" element={<Level />} />
          {/* <Route path="/gameScene" element={<GameScene />} /> */}
          <Route path="/gameScene" element={<LoadingPage />} />
          <Route path="/connect" element={<WalletConnect />} />
          {/* <Route path="/connect" element={<Connect />} /> */}
          <Route path="/ranking" element={<Ranking show={true} />} />
        </Routes>
        <Orientation show={orientation}></Orientation>
      </div>
    </BrowserRouter>
  );
}

export default App;
