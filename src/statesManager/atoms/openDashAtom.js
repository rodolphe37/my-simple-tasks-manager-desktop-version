import { atom } from "recoil";

const openDashAtom = atom({
  key: "openDashState",
  default: false,
});

export default openDashAtom;
