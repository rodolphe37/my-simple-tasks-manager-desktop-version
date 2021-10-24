import { atom } from "recoil";

const currencyConverterAtom = atom({
  key: "currencyConverterState",
  default: false,
});

export default currencyConverterAtom;
