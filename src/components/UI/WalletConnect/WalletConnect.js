import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";

import MetamaskModal from "../../Wallets/MetaMaskWallet/Modal";
import PhantomModal from "../../Wallets/PhantomWallet/Modal";
import RabbyModal from "../../Wallets/RabbyWallet/Modal";

import "bootstrap/dist/css/bootstrap.min.css";
import "./WalletConnect.scss";

import mode1Img from "../../../assets/img/Mascot.png";
import mode2Img from "../../../assets/img/Ghost.png";
import mode3Img from "../../../assets/img/Rabby.png";

import BG_CLASSIC from "../../../assets/img/1v1_classic_bg.png";
import BG_SILVER from "../../../assets/img/1v1_silver_bg.png";
import BG_GOLD from "../../../assets/img/1v1_gold_bg.png";

import song from "../../../assets/audio/gameselect.mp3";
import useSound from "use-sound";

import { wallet_type } from "../../../utils/constant";

const isMetaMaskInstalled = () =>
  typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask === true;

const isPhantomInstalled = () =>
  typeof window.solana !== "undefined" && window.solana.isPhantom === true;

const isRabbyInstalled = () =>
  typeof window.ethereum !== "undefined" && window.ethereum.isRabby === true;

const wallets = [
  {
    type: wallet_type.metamask,
    label: "Metamask",
    // img: mode1Img,
    icon: mode1Img,
    bg: BG_CLASSIC,
    modal: MetamaskModal,
    check: isMetaMaskInstalled,
    installUrl: "https://metamask.io/download/",
  },
  // {
  //   type: wallet_type.phantom,
  //   label: "Phantom",
  //   // img: mode2Img,
  //   icon: mode2Img,
  //   bg: BG_CLASSIC,
  //   modal: PhantomModal,
  //   check: isPhantomInstalled,
  //   installUrl: "https://phantom.app/download",
  // },
  {
    type: wallet_type.rabby,
    label: "Rabby",
    // img: mode3Img,
    icon: mode3Img,
    bg: BG_CLASSIC,
    modal: RabbyModal,
    check: isRabbyInstalled,
    installUrl: "https://rabby.io/",
  },
];

const someWalletInstalled = () => wallets.some(wallet => wallet.check());

export const GameSelect = () => {
  const [playSong] = useSound(song);
  const navigate = useNavigate();
  const [openWallet, setOpenWallet] = useState(0);
  const [error, setError] = useState("");
  const [installLink, setInstallLink] = useState("");

  const connectWith = useCallback(
    (walletType) => {
      playSong();
      const wallet = wallets.find((w) => w.type === walletType);
      console.log(walletType, wallet.check())
      if (wallet && !wallet.check()) {
        setError(
          `${wallet.label} Wallet is not installed. Do you want to install it now? `
        );
        setInstallLink(wallet.installUrl);
        return;
      }
      setOpenWallet(walletType);
      setError("");
      setInstallLink("");
    },
    [playSong]
  );

  const closeWalletModal = useCallback(() => setOpenWallet(0), []);

  const onSuccess = () => {
    navigate("/gameScene");
  }

  return (
    <div className="GameSelect">
      <div className="w-container">
        <div className="w-ribbon">Connect Wallet</div>
        <div className="w-content">
          {/* {error && (
            <div className="w-description">
              <span>{error}</span>
              {installLink && (
                <a href={installLink} target="_blank" rel="noopener noreferrer">
                  Install Now
                </a>
              )}
            </div>
          )} */}
          {!someWalletInstalled() && (
            <div className="w-description">
              <span>Wallet is not installed. Do you want to install it now?</span>
                <a href={`https://metamask.io/download/`} target="_blank" rel="noopener noreferrer">
                  Install Now
                </a>
            </div>
          )}
          
          <div className="w-btn-container">
            {wallets.map(({ type, label, bg, icon, check }) => (
              check() && (<div key={type} className="w-item" onClick={() => connectWith(type)}>
                <Image className="w-item-image" src={icon} />
                <div className="w-item-text">{label}</div>
              </div>)

              // <div
              //   key={type}
              //   style={{ backgroundImage: `url(${bg})` }}
              // >
              //   <div
              //     className="rooms-container-content-room-icon"
              //     style={{ backgroundImage: `url(${icon})` }}
              //   ></div>
              //   <div className="rooms-container-content-room-texts">
              //     <div className="rooms-container-content-room-name">
              //       {/* {room.name}aasdasd */} {` `}
              //     </div>
              //     <div className="rooms-container-content-room-pool">
              //       {/* {room.pool} */} dsafadsf
              //     </div>
              //     <div className="rooms-container-content-room-desc">
              //       {/* {label}  */} sdfsdfsdfsdfdsfsdfasdfasdf
              //     </div>
                  
              //   </div>
              // </div>
            ))}
          </div>
        </div>
      </div>

      {wallets.map(({ type, modal: Modal, check }) => (
        check() && <Modal
          key={type}
          isOpen={openWallet === type}
          onSuccess={onSuccess}
          onRequestClose={closeWalletModal}
        />
      ))}
    </div>
  );
};

export default GameSelect;
