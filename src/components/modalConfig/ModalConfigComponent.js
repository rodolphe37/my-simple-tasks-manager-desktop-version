import "./modalConfig.css";
import TimerManual from "../assets/timerManual.svg";
import TimerAuto from "../assets/timerAuto.svg";
import configIcon from "../assets/settings.svg";
import clickedConfigAtom from "../../statesManager/atoms/clickedConfigAtom";
import { useRecoilState } from "recoil";
import automaticTrackTimerAtom from "../../statesManager/atoms/automaticTrackTimerAtom";
import { useEffect } from "react";

const ModalConfigComponent = ({ status, STATUS }) => {
  const [clickedConfig, setClickedConfig] = useRecoilState(clickedConfigAtom);
  const [autoTrackTime, setAutoTrackTime] = useRecoilState(
    automaticTrackTimerAtom
  );

  const handleclickConfig = () => {
    if (!clickedConfig) {
      setClickedConfig(true);
    }
    if (clickedConfig) {
      setClickedConfig(false);
    }
  };

  const nextURL = "/";
  const nextTitle = "My Simple Tasks Manager";
  const nextState = { additionalInformation: "Updated the URL with JS" };

  const handleAutoTrackTime = () => {
    if (!autoTrackTime) {
      setAutoTrackTime(true);
    }
    if (autoTrackTime) {
      setAutoTrackTime(false);
    }
    setClickedConfig(false);
    setTimeout(() => {
      window.history.pushState(nextState, nextTitle, nextURL); // window.location("/");
    }, 400);
  };

  useEffect(() => {
    if (autoTrackTime) {
      localStorage.setItem("autoTrackTime", true);
    }
    if (!autoTrackTime) {
      localStorage.setItem("autoTrackTime", false);
    }
  }, [autoTrackTime]);
  return (
    <div>
      <aside id="config" className="modalConfig">
        <div style={{ color: "#000" }}>
          <h2 style={{ fontSize: 18, color: "#000" }}>
            {autoTrackTime ? "Automatic" : "Manual"} timer configuration
          </h2>
          <p>
            {`You can choose the automatic TrackTime or
             the manual TrackTime.`}
          </p>
          <p style={{ color: "#6c6cd4", fontWeight: "bold" }}>
            You are in {autoTrackTime ? "Automatic" : "Manual"} mode
          </p>
          <sub style={{ color: "darkred", fontWeight: "bold" }}>
            You are defaulting to {autoTrackTime ? "Automatic" : "Manual"}{" "}
            timer, you can change this here!
          </sub>
          <div className="icons-config">
            <button
              onClick={handleAutoTrackTime}
              disabled={!autoTrackTime ? false : true}
            >
              <img
                className={!autoTrackTime ? "" : "opacity"}
                src={TimerAuto}
                alt="auto"
              />
            </button>
            <button
              onClick={handleAutoTrackTime}
              disabled={autoTrackTime ? false : true}
            >
              <img
                className={autoTrackTime ? "" : "opacity"}
                src={TimerManual}
                alt="manual"
              />
            </button>
          </div>
          <div className="text-config">
            <p className={autoTrackTime ? "opacity" : ""}>
              Automatic TrackTime
            </p>
            <p className={!autoTrackTime ? "opacity" : ""}>Manual TrackTime</p>
          </div>
          <a
            onClick={() => {
              setClickedConfig(false);
            }}
            href="#close"
            title="Close"
          >
            Close
          </a>
        </div>
      </aside>

      {!clickedConfig ? (
        <a href="#config" className="openModalConfig">
          <button onClick={handleclickConfig}>
            <img style={{ width: 24 }} src={configIcon} alt="config" />
          </button>
        </a>
      ) : null}
    </div>
  );
};

export default ModalConfigComponent;
