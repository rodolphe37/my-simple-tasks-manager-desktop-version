import { atom } from "recoil";

const completCardsTimeArrayAtom = atom({
  key: "completCardsTimeArrayState",
  default:
    localStorage.getItem("completCardsTimeArray") !== null
      ? JSON.parse(localStorage.getItem("completCardsTimeArray"))
      : [],
});

export default completCardsTimeArrayAtom;
