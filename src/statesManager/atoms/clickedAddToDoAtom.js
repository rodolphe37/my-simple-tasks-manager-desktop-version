import { atom } from "recoil";

const clickedAddToDoAtom = atom({
  key: "clickedAddToDoState",
  default: false,
});

export default clickedAddToDoAtom;
