import { useEffect, useState } from "react";
import Dropdown from "react-dropdown";
import { HiSwitchHorizontal } from "react-icons/hi";
import "react-dropdown/style.css";
import "./CurrencyConverter.css";
import supp from "../assets/supp.svg";

function CurrencyConverter({ info, from, setFrom, HandleOpenConverter }) {
  // Initializing all the state variables
  const [input, setInput] = useState(0);
  const [to, setTo] = useState("usd");
  const [options, setOptions] = useState([]);
  const [output, setOutput] = useState(0);

  // Calling the convert function whenever
  // a user switches the currency
  useEffect(() => {
    setOptions(Object.keys(info));
    convert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info]);

  // Function to convert the currency
  function convert() {
    let rate = info[to];
    setOutput(input * rate);
  }

  // Function to switch between two currency
  function flip() {
    let temp = from;
    setFrom(to);
    setTo(temp);
  }

  return (
    <div className="CurrencyConverter slide-in-top ">
      <img
        onClick={HandleOpenConverter}
        className="eraseTjmButton"
        title="Close Currency Converter window"
        data-toggle="tooltip"
        data-placement="left"
        src={supp}
        alt="suppr"
        style={{ width: "16px" }}
      />
      <div className="heading">
        <h1>Currency converter</h1>
      </div>
      <div className="container-converter">
        <div className="left">
          <h3>Amount</h3>
          <input
            type="text"
            placeholder="Enter the amount"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="middle">
          <h3>From</h3>
          <Dropdown
            options={options}
            onChange={(e) => {
              setFrom(e.value);
            }}
            value={from}
            placeholder="From"
          />
        </div>
        <div className="switch">
          <HiSwitchHorizontal
            size="30px"
            onClick={() => {
              flip();
            }}
          />
        </div>
        <div className="right">
          <h3>To</h3>
          <Dropdown
            options={options}
            onChange={(e) => {
              setTo(e.value);
            }}
            value={to}
            placeholder="To"
          />
        </div>
      </div>
      <div className="result">
        {/*<button
          onClick={() => {
            convert();
          }}
        >
          Convert
        </button>*/}
        <h2>Converted Amount:</h2>
        <p>{input + " " + from + " = " + output.toFixed(2) + " " + to}</p>
      </div>
    </div>
  );
}

export default CurrencyConverter;
