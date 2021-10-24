import React, { Fragment, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useRecoilState } from "recoil";
import projectDoneAtom from "../../statesManager/atoms/projectDoneAtom";
import Loader from "../loader/Loader";

const options = {
  indexAxis: "y",
  // Elements options apply to all of the options unless overridden in a dataset
  // In this case, we are setting the border of each horizontal bar to be 2px wide
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    // legend: {
    //   position: "right",
    // },
    // title: {
    //   display: true,
    //   text: "Chart.js Horizontal Bar Chart",
    // },
  },
};

const HorizontalBarChart = () => {
  const [dataTasks, setDataTasks] = useState(
    JSON.parse(localStorage.getItem("counts")) || []
  );

  const [projectDone] = useRecoilState(projectDoneAtom);

  function getDatas() {
    try {
      if (!dataTasks || localStorage.getItem("counts") !== null) {
        setDataTasks(JSON.parse(localStorage.getItem("counts")));
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (projectDone) {
      getDatas();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectDone]);

  const data = {
    labels: Object.keys(dataTasks),
    datasets: [
      {
        label: "Number of work sessions per task",
        data: Object.values(dataTasks),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Fragment>
        <div className="header">
          <h1 className="title">Number of work sessions per task </h1>
          <sub style={{ fontWeight: "bold" }}>
            (Task name on the left and number of work sessions on the bottom)
          </sub>
        </div>
        {!dataTasks ? <Loader /> : <Bar data={data} options={options} />}
      </Fragment>
    </>
  );
};

export default HorizontalBarChart;
