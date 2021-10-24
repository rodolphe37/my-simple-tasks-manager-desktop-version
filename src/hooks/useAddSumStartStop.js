const useAddSumStartStop = () => {
  const addSumStartStop = (arr1, arr2, arrayToPush, id, title) => {
    arr1.forEach((num1, index) => {
      const num2 = arr2[index];
      // console.log("addition:", num1 - num2, index);

      arrayToPush.push({
        total: num1 - num2,
        id: id[index],
        title: title[index],
      });
    });

    localStorage.setItem("totalCounts", JSON.stringify(arrayToPush));
  };
  return {
    addSumStartStop,
  };
};

export default useAddSumStartStop;
