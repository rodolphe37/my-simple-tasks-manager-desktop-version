const useReverseArray = () => {
  function mapRevers(reverse) {
    let reversed = reverse.map(
      (num, index, reverse) => reverse[reverse.length - 1 - index]
    );
    return reversed;
  }
  return {
    mapRevers,
  };
};

export default useReverseArray;
