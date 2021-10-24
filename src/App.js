import Layout, { Content, Header } from "antd/lib/layout/layout";
import { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import "./App.css";
import Taskboard from "./components/tasksBoard/TasksBoard";
import ProjectIcon from "./components/assets/project.svg";
import ok from "./components/assets/ok.svg";
import supp from "./components/assets/supp.svg";
import BacklogImg from "./components/assets/backlog.svg";
import Alert from "./components/alertComponent/customAlert/Alert";
import TimeTracker from "./components/timeTracker/TimeTracker";
import NoteComponent from "./components/NoteComponent/NoteComponent";
import automaticTrackTimerAtom from "./statesManager/atoms/automaticTrackTimerAtom";
import { useRecoilState } from "recoil";
import ModalConfigComponent from "./components/modalConfig/ModalConfigComponent";
import clickedConfigAtom from "./statesManager/atoms/clickedConfigAtom";
import FloatingButton from "./components/githubFloatingButton/FloatingButton";
import openDashAtom from "./statesManager/atoms/openDashAtom";
import Dashboard from "./components/dashboard/Dashboard";
import useDateTime from "./hooks/useDateTime";
import useMobile from "./hooks/useMobile";
import NoMobile from "./components/assets/smartphone.svg";

const StyledLayout = styled(Layout)`
  /* We can't use "height: 100vh; width: 100vw;" here.
  Otherwise, when there is a horizontal scrollbar etc,
  because that we set a constant height, there will be a vertical one too.  */
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
  background-color: #fff;
`;

const StyledContent = styled(Content)`
  background-color: rgba(236, 236, 236, 0.67);
`;

function App() {
  const [openDash] = useRecoilState(openDashAtom);
  const { dateStartSession } = useDateTime();
  const { isMobile } = useMobile();

  // eslint-disable-next-line no-unused-vars
  const [clickedConfig, setClickedConfig] = useRecoilState(clickedConfigAtom);
  // eslint-disable-next-line no-unused-vars
  const [autoTrackTime, setAutoTrackTime] = useRecoilState(
    automaticTrackTimerAtom
  );
  const [projectName, setProjectName] = useState(
    localStorage.getItem("projectName") ?? ""
  );
  const [validateprojectName, setValidateProjectName] = useState(
    localStorage.getItem("validate") ?? false
  );

  const [erasedDemand, setErasedDemand] = useState(false);
  const [openNote, setOpenNote] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("startSession", dateStartSession))
      if (projectName !== "" && validateprojectName) {
        setValidateProjectName(true);
      }
  }, [projectName, openNote, validateprojectName, dateStartSession]);

  const handleValidateprojectName = () => {
    setValidateProjectName(true);
    localStorage.setItem("validate", true);
    localStorage.setItem("projectName", projectName);
  };

  const handleEraseprojectName = () => {
    setErasedDemand(true);
    // localStorage.removeItem("projectName");
    // localStorage.removeItem("validate");
    // setValidateProjectName(false);
  };

  const handleOpenNote = () => {
    setOpenNote((openNote) => !openNote);
  };

  return (
    <StyledLayout>
      {!isMobile ? (
        <Fragment>
          {openNote ? <NoteComponent /> : null}
          <StyledHeader>
            <div className="projectName-container">
              {clickedConfig ? <ModalConfigComponent /> : null}
              {erasedDemand ? (
                <Alert
                  setValidateProjectName={setValidateProjectName}
                  setProjectName={setProjectName}
                  title={`Delete or reset?`}
                  subTitle={`You can delete the project name only, or reset the whole app...`}
                  buttonYes={`Project name`}
                  buttonNo={`Reset all`}
                />
              ) : null}
              <div
                style={{ position: "relative", width: "42%" }}
                className="projectName-content"
              >
                {projectName && (
                  <Fragment>
                    {!validateprojectName && (
                      <button
                        onClick={handleValidateprojectName}
                        className={
                          validateprojectName
                            ? "valid-projectName-button simple "
                            : "valid-projectName-button simple"
                        }
                      >
                        <span className="infoEraser">
                          <img
                            style={{ opacity: 1 }}
                            className="projectName-icons"
                            src={ok}
                            alt="ok"
                          />
                          <span
                            style={{ marginTop: -22 }}
                            className="tooltip tooltipProjectName"
                          >
                            Click for validate project name!
                          </span>
                        </span>
                      </button>
                    )}
                    {validateprojectName && (
                      <button
                        onClick={handleEraseprojectName}
                        className="erase-urername-button simple opacityfull"
                      >
                        <span className="infoEraser">
                          <img
                            className="projectName-icons"
                            src={supp}
                            alt="supp"
                          />
                          <span
                            style={{ marginTop: -22, fontSize: 15 }}
                            className="tooltip tooltipProjectName"
                          >
                            Delete project name or reset all
                          </span>
                        </span>
                      </button>
                    )}
                  </Fragment>
                )}
                <input
                  style={{ width: "100%", height: "100%" }}
                  readOnly={validateprojectName ? true : false}
                  type="text"
                  autoComplete="off"
                  maxLength="30"
                  id="chat-name-input"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Project Name"
                  className={
                    !validateprojectName
                      ? "new-message-input-field light-background opacityFilter"
                      : "new-message-input-field light-background"
                  }
                />
                <div
                  className="noteButton"
                  style={{
                    // position: "absolute",
                    cursor: "pointer",
                    border: "1px solid purple",
                    padding: "8px",
                    height: 63,
                    width: 73,
                  }}
                >
                  <img
                    onClick={handleOpenNote}
                    style={{ width: 44, position: "absolute" }}
                    src={ProjectIcon}
                    alt="note"
                  />
                </div>
              </div>
              <div className="logoApp">
                <img className="logo" src={BacklogImg} alt="" />
                <strong>My Simple Tasks manager</strong>
                <sub>v2.2</sub>
              </div>
            </div>
          </StyledHeader>
          {!autoTrackTime ? <TimeTracker /> : null}
          <StyledContent>
            {openDash ? <Dashboard /> : null}
            {!openDash ? <Taskboard /> : null}
            <FloatingButton />
          </StyledContent>
        </Fragment>
      ) : (
        <div
          style={{
            background: "rgb(85 4 135)",
            width: "100%",
            height: "100vh",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <img
            className="rotate-in-center"
            style={{ marginTop: -40, marginBottom: 45 }}
            src={NoMobile}
            alt="noMobile"
            width="125"
          />
          <strong
            className="tracking-in-expand"
            style={{ fontSize: 22, marginBottom: 12 }}
          >
            This app is not for mobile devices
          </strong>
          <p
            className="tracking-in-contract-bck-bottom"
            style={{ fontStyle: "italic" }}
          >
            To see the app correctly, open it to desktop computer...
          </p>
        </div>
      )}
    </StyledLayout>
  );
}

export default App;
