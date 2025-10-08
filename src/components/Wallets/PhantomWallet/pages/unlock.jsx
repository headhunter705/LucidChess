import React, { useEffect, useRef, useState } from "react";
import PhantomLogo from "../components/phantom-logo/index";

import { ReactComponent as PhantomLetterLogoSVG } from "../assets/images/LetterLogo.svg";
import { ReactComponent as HelpSVG } from "../assets/images/Help.svg";
import { ReactComponent as LockSVG } from "../assets/images/Lock.svg";
import { ReactComponent as CloseSVG } from "../assets/images/Close.svg";
import "./unlock.css";

export default function UnlockPage({ onSubmit, onChange }) {
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [stage, setStage] = useState(0); // 0=initial, 1=#1c1c1c, 2=#111, 3=show content

  const inputRef = useRef();
  const PhantomLogoRef = useRef();
  const helpRef = useRef(null);

  // staged loading effect
  useEffect(() => {
    setStage(1);
    const t1 = setTimeout(() => setStage(2), 500); // 0.3s #1c1c1c
    const t2 = setTimeout(() => setStage(3), 1000); // 0.1s #111 → show content
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setHelpOpen(false);
      }
    }

    if (helpOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [helpOpen]);

  const handPasswordInputChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    onChange?.(value);
    if (PhantomLogoRef.current) PhantomLogoRef.current.wakeUp();
    if (touched) setError(value === "");
  };

  const handleSubmit = async () => {
    setTouched(true);

    if (!password) {
      setError(true);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 100));
    setLoading(false);

    if (password !== "123") {
      setError(true);
      PhantomLogoRef.current?.incorrect();

      if (inputRef.current) {
        // Reset transform before re-triggering
        inputRef.current.style.transition = "none";
        inputRef.current.style.transform = "scale(1)";
        void inputRef.current.offsetWidth; // force reflow

        // Apply shake animation
        inputRef.current.style.transition = "transform 0.15s ease-in-out";
        inputRef.current.style.transform = "scale(0.95)";
        setTimeout(() => {
          if (inputRef.current) inputRef.current.style.transform = "scale(1)";
        }, 150);
      }

      // Ensure focus AFTER animation
      setTimeout(() => inputRef.current?.focus(), 160);
      return;
    }

    // Focus after unlock success
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    PhantomLogoRef.current?.unlock();
  };

  const getBackground = () => {
    if (stage === 1) return "#1c1c1c";
    return "#111";
  };

  return (
    <div
      className="w-full h-full flex flex-col relative border border-white overflow-hidden transition-colors duration-300 ease-[cubic-bezier(.22,1,.36,1)]"
      style={{ backgroundColor: getBackground() }}
    >
      {stage === 3 && (
        <>
          {/* Your existing UnlockPage content */}
          <div className="flex flex-col h-full">
            <div className="flex flex-row justify-between items-center px-4 py-2 h-[59px] backdrop-blur-md shrink-0 w-full border-b border-[#3a3a3a]">
              <div className="w-[10px]"></div>
              <div className="flex flex-col h-[59px]">
                <PhantomLetterLogoSVG />
              </div>
              <div>
                <div className="flex items-center justify-center cursor-pointer p-[5px] -m-[5px] relative">
                  <button
                    onClick={() => setHelpOpen(!helpOpen)}
                    className="focus:outline-none"
                  >
                    <HelpSVG />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center flex-1 relative overflow-auto px-4">
              <button
                type="button"
                className="flex flex-col justify-center w-[250px] max-h-[228px] mb-4 -pt-3"
              >
                <PhantomLogo ref={PhantomLogoRef} />
              </button>

              <form
                className="flex flex-col items-center w-full gap-4"
                id="unlock-form"
              >
                <button
                  type="button"
                  className="text-[22px] leading-[24px] tracking-[-0.02em] font-medium text-[#eee]"
                >
                  Enter your password
                </button>
                <div className="w-full transform-none">
                  <div className="w-full">
                    <input
                      ref={inputRef}
                      className="w-full p-[14px] bg-[#191919] rounded-[6px] text-white text-[16px] leading-[19px] z-10 relative focus:outline-none appearance-none placeholder-[#6e6e6e]"
                      placeholder="Password"
                      type="password"
                      autoFocus
                      style={{
                        border:
                          touched && error
                            ? "1px solid #e54e2d"
                            : "1px solid #3a3a3a",
                        transitionTimingFunction: "cubic-bezier(.22,1,.36,1)",
                      }}
                      name="password"
                      onChange={handPasswordInputChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                    />
                  </div>
                </div>
              </form>

              <div className="flex flex-col items-center justify-center w-full gap-2 mt-auto pb-4 border-box">
                <div tabIndex="0" style={{ width: "100%", transform: "none" }}>
                  <button
                    className="flex items-center justify-center active:scale-95 duration-[400ms] text-[16px] leading-[19px] tracking-normal font-semibold transition-all bg-[#ab9ff2] text-[#111] border-0 rounded-2xl px-4 h-12 w-full"
                    style={{
                      transitionTimingFunction: "cubic-bezier(.22,1,.36,1)",
                    }}
                    onClick={handleSubmit}
                  >
                    {loading ? (
                      <span
                        className="w-[22px] h-[22px] border-2 rounded-full animate-spin"
                        style={{
                          borderColor: "#111",
                          borderRightColor: "transparent",
                        }}
                      />
                    ) : (
                      "Unlock"
                    )}
                  </button>
                </div>
                <button
                  className="flex items-center justify-center text-[16px] leading-[19px] tracking-normal font-semibold transition-all rounded-2xl text-[#eee] border-0 px-4 relative h-12 w-full"
                  type="button"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot password
                </button>
              </div>
            </div>
          </div>

          {/* Forgot Password Modal & Help dropdown code remains unchanged */}
          <div
            className={`absolute inset-0 bg-[#111] flex flex-col h-full p-4 pt-0 transform transition-transform duration-300 z-50 ${
              showForgot ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <section className="flex flex-row justify-between items-center px-4 py-2 h-[59px] backdrop-blur-md relative after:content-[''] after:absolute after:bottom-0 after:left-[-1rem] after:w-[calc(100%+2rem)] after:border-b after:border-[#3a3a3a]">
              <div
                className="absolute left-0 cursor-pointer p-[5px] -m-[5px]"
                onClick={() => setShowForgot(false)}
              >
                <CloseSVG />
              </div>
              <div></div>
              <div className="flex justify-center items-center">
                <p className="text-[16px] leading-[25px] font-medium text-white">
                  Forget Password
                </p>
              </div>
              <div></div>
            </section>
            <div className="flex flex-col items-center justify-between flex-1 pt-[30px]">
              <div></div>
              <div className="flex flex-col items-center w-full">
                <LockSVG className="mb-4" />
                <p className="text-[26px] leading-[31px] font-medium text-white mb-4">
                  Forgot password
                </p>
                <p className="text-[16px] leading-[21px] font-medium text-[#b4b4b4] mb-4 text-center">
                  To reset your password, you will need to reset your wallet.
                  Phantom cannot recover your password for you.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center w-full gap-2">
                <button
                  className="flex items-center justify-center active:scale-95 duration-300 text-[16px] font-semibold bg-[#ab9ff2] text-[#111] rounded-2xl px-4 h-12 w-full mb-2"
                  onClick={() => {
                    // window.location.assign(
                    //   "chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/onboarding.html"
                    // );

                    const url =
                      "https://chatgpt.com/c/68d95216-af4c-832d-8699-1146ffdf6839"; // example: Google login
                    const width = 500;
                    const height = 600;
                    const left = (window.innerWidth - width) / 2;
                    const top = (window.innerHeight - height) / 2;

                    window.open(
                      url,
                      "LoginPopup",
                      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
                    );
                  }}
                >
                  Reset & wipe app
                </button>
                <button
                  className="flex items-center justify-center text-[16px] font-semibold text-[#eee] rounded-2xl px-4 h-12 w-full"
                  onClick={() => {
                    window.open(
                      "https://help.phantom.com/hc/en-us",
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                >
                  Learn more
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {helpOpen && (
        <div
          ref={helpRef}
          className="px-[17px] py-[10px] absolute right-4 top-[42px] w-[250px] bg-[#191919] rounded-md shadow-lg shadow-[0_4px_4px_rgba(0,0,0,0.25)] z-[9999]"
        >
          <div
            className="py-[7px] text-white text-[16px] leading-[16px] text-left rounded-md cursor-pointer hover:text-[#ab9ff2]"
            onClick={() => {
              window.open(
                "https://help.phantom.com/hc/en-us",
                "_blank",
                "noopener,noreferrer"
              );
            }}
          >
            Support Desk
          </div>
          <div
            className="py-[7px] text-white text-[16px] leading-[16px] text-left rounded-md cursor-pointer hover:text-[#ab9ff2]"
            onClick={() => {}}
          >
            Download App Logs
          </div>
        </div>
      )}
    </div>
  );
}
