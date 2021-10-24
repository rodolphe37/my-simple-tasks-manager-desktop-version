import { Fragment, useEffect, useState, createRef } from "react";
import { useRecoilState } from "recoil";
import supp from "../assets/supp.svg";
import openDashAtom from "../../statesManager/atoms/openDashAtom";
import PriceIcon from "../assets/price.svg";
import DashIcon from "../assets/increase.svg";
import ProductivityIcon from "../assets/productivity.svg";
import finishedDatasAtom from "../../statesManager/atoms/finishedDatasAtom";
import projectDoneAtom from "../../statesManager/atoms/projectDoneAtom";
import DollarIcon from "../assets/symbole-du-dollar.svg";
import EuroIcon from "../assets/piece-en-euro.svg";
import backlog from "../assets/backlog.svg";
import TimerEndIcon from "../assets/timer.svg";
import StartIcon from "../assets/start.svg";
import CreatedIcon from "../assets/pencil.svg";
import CompletedIcon from "../assets/dash/completed-task.svg";
import TimeIcon from "../assets/dash/time.svg";
import ClockIcon from "../assets/dash/clock.svg";
import ChronoIcon from "../assets/dash/chronometer.svg";
import HourGlassIcon from "../assets/dash/hourglass.svg";
import AdjustIcon from "../assets/dash/adjust.svg";
import WorkingConnexionIcon from "../assets/dash/schedule.svg";
import TasksIcon from "../assets/tasks.svg";
import ProjectIcon from "../assets/project.svg";
import { v4 as uuidv4 } from "uuid";
import totalListTimeInSecondAtom from "../../statesManager/atoms/totalListTimeInSecondAtom";
import FirstChart from "../firstChart/FirstChart";
import SecondChart from "../firstChart/SecondChart";
import LastChart from "../firstChart/LastChart";
import useCustomAlertHook from "../../hooks/useCustomAlertHook";
import useCutDecimals from "../../hooks/useCutDecimals";
import useHmsToSeconds from "../../hooks/useHmsToSeconds";
import useAddSumStartStop from "../../hooks/useAddSumStartStop";
import useReverseArray from "../../hooks/useReverseArray";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PdfDocument } from "../exportPdf/ExportPdf";
import DownloadPNG from "../assets/download.svg";
import DownPdf from "../assets/downPdf.svg";
import { useScreenshot, createFileName } from "use-react-screenshot";
import CurrencyConverter from "../currencyConverter/CurrencyConverter";
import CurrencyConvertIcon from "../assets/currencyExchange.svg";
import Axios from "axios";
import currencyConverterAtom from "../../statesManager/atoms/currencyConverterAtom";

const Dashboard = () => {
  const [totalTimeToSeconds, setTotalTimeToSeconds] = useRecoilState(
    totalListTimeInSecondAtom
  );

  const [changeDevise, setChangeDevise] = useState(true);
  const [totalTimeLocalStore] = useState(localStorage.getItem("time"));
  const [stockItemsByStatus] = useState(
    JSON.parse(localStorage.getItem("itemsByStatus"))
  );
  const [completCardsTimeArray] = useState(
    JSON.parse(localStorage.getItem("finishedData"))
  );
  const [totalTimeSeconds, setTotalTimeSeconds] = useState([]);
  const { mapRevers } = useReverseArray();

  const [cumuledCardsTimeArray, setCumuledCardsTimeArray] = useState([]);

  let totalSum = [];
  const [connexionNumber, setConnexionNumber] = useState(0);
  const [finishedDatas] = useRecoilState(finishedDatasAtom);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  let startArrayTimes = [];
  let stopArray = [];
  const projectName = localStorage.getItem("projectName");
  const [projectDone] = useRecoilState(projectDoneAtom);
  // eslint-disable-next-line no-unused-vars
  const [openDash, setOpenDash] = useRecoilState(openDashAtom);
  const [eurTjm, setEurTjm] = useState(0);
  const { tjm, setTjm, handlePrice } = useCustomAlertHook();
  const { hmsToSecondsOnly } = useHmsToSeconds();
  const { cutDecimals } = useCutDecimals();
  const [converter, setConverter] = useRecoilState(currencyConverterAtom);
  const [exchangeRate, setExchangeRate] = useState([]);
  let changeEurDoll = exchangeRate ?? localStorage.getItem("exchangeRate");
  let totalEuro = eurTjm / changeEurDoll;
  const ref = createRef(null);

  const [info, setInfo] = useState([]);

  const [from, setFrom] = useState("eur");

  // eslint-disable-next-line no-unused-vars
  const [image, takeScreenShot] = useScreenshot({
    type: "image/png",
    quality: 1.5,
    width: 600,
    height: 1800,
  });

  // Calling the api whenever the dependency changes
  useEffect(() => {
    Axios.get(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from}.json`
    ).then((res) => {
      setInfo(res.data[from]);
      setExchangeRate(info.usd);
    });
  }, [from, info]);

  const HandleOpenConverter = () => {
    if (converter) {
      setConverter(false);
    }
    if (!converter) {
      setConverter(true);
    }
  };
  useEffect(() => {
    localStorage.setItem("exchangeRate", exchangeRate);
    console.log("infos ", exchangeRate);
    console.log("converter ", converter);
  }, [exchangeRate, converter]);

  const download = (
    image,
    { name = `${projectName}`, extension = "png" } = {}
  ) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const downloadScreenshot = () => takeScreenShot(ref.current).then(download);

  useEffect(() => {
    if (finishedDatas) {
      setCumuledCardsTimeArray(JSON.parse(localStorage.getItem("totalCounts")));
    }
    if (!tjm) {
      setEurTjm(0);
    }
    // console.log("exchangeRate", exchangeRate);
  }, [tjm, finishedDatas, exchangeRate]);

  const handleChangeDevise = () => {
    setChangeDevise((changeDevise) => !changeDevise);
  };

  useEffect(() => {
    if (tjm) {
      localStorage.setItem("tjm", tjm);
      setEurTjm(tjm);
    } else if (tjm === 0) {
      localStorage.removeItem("tjm");
    }
    if (projectDone && tjm === 0) {
      handlePrice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tjm, projectDone]);

  const { addSumStartStop } = useAddSumStartStop();

  const taskPerHour =
    stockItemsByStatus["To Do"].length +
    stockItemsByStatus["In Progress"].length +
    stockItemsByStatus["Done"].length;

  const numberKeeped = 8;

  let cardIdTime = finishedDatas.map((res) => res.cardId);
  let cardTitleTime = finishedDatas?.map((res) => res.cardTitle);
  let cumuledTimeCards = cumuledCardsTimeArray?.filter(
    (resultFiltered) => resultFiltered.total !== null
  );

  useEffect(() => {
    if (totalSum !== []) {
      setTotalTimeSeconds(...totalTimeSeconds, totalSum);
    }

    let startedTime = finishedDatas.map((res) => res.start);
    let finishedTime = finishedDatas.map((res) => res.stop);

    for (let i = 0; i < startedTime.length; i++) {
      const startTask = startedTime[i];
      const hoursToMinStartTask = startTask.substring(
        startTask.length - numberKeeped
      );
      const startTaskResult = hmsToSecondsOnly(hoursToMinStartTask);
      startArrayTimes.push(startTaskResult);
    }

    for (let i = 0; i < finishedTime.length; i++) {
      const stopTask = finishedTime[i];
      const hoursToMinStopTask = stopTask.substring(
        stopTask.length - numberKeeped
      );
      const stopTaskResult = hmsToSecondsOnly(hoursToMinStopTask);
      stopArray.push(stopTaskResult);
    }

    if (
      projectDone &&
      localStorage.getItem("startArrayTimes") === null &&
      localStorage.getItem("stopArrayTimes") === null
    ) {
      localStorage.setItem("startArrayTimes", [...startArrayTimes]);
      localStorage.setItem("stopArrayTimes", [...stopArray]);
    }
    if (projectDone && startArrayTimes.length > 0 && stopArray.length > 0) {
      addSumStartStop(
        stopArray,
        startArrayTimes,
        totalSum,
        cardIdTime,
        cardTitleTime,
        totalTimeSeconds
      );
    }

    localStorage.setItem("connexionNumber", totalSum.length);
    setConnexionNumber(localStorage.getItem("connexionNumber"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finishedDatas, setTotalTimeToSeconds, totalTimeToSeconds, projectDone]);

  let Note1Content = localStorage.getItem("valueNote1");
  let Note2Content = localStorage.getItem("valueNote2") ?? null;
  let Note3Content = localStorage.getItem("valueNote3") ?? null;
  let Note4Content = localStorage.getItem("valueNote4") ?? null;

  return (
    <div className="dash-content scale-in-ver-bottom">
      <div className="header-dash">
        <div className="headerDash-logo">
          <img src={ProductivityIcon} alt="dash" style={{ width: 55 }} />
          <h1>Dashboard</h1>
        </div>
        <button onClick={HandleOpenConverter} className="currencyButton">
          <img
            title="Open Currency Converter Widget"
            data-toggle="tooltip"
            data-placement="left"
            className="CurrencyIcon"
            src={CurrencyConvertIcon}
            alt="currencyConverter"
            width="90"
          />
        </button>
        <div style={{ width: 150, justifyContent: "center", display: "flex" }}>
          <PDFDownloadLink
            document={
              <PdfDocument
                totalTimeLocalStore={totalTimeLocalStore}
                data={finishedDatas}
                tjm={tjm}
                changeEurDoll={changeEurDoll}
                stockItemsByStatus={stockItemsByStatus}
                taskPerHour={taskPerHour}
                cumuledTimeCards={cumuledTimeCards}
                Note1Content={Note1Content}
                Note2Content={Note2Content}
                Note3Content={Note3Content}
                Note4Content={Note4Content}
                connexionNumber={connexionNumber}
                totalTimeSeconds={totalTimeSeconds}
                completCardsTimeArray={completCardsTimeArray}
              />
            }
            fileName={`${projectName}.pdf`}
            style={{
              textDecoration: "none",
              padding: "10px",
              color: "#4a4a4a",
              backgroundColor: "transparent",
              border: "none",
            }}
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                <img src={DownPdf} alt="" width="43" />
              ) : (
                <img
                  title="Download Rapport in pdf format!"
                  data-toggle="tooltip"
                  data-placement="left"
                  className="PdfIcon bounce-top"
                  src={DownPdf}
                  alt="pdf"
                  width="44"
                />
              )
            }
          </PDFDownloadLink>
          <button
            style={{ background: "transparent", border: "none" }}
            onClick={downloadScreenshot}
          >
            <img
              title="Download Rapport in png format!"
              data-toggle="tooltip"
              data-placement="left"
              className="PdfIcon bounce-top"
              src={DownloadPNG}
              alt="pdf"
              width="44"
            />
          </button>
        </div>
        <div className="closeButton-container">
          <button
            title="Close the Dashboard!"
            data-toggle="tooltip"
            data-placement="left"
            className="closeButtonDash"
            onClick={() => setOpenDash(false)}
          >
            <strong className="rotate">X</strong>
          </button>
        </div>
      </div>
      <div
        ref={ref}
        style={{ position: "relative" }}
        className="dashContent-container"
      >
        {converter ? (
          <Fragment>
            <CurrencyConverter
              info={info}
              from={from}
              setFrom={setFrom}
              HandleOpenConverter={HandleOpenConverter}
            />
          </Fragment>
        ) : null}
        <div onClick={handlePrice} className="tjm-button">
          <button
            className="tjmButtonActif"
            disabled={tjm !== 0 ? true : false}
          >
            <img
              title={
                tjm === 0
                  ? "Your Daily rate here!"
                  : "Erase your Daily rate before enter an other"
              }
              data-toggle="tooltip"
              data-placement="left"
              className={tjm === 0 ? "priceIcon" : "priceIcon sepia"}
              src={PriceIcon}
              alt="price"
              style={{
                width: 44,

                cursor: "pointer",
              }}
            />
          </button>
        </div>
        {!converter ? (
          <div className="priceContainer">
            <img
              onClick={() => setTjm(0)}
              className={tjm !== 0 ? "eraseTjmButton" : "none"}
              title="Erase your Daily rate here!"
              data-toggle="tooltip"
              data-placement="left"
              src={supp}
              alt="suppr"
              style={{ width: 16 }}
            />

            <span className="priceTextContainer">
              <p>
                {!changeDevise ? "€" : "$"}
                {changeDevise ? tjm : cutDecimals(totalEuro, 2)}
              </p>
              <p>
                {changeDevise ? "€" : "$"}
                {changeDevise
                  ? cutDecimals(totalEuro, 2)
                  : !changeDevise
                  ? tjm
                  : 0}
              </p>
            </span>
            <button
              onClick={handleChangeDevise}
              style={{
                width: 35,
                marginLeft: 25,
                background: "transparent",
                border: "none",
              }}
            >
              <img
                className="bump"
                title={
                  changeDevise
                    ? "You are in Dollars, you can change the value to Euros"
                    : "You are in Euros, you can change the value to Dollars"
                }
                data-toggle="tooltip"
                data-placement="left"
                src={changeDevise ? DollarIcon : EuroIcon}
                alt=""
                style={{ width: 35 }}
              />
            </button>
          </div>
        ) : null}

        <div className="dashContainer-header">
          <div className="dashContainer-content-header">
            <strong>Total Time:</strong>
            <p style={{ fontWeight: "bold", fontSize: 25 }}>
              {cutDecimals(totalTimeLocalStore / 3600, 2)}{" "}
              <sub style={{ fontSize: 11, fontStyle: "italic" }}>hours</sub>
            </p>
            <hr />
            <p style={{ fontWeight: "bold", fontSize: 25 }}>
              {!changeDevise ? "€" : "$"}
              {changeDevise
                ? cutDecimals(tjm / 8, 2)
                : cutDecimals(tjm / 8 / changeEurDoll, 2)}{" "}
              <sub style={{ fontSize: 11, fontStyle: "italic" }}>per hour</sub>
            </p>
          </div>
          <div className="dashContainer-content-header">
            <strong>Total days work:</strong>{" "}
            <p style={{ fontWeight: "bold", fontSize: 25 }}>
              {cutDecimals(totalTimeLocalStore / 28800, 2)}{" "}
              <sub style={{ fontSize: 11, fontStyle: "italic" }}>days</sub>
            </p>
            <hr />
            <p style={{ fontWeight: "bold", fontSize: 25 }}>
              {!changeDevise ? "€" : "$"}
              {changeDevise
                ? cutDecimals((tjm * totalTimeLocalStore) / 28800, 2)
                : cutDecimals(
                    (tjm * totalTimeLocalStore) / 28800 / changeEurDoll,
                    2
                  )}{" "}
              <sub style={{ fontSize: 11, fontStyle: "italic" }}>total</sub>
            </p>
          </div>
          <div className="dashContainer-content-header">
            <strong> Number Tasks:</strong>{" "}
            {stockItemsByStatus && (
              <Fragment>
                <p style={{ fontWeight: "bold", fontSize: 25 }}>
                  {stockItemsByStatus["Done"].length}{" "}
                  <sub style={{ fontSize: 11, fontStyle: "italic" }}>tasks</sub>
                </p>
                <hr />
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{ color: "white", fontWeight: "bold", fontSize: 25 }}
                  >
                    {cutDecimals(totalTimeLocalStore / 3600 / taskPerHour, 2)}
                  </p>
                  <sub style={{ fontSize: 11, color: "white" }}>hour/task</sub>
                </span>
              </Fragment>
            )}
          </div>
        </div>
        <br />
        <span className="statsTitle">
          {" "}
          <img
            style={{ marginRight: 12 }}
            src={DashIcon}
            alt="start"
            width="48"
          />
          <span className="dashTask-title">Stats</span>
        </span>
        <div className="tasks-dash graphs">
          <div className="todo-dash">
            <div className="list-dash graphDash">
              <FirstChart cumuledTimeCards={cumuledTimeCards} />
            </div>
          </div>
          <div className="inProgress-dash">
            <div className="list-dash graphDash">
              <SecondChart cumuledTimeCards={cumuledTimeCards} />
            </div>
          </div>
          <div className="done-dash">
            <div className="list-dash graphDash">
              <LastChart />
            </div>
          </div>
        </div>
        <div className="tasks-dash bottomSection">
          <div className="todo-dash">
            <span>
              {" "}
              <img
                style={{ marginRight: 12 }}
                src={ProjectIcon}
                alt="start"
                width="48"
              />
              <span className="dashTask-title">Sticky Notes</span>
            </span>
            <div className="list-dash stickyNotes">
              <div className="stickyListNoteDash">
                {Note1Content ? (
                  <Fragment>
                    <span style={{ color: "darkblue", fontWeight: "bold" }}>
                      Sticky Note:1
                    </span>
                    <br />
                    <span>{Note1Content}</span>
                  </Fragment>
                ) : (
                  <strong style={{ color: "darkred" }}>None</strong>
                )}
              </div>
              <div className="stickyListNoteDash">
                {Note2Content ? (
                  <Fragment>
                    <span style={{ color: "darkblue", fontWeight: "bold" }}>
                      Sticky Note:2
                    </span>
                    <br />
                    <span>{Note2Content}</span>
                  </Fragment>
                ) : (
                  <strong style={{ color: "darkred" }}>None</strong>
                )}
              </div>
              <div className="stickyListNoteDash">
                {Note3Content ? (
                  <Fragment>
                    <span style={{ color: "darkblue", fontWeight: "bold" }}>
                      Sticky Note:3
                    </span>
                    <br />
                    <span>{Note3Content}</span>
                  </Fragment>
                ) : (
                  <strong style={{ color: "darkred" }}>None</strong>
                )}
              </div>

              <div className="stickyListNoteDash">
                {Note4Content ? (
                  <Fragment>
                    <span style={{ color: "darkblue", fontWeight: "bold" }}>
                      Sticky Note:4
                    </span>
                    <br />
                    <span>{Note4Content}</span>
                  </Fragment>
                ) : (
                  <strong style={{ color: "darkred" }}>None</strong>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="inProgress-dash">
          <span>
            {" "}
            <img
              style={{ marginRight: 12 }}
              src={TasksIcon}
              alt="start"
              width="48"
            />
            <span className="dashTask-title">Number working connexion</span>
          </span>
          <div className="list-dash workingConnexion">
            <div className="workingConnexionContent">
              <img
                style={{ marginRight: 12 }}
                src={WorkingConnexionIcon}
                alt="start"
                width="34"
              />
              {isNaN(connexionNumber) === false ? (
                <span>
                  Working connexion:{" "}
                  {cutDecimals(
                    connexionNumber / stockItemsByStatus["Done"].length,
                    0
                  )}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="tasks-dash cardsRapport">
          <div className="done-dash">
            <span>
              <img
                style={{ marginRight: 12 }}
                src={CompletedIcon}
                alt="start"
                width="44"
              />
              <span className="dashTask-title">Tasks Done</span>
            </span>
            {stockItemsByStatus && (
              <div className="list-dash">
                {stockItemsByStatus["Done"].length > 0 ? (
                  stockItemsByStatus["Done"].map((res, i) => (
                    <ul key={uuidv4()}>
                      <li>
                        <strong style={{ fontSize: 17 }}>
                          Name: {res.title}
                        </strong>
                        <p>id :{res.id}</p>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            fontStyle: "italic",
                          }}
                        >
                          desc: {res.description}
                        </p>
                        <span className="createdTaskDash">
                          <img src={CreatedIcon} alt="start" width="28" />
                          <p style={{ fontSize: 12, margin: 6, color: "blue" }}>
                            Created: {res.timestamp}
                          </p>
                        </span>
                      </li>
                    </ul>
                  ))
                ) : (
                  <strong style={{ color: "darkred", fontWeight: "bold" }}>
                    No tasks in this section
                  </strong>
                )}
              </div>
            )}
          </div>
          <div className="todo-dash">
            <span>
              {" "}
              <img
                style={{ marginRight: 12 }}
                src={HourGlassIcon}
                alt="start"
                width="44"
              />
              <span className="dashTask-title">
                Working session that required more than 2 hours
              </span>
            </span>
            <div className="list-dash">
              {finishedDatas !== [] ? (
                totalTimeSeconds &&
                totalTimeSeconds
                  .filter((totMax) => totMax.total >= 7200)
                  .map((res, i) => (
                    <ul key={uuidv4()}>
                      {isNaN(res.total) === false ? (
                        <li>
                          <strong>{res.title}</strong>
                          <br />
                          <sub>{res.id}</sub>
                          <br />
                          <span className="timeContent">
                            <img
                              style={{ marginRight: 12 }}
                              src={AdjustIcon}
                              alt="start"
                              width="24"
                            />
                            <p style={{ fontSize: 15, fontWeight: "bold" }}>
                              {new Date(res.total * 1000)
                                .toISOString()
                                .substr(11, 8)}{" "}
                              hour(s)
                            </p>
                          </span>
                        </li>
                      ) : null}
                    </ul>
                  ))
              ) : (
                <strong style={{ color: "darkred", fontWeight: "bold" }}>
                  No Working session in this section
                </strong>
              )}
            </div>
          </div>
          <div className="todo-dash">
            <span>
              <img
                style={{ marginRight: 12 }}
                src={ChronoIcon}
                alt="start"
                width="44"
              />
              <span className="dashTask-title">
                Working session that required between 1 and 2 hour(s)
              </span>
            </span>
            <div className="list-dash">
              {finishedDatas !== [] ? (
                totalTimeSeconds &&
                totalTimeSeconds
                  .filter(
                    (totMax) => totMax.total >= 3600 && totMax.total < 7200
                  )
                  .map((res, i) => (
                    <ul key={uuidv4()}>
                      {isNaN(res.total) === false ? (
                        <li>
                          <strong>{res.title}</strong>
                          <br />
                          <sub>{res.id}</sub>
                          <br />
                          <span className="timeContent">
                            <img
                              style={{ marginRight: 12 }}
                              src={AdjustIcon}
                              alt="start"
                              width="24"
                            />
                            <p style={{ fontSize: 15, fontWeight: "bold" }}>
                              {new Date(res.total * 1000)
                                .toISOString()
                                .substr(11, 8)}{" "}
                              hour(s)
                            </p>
                          </span>
                        </li>
                      ) : null}
                    </ul>
                  ))
              ) : (
                <strong style={{ color: "darkred", fontWeight: "bold" }}>
                  No Working session in this section
                </strong>
              )}
            </div>
          </div>
          <div className="inProgress-dash">
            <span>
              <img
                style={{ marginRight: 12 }}
                src={ClockIcon}
                alt="start"
                width="48"
              />
              <span className="dashTask-title">
                Working session that required less than 1 hour
              </span>
            </span>
            <div className="list-dash less1hour">
              {finishedDatas !== [] ? (
                totalTimeSeconds &&
                totalTimeSeconds
                  .filter((totMax) => totMax.total > 0)
                  .filter((totMax) => totMax.total < 3600)
                  .map((res, i) => (
                    <ul key={uuidv4()}>
                      {isNaN(res.total) === false ? (
                        <li>
                          <strong>{res.title}</strong>
                          <br />
                          <sub>{res.id}</sub>
                          <br />
                          <span className="timeContent">
                            <img
                              style={{ marginRight: 12 }}
                              src={AdjustIcon}
                              alt="start"
                              width="24"
                            />
                            <p style={{ fontSize: 15, fontWeight: "bold" }}>
                              {new Date(res.total * 1000)
                                .toISOString()
                                .substr(11, 8)}{" "}
                              hour(s)
                            </p>
                          </span>
                        </li>
                      ) : null}
                    </ul>
                  ))
              ) : (
                <strong style={{ color: "darkred", fontWeight: "bold" }}>
                  No Working session in this section
                </strong>
              )}
            </div>
          </div>
          <div className="bottom-dash">
            <span>
              <img
                style={{ marginRight: 12 }}
                src={TimeIcon}
                alt="start"
                width="44"
              />
              <span className="dashTask-title">Time Elapsed For each Task</span>
              <sub>from the most recent session to the oldest</sub>
            </span>
            <div className="list-dash bottom">
              {mapRevers(completCardsTimeArray)
                .filter((resFiltered) => resFiltered.start !== "")
                .map((res) => (
                  <div key={uuidv4()}>
                    <strong>{res.cardTitle}</strong>
                    <br />
                    <span>
                      <img src={StartIcon} alt="start" width="34" />
                      <p style={{ fontWeight: "bold", color: "#57a957" }}>
                        Start: {res.start}
                      </p>
                    </span>
                    <img src={TimerEndIcon} alt="stop" width="34" />
                    <p style={{ fontWeight: "bold", color: "#ca3535" }}>
                      Stop: {res.stop}
                    </p>
                    <hr />
                  </div>
                ))}
            </div>
          </div>
        </div>

        <br />
        <div className="footerDash">
          <div className="copyrightContent">
            <img
              src={backlog}
              alt="backlog"
              width="34"
              style={{ marginRight: 10 }}
            />
            Copyright - 2021 © Created with React by{" "}
            <a
              className="linkName"
              title="Visit my WebSite if you want!"
              data-toggle="tooltip"
              data-placement="top"
              style={{ color: "rgb(121 204 82)" }}
              href="https://www.rodolphe-augusto.fr"
              target="new"
            >
              rodolphe Augusto
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
