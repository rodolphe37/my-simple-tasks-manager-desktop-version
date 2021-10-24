import React, { Fragment, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Loader from "../loader/Loader";

const VerticalBar = ({ cumuledTimeCards }) => {
  const [cumuledTitle, setCumuledTitle] = useState([]);
  const [cumuledTotal, setCumuledTotal] = useState([]);
  const tjm = localStorage.getItem("tjm");
  const [totalTimeLocalStore] = useState(localStorage.getItem("time"));
  let totalSumPrice = tjm * (totalTimeLocalStore / 28800);

  useEffect(() => {
    if (cumuledTimeCards) {
      setCumuledTitle([cumuledTimeCards.map((resTitle) => resTitle.title)]);
      setCumuledTotal([
        cumuledTimeCards.map(
          (resTotal) =>
            (resTotal.total /
              3600 /
              (totalSumPrice / (totalTimeLocalStore / 3600))) *
            100
        ),
      ]);
    }

    // console.log("cumuledTitle", cumuledTitle?.[0]);
    // console.log("cumuledTjm", cumuledTotal?.[0]);
    // console.log("totalSumPrice", totalSumPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumuledTimeCards, setCumuledTitle, setCumuledTotal]);

  const data = {
    labels: cumuledTitle?.[0],
    datasets: [
      {
        label: "Percentage of budget impact",
        data: cumuledTotal?.[0],
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

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };
  return (
    <>
      {!cumuledTimeCards ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="header">
            <h1 className="title">Budgetary impact for each task</h1>
            <sub>Impact expressed in %.</sub>
          </div>
          <Bar data={data} options={options} />
        </Fragment>
      )}
    </>
  );
};

export default VerticalBar;
