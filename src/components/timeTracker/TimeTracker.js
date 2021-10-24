import React, { useState, useEffect } from "react";
import "./timeTracker.css";
import TimerImg from "../assets/time-management.svg";
import useDateTime from "../../hooks/useDateTime";
import { useRecoilState } from "recoil";
import automaticTrackTimerAtom from "../../statesManager/atoms/automaticTrackTimerAtom";
import ModalConfigComponent from "../modalConfig/ModalConfigComponent";
// import clickedConfigAtom from "../../statesManager/atoms/clickedConfigAtom";
import clickedAddToDoAtom from "../../statesManager/atoms/clickedAddToDoAtom";
import { Fragment } from "react";
import itemsByStautsAtom from "../../statesManager/atoms/itemsByStatusAtom";
import projectDoneAtom from "../../statesManager/atoms/projectDoneAtom";
import useIntervalHook from "../../hooks/useIntervalHook";
import useCustomAlertHook from "../../hooks/useCustomAlertHook";
import useCutDecimals from "../../hooks/useCutDecimals";
import useXDigits from "../../hooks/useXDigits";

const STATUS = {
  STARTED: "Started",
  STOPPED: "Stopped",
};

// const INITIAL_COUNT = JSON.parse(localStorage.getItem("time")) ?? 0;

export default function TimeTracker({ itemsByStatus }) {
  const [projectDone] = useRecoilState(projectDoneAtom);
  const { n } = useDateTime();
  const [secondsRemaining, setSecondsRemaining] = useState(
    JSON.parse(localStorage.getItem("time"))
  );
  const [status, setStatus] = useState(
    localStorage.getItem("status") === "Started"
      ? localStorage.getItem("status")
      : STATUS.STOPPED
  );
  const { twoDigits, threeDigits } = useXDigits();
  const [dayWork, setDayWork] = useState(0);
  const secondsToDisplay = secondsRemaining % 60;
  const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60;
  const minutesToDisplay = minutesRemaining % 60;
  const hoursToDisplay = (minutesRemaining - minutesToDisplay) / 60;
  const { useInterval } = useIntervalHook();
  const [autoTrackTime] = useRecoilState(automaticTrackTimerAtom);
  const { handleReset } = useCustomAlertHook();
  const [clickedAddButton] = useRecoilState(clickedAddToDoAtom);
  // eslint-disable-next-line no-unused-vars
  const [stockItemsByStatus, setStockItemsByStatus] =
    useRecoilState(itemsByStautsAtom);

  useEffect(() => {
    if (projectDone) {
      setStatus(STATUS.STOPPED);
    }
    // console.log("itemsByStatus", itemsByStatus);
    if (itemsByStatus) {
      setStockItemsByStatus(itemsByStatus);
    }
  }, [setStockItemsByStatus, itemsByStatus, projectDone]);
  const handleStart = () => {
    setStatus(STATUS.STARTED);
    localStorage.setItem("status", "Started");
  };
  const handleStop = () => {
    setStatus(STATUS.STOPPED);
    localStorage.setItem("status", "Stopped");
  };

  useEffect(() => {
    if (autoTrackTime && clickedAddButton) {
      setStatus(STATUS.STARTED);
    } else if (autoTrackTime && !clickedAddButton) {
      setStatus(STATUS.STOPPED);
    }
    if (autoTrackTime) {
      if (itemsByStatus["In Progress"].length > 0) {
        setStatus(STATUS.STARTED);
      }
      if (itemsByStatus["In Progress"].length === 0) {
        setStatus(STATUS.STOPPED);
      }
      // eslint-disable-next-line no-self-compare
      if (itemsByStatus["Done"].length > itemsByStatus["Done"].length) {
        setStatus(STATUS.STOPPED);
      }
    }
    if (status === STATUS.STOPPED) {
      // If you close the window whitout stop the counter
      localStorage.setItem("time", secondsRemaining);
    }
    // If the status is started that send the time each second elapsed
    return () => {
      localStorage.setItem("time", secondsRemaining);
    };
  }, [
    secondsRemaining,
    status,
    itemsByStatus,
    autoTrackTime,
    clickedAddButton,
  ]);

  useInterval(
    () => {
      if (secondsRemaining >= 0) {
        setSecondsRemaining(secondsRemaining + 1);
      } else {
        setStatus(STATUS.STOPPED);
      }
    },
    status === STATUS.STARTED ? 1000 : null
    // passing null stops the interval
  );

  // Function for cutting number at x decimal
  const { cutDecimals } = useCutDecimals();

  useEffect(() => {
    function getDaysWork() {
      // Cut decimal usage ( seconds elapsed / senconds contained in 8 hours(3600 x 8 = 28800), and number of decimal you want to cut)
      setDayWork(cutDecimals(secondsRemaining / 28800, 2));
    }
    // If the total of seconds is at least 8 hours -> it increments one day then,
    // beyond 1 day, it automatically synchronizes the number of days worked (two digits after the decimal point).
    if (secondsRemaining >= 3600) {
      getDaysWork();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsRemaining]);
  return (
    <div className="time-tracker">
      {!projectDone ? (
        <Fragment>
          <div className="trackTimeTitle">
            <img
              src={TimerImg}
              alt=""
              className={status === STATUS.STARTED ? "logo heartbeat" : "logo"}
            />
            <h1 className={status === STATUS.STARTED ? "redColor" : ""}>
              {status === STATUS.STARTED ? "Track Time" : "Time Tracker"}
            </h1>
          </div>
          <h2
            title="Current date and time"
            data-toggle="tooltip"
            data-placement="left"
          >
            Date - {n}
          </h2>
          {!autoTrackTime && !projectDone ? (
            <div className="button-group">
              <button
                disabled={status === STATUS.STARTED ? true : false}
                className="small green button"
                onClick={handleStart}
                type="button"
              >
                Start
              </button>
              <button
                disabled={status === STATUS.STOPPED ? true : false}
                className="small red button"
                onClick={handleStop}
                type="button"
              >
                Stop
              </button>
              <button
                disabled={status === STATUS.STARTED ? true : false}
                className="small blue button"
                onClick={handleReset}
                type="button"
              >
                Reset
              </button>
              {/*<button onClick={handleclickConfig}>
          <img style={{ width: 34 }} src={configIcon} alt="config" />
  </button>*/}
              {status === STATUS.STOPPED ? <ModalConfigComponent /> : null}
            </div>
          ) : (
            <Fragment>
              <button
                disabled={status === STATUS.STARTED ? true : false}
                className="small blue button autoTime"
                onClick={handleReset}
                type="button"
              >
                Reset
              </button>
              {status === STATUS.STOPPED ? <ModalConfigComponent /> : null}
            </Fragment>
          )}

          <div
            title="Time spent since project start"
            data-toggle="tooltip"
            data-placement="left"
            className="time-lapse"
          >
            {threeDigits(hoursToDisplay)}:{twoDigits(minutesToDisplay)}:
            {twoDigits(secondsToDisplay)}
          </div>
          <span
            title="Days worked"
            data-toggle="tooltip"
            data-placement="left"
          >{`${dayWork} day(s)`}</span>
          <div className="indicator-section">
            <span
              title={
                status === STATUS.STARTED
                  ? "The TimeTracker is Started"
                  : "The TimeTracker is Stopped"
              }
              data-toggle="tooltip"
              data-placement="left"
              className="status-indicator"
              style={
                status === STATUS.STARTED
                  ? {
                      backgroundColor: "green",
                      animation: "backgroundColor 0.6s ease-in-out",
                    }
                  : status === STATUS.STOPPED
                  ? {
                      backgroundColor: "red",
                      animation: "backgroundColor 0.6s ease-in-out",
                    }
                  : { backgroundColor: "orange" }
              }
            ></span>
            <div>{status}</div>
          </div>
        </Fragment>
      ) : null}
    </div>
  );
}
