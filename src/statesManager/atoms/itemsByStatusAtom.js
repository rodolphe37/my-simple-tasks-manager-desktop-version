import { atom } from "recoil";

const itemsByStatusAtom = atom({
  key: "itemsByStatusState",
  default:
    localStorage.getItem("itemsByStatus") !== null
      ? JSON.parse(localStorage.getItem("itemsByStatus"))
      : [],
});

export default itemsByStatusAtom;
