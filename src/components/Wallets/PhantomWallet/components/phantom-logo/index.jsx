import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import lottie from "lottie-web";
import lottieJson from "./lottie.js";

const PhantomLogo = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const isPlayingRef = useRef(false);
  const [currentSegment, setCurrentSegment] = useState("idle");

  // Segment definitions
  const segments = {
    idle: [0, 30],
    wakeUp: [30, 60],
    awake: [60, 90],
    jump: [90, 120],
    incorrect: [120, 150],
    unlock: [150, 170],
  };

  useEffect(() => {
    animationRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: lottieJson,
    });

    // Start with idle
    playSegment("idle", true);

    return () => animationRef.current.destroy();
  }, []);

  useEffect(() => {
    console.log(currentSegment);
  }, [currentSegment]);
  // Core segment playback
  const playSegment = (name, loop = false) => {
    const anim = animationRef.current;
    if (!anim || !segments[name]) return;

    anim.loop = loop;
    anim.playSegments(segments[name], true);
    setCurrentSegment(name);
  };

  // Helper for animations that should end with "awake"
  const playWithAutoAwake = (segment) => {
    console.log(currentSegment, segment);
    const anim = animationRef.current;
    if (!anim) return;

    if (isPlayingRef.current) return; // ignore clicks while playing

    isPlayingRef.current = true;
    anim.loop = false;
    anim.playSegments(segments[segment], true);

    anim.addEventListener("complete", function onComplete() {
      anim.removeEventListener("complete", onComplete);

      playSegment("awake", true);

      isPlayingRef.current = false;
    });
  };

  // Expose control methods
  useImperativeHandle(ref, () => ({
    idle: () => playSegment("idle", true),
    wakeUp: () => {
      if (currentSegment === "idle") playWithAutoAwake("wakeUp");
    },
    awake: () => playSegment("awake", true),
    jump: () => playWithAutoAwake("jump"),
    incorrect: () => playWithAutoAwake("incorrect"),
    unlock: () => playSegment("unlock"),
    playSegment,
    getCurrentSegment: () => currentSegment,
  }));

  // Default click: jump → awake
  const handleClick = () => {
    playWithAutoAwake("jump");
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    />
  );
});

export default PhantomLogo;
