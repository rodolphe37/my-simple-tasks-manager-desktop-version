import { atom } from "recoil";

const clickedConfigAtom = atom({
  key: "clickedConfigState",
  default: false,
});

export default clickedConfigAtom;
