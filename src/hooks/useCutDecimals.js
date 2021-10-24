const useCutDecimals = () => {
  function cutDecimals(number, decimals) {
    return number.toLocaleString("fullwide", {
      maximumFractionDigits: decimals,
    });
  }

  return {
    cutDecimals,
  };
};

export default useCutDecimals;
