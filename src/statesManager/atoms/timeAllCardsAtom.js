import { atom } from "recoil";

const timeAllCardsAtom = atom({
  key: "timeAllCardsState",
  default:
    localStorage.getItem("timeAllCards") !== null
      ? JSON.parse(localStorage.getItem("timeAllCards"))
      : [],
});

export default timeAllCardsAtom;
