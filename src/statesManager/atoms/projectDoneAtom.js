import { atom } from "recoil";

const projectDoneAtom = atom({
  key: "projectDoneState",
  default: false,
});

export default projectDoneAtom;
