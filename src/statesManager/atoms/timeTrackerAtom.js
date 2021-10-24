import { atom } from "recoil";

const timeTrackerAtom = atom({
  key: "timeTrackerState",
  default:
    localStorage.getItem("time") !== null ? localStorage.getItem("time") : 0,
});

export default timeTrackerAtom;
