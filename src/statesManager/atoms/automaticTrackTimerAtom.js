import { atom } from "recoil";

const automaticTrackTimerAtom = atom({
  key: "automaticTrackTimerState",
  default:
    JSON.parse(localStorage.getItem("autoTrackTime")) === true ? true : false,
});

export default automaticTrackTimerAtom;
