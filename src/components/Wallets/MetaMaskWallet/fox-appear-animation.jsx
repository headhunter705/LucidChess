
import { useEffect } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
// import { Box } from "@metamask/design-system-react";
import foxAppear from "./fox_appear.riv";

export default function FoxAppearAnimation({
  isLoader = false,
  skipTransition = false,
}) {
  const { rive, RiveComponent } = useRive({
    src: foxAppear,
    autoplay: false,
    stateMachines: "FoxRaiseUp",
     layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  useEffect(() => {
    if (!rive) return;

    const inputs = rive.stateMachineInputs("FoxRaiseUp");
    if (!inputs) return;

    if (skipTransition) {
      const wiggleTrigger = inputs.find((i) => i.name === "Wiggle");
      wiggleTrigger?.fire();
    } else {
      const startTrigger = inputs.find((i) => i.name === "Start");
      startTrigger?.fire();
    }

    if (isLoader) {
      const loaderTrigger = inputs.find((i) => i.name === "Loader2");
      loaderTrigger?.fire();
    }

    rive.play();
  }, [rive, skipTransition, isLoader]);

  return (
    <div // <Box
      className={
        isLoader
          ? "riv-animation__fox-container--loader"
          : "riv-animation__fox-container"
      }
    >
      <RiveComponent
        className="riv-animation__canvas"
      />
      {isLoader && (
        <img
          data-testid="loading-indicator"
          className="riv-animation__spinner"
          src="./images/spinner.gif"
          alt=""
        />
      )}
    </div> // </Box>
  );
}
