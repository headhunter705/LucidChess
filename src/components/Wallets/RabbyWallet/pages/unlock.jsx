import { useState, useEffect } from "react";
import { ReactComponent as BackgroundSVG } from "../assets/background.svg";
import RabbyLogoSVG from "../assets/logo.svg";

import "./unlock.css";

const ERR_TYPE = {
  NO_ERROR: 0,
  EMPTY_ERROR: 1,
  INCORRECT_ERROR: 2,
};

const default_error = {
  type: ERR_TYPE.NO_ERROR,
  message: "",
};

export default function Unlock() {
  const [error, setError] = useState(default_error);
  const [password, setPassword] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (error.type) setIsVisible(true);
  }, [error]);

  const handlePasswordChange = (e) => {
    setError({ type: ERR_TYPE.NO_ERROR, message: error.message });
    const value = e.target.value;

    setPassword(value);
    if (!value.length) {
      setError({
        type: ERR_TYPE.EMPTY_ERROR,
        message: "Enter the Password to Unlock",
      });
      return;
    }
  };

  const handleSubmit = (e) => {
    if (password !== "password") {
      setError({
        type: ERR_TYPE.INCORRECT_ERROR,
        message: "Incorrect password",
      });
    }
  };

  const handleAnimationEnd = () => {
    if (!error) setIsVisible(false);
  };

  return (
    <div className="rabby-unlock page-has-ant-input relative w-[400px] h-[599px] min-h-[550px]">
      <BackgroundSVG className="absolute inset-0 z-[-1]" />
      <div className="pt-[80px]">
        <img src={RabbyLogoSVG} className="m-auto w-[100px] h-[100px]" alt="" />
        <h1 className="text-[24px] font-semibold leading-[23px] text-[#192945] mt-3 text-center">
          Rabby Wallet
        </h1>
        <p className="text-[14px] font-normal leading-[20px] text-[#6a7587] mt-3 mx-[52px] text-center">
          Your go-to wallet for Ethereum and EVM
        </p>
      </div>
      <form
        autoComplete="off"
        className=""
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex flex-row text-[rgba(0, 0, 0, 0.85)] text-[14px] rabby-InputFormStyled-rabby--1yhbovw bnBtIv mt-[34px] mx-[20px] gap-0">
          <div className="relative w-full max-w-full min-h-[1px] flex flex-col">
            <div className="relative flex items-center min-h-[14px]">
              <div className="flex-auto max-w-full">
                <input
                  placeholder="Enter the Password to Unlock"
                  className={`placeholder-[#6a7587] w-full py-[15px] px-[16px] tracking-[4px] border border-transparent transition-all duration-[300ms] bg-r-neutral-card1 hover:border-rabby-blue-default focus:border-[#4c65ff] placeholder-r-neutral-foot h-[56px] text-[13px] rounded-[8px] truncate outline-none appearance-none placeholder:tracking-normal ${
                    error.type && "border-[#e34935]"
                  }`}
                  type="password"
                  spellCheck="false"
                  autoFocus
                  id="password"
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
            {isVisible && (
              <div
                className={`text-[13px] leading-[16px] font-medium mt-4 mb-6 text-[#f24822] ${
                  error.type ? "fade-in-down" : "fade-out-up"
                }`}
                onAnimationEnd={handleAnimationEnd}
              >
                <div role="alert" style={{ textAlign: "left" }}>
                  {error.message}
                  {error.type === 2 && (
                    <button className="text-[#4c65ff] font-medium underline ml-[8px]">
                      Forgot Password?
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <footer className="absolute bottom-8 left-0 right-0 text-center">
          <div className="flex flex-row mx-5 mb-[18px] gap-0 tracking-[1.5715]">
            <div className="flex flex-col w-full">
              <div className="ant-form-item-control-input">
                <div className="ant-form-item-control-input-content">
                  <button
                    className="text-white bg-[#4c65ff] py-[18px] px-[13px] w-full rounded-[8px] border-none text-[17px] leading-[20px] font-medium h-auto"
                    onClick={handleSubmit}
                  >
                    <span>Unlock</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <a className="text-[#3e495e] text-[13px] leading-[16px] font-medium hover:underline" href="chrome-extension://acmacodkjbdgmoleebolmdjonilkdbch/index.html#/forgot-password">
            Forgot Password?
          </a>
        </footer>
      </form>
    </div>
  );
}
