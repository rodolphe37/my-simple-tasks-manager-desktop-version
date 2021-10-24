import { atom } from "recoil";

const allNoteAtom = atom({
  key: "allNoteState",
  default:
    localStorage.getItem("allNote") !== null
      ? JSON.parse(localStorage.getItem("allNote"))
      : [],
});

export default allNoteAtom;
