const useDateTime = () => {
  let d = new Date();
  let n = d.toLocaleString();
  return {
    n,
  };
};

export default useDateTime;
