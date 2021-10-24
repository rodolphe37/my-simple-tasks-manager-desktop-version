import { atom } from "recoil";

const finishedDatasAtom = atom({
  key: "finishedDatasState",
  default:
    localStorage.getItem("finishedData") !== null
      ? JSON.parse(localStorage.getItem("finishedData"))
      : [],
});

export default finishedDatasAtom;
