import { atom } from "recoil";

const closedStateAtom = atom({
  key: "closedStateAState",
  default: false,
});

export default closedStateAtom;
