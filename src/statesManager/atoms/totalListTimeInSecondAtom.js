import { atom } from "recoil";

const totalListTimeInSecondAtom = atom({
  key: "totalListTimeInSecondState",
  default:
    localStorage.getItem("totalTimeInSeconds") !== null
      ? JSON.parse(localStorage.getItem("totalTimeInSeconds"))
      : [],
});

export default totalListTimeInSecondAtom;
