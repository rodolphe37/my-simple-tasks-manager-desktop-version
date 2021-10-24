import { atom } from "recoil";

const cumulTimeCardsTaskAtom = atom({
  key: "cumulTimeCardsTaskState",
  default:
    localStorage.getItem("cumulTimeCardsTask") !== null
      ? JSON.parse(localStorage.getItem("cumulTimeCardsTask"))
      : [],
});

export default cumulTimeCardsTaskAtom;
