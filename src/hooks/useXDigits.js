const useXDigits = () => {
  const twoDigits = (num) => String(num).padStart(2, "0");
  const threeDigits = (num) => String(num).padStart(3, "0");
  return {
    twoDigits,
    threeDigits,
  };
};

export default useXDigits;
