const useHmsToSeconds = () => {
  function hmsToSecondsOnly(str) {
    let p = str.split(":"),
      s = 0,
      m = 1;
    while (p.length > 0) {
      s += m * parseInt(p.pop(), 10);
      m *= 60;
    }
    return s;
  }
  return {
    hmsToSecondsOnly,
  };
};

export default useHmsToSeconds;
