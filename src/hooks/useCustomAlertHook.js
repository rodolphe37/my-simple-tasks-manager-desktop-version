/* eslint-disable no-unused-vars */
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const STATUS = {
  STARTED: "Started",
  STOPPED: "Stopped",
};

const useCustomAlertHook = () => {
  const MySwal = withReactContent(Swal);

  const [status, setStatus] = useState(
    localStorage.getItem("status") === "Started"
      ? localStorage.getItem("status")
      : STATUS.STOPPED
  );

  const [secondsRemaining, setSecondsRemaining] = useState(
    JSON.parse(localStorage.getItem("time"))
  );
  const [projectName, setProjectName] = useState(
    localStorage.getItem("projectName") ?? ""
  );
  const [validateprojectName, setValidateProjectName] = useState(
    localStorage.getItem("validate") ?? false
  );
  const [clickedAlert, setClickedAlert] = useState(false);

  const [newNote2, setNewNote2] = useState(
    JSON.parse(localStorage.getItem("newNote2")) === true ? true : false
  );
  const [newNote3, setNewNote3] = useState(
    JSON.parse(localStorage.getItem("newNote3")) === true ? true : false
  );
  const [newNote4, setNewNote4] = useState(
    JSON.parse(localStorage.getItem("newNote4")) === true ? true : false
  );
  const [noteNumberToDisplay, setNoteNumberToDisplay] = useState(
    localStorage.getItem("noteNumberToDisplay") ?? 1
  );

  const [valueNote1, setValueNote1] = useState(
    localStorage.getItem("valueNote1") ?? ""
  );
  const [valueNote2, setValueNote2] = useState(
    localStorage.getItem("valueNote2") ?? ""
  );
  const [valueNote3, setValueNote3] = useState(
    localStorage.getItem("valueNote3") ?? ""
  );
  const [valueNote4, setValueNote4] = useState(
    localStorage.getItem("valueNote4") ?? ""
  );

  const [tjm, setTjm] = useState(localStorage.getItem("tjm") ?? 0);

  // TIMETRACKER COMPONENT
  const handleReset = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reset it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setStatus(STATUS.STOPPED);
        localStorage.removeItem("time");
        setSecondsRemaining(0);
        Swal.fire(
          "Reinitialized!",
          "the Time Tracker is well reset.",
          "success"
        );
        window.location.reload();
      }
    });
  };
  // ALERTCOMPONENT
  const deteleAll = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reset it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Reinitialized!",
          "the Time Tracker is well reset.",
          "success"
        );
        setProjectName("");
        localStorage.clear();
        setValidateProjectName(false);
        setClickedAlert(false);

        window.location.reload();
      }
    });
  };

  // NOTECOMPONENT
  const handleDeleteNote2 = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setNewNote2(false);
        setNoteNumberToDisplay((prevState) => prevState - 1);
        localStorage.setItem("noteNumberToDisplay", noteNumberToDisplay);
        setValueNote2("");
        localStorage.removeItem("valueNote2");
        localStorage.setItem("newNote2", false);
        MySwal.fire("Deleted!", "Your note has been deleted.", "success");
      }
    });
  };
  const handleDeleteNote3 = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setNewNote3(false);
        setNoteNumberToDisplay((prevState) => prevState - 1);
        localStorage.setItem("noteNumberToDisplay", noteNumberToDisplay);
        setValueNote3("");
        localStorage.removeItem("valueNote3");
        localStorage.setItem("newNote3", false);
        MySwal.fire("Deleted!", "Your note has been deleted.", "success");
      }
    });
  };
  const handleDeleteNote4 = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setNewNote4(false);
        setNoteNumberToDisplay((prevState) => prevState - 1);
        localStorage.setItem("noteNumberToDisplay", noteNumberToDisplay);
        setValueNote4("");
        localStorage.removeItem("valueNote4");
        localStorage.setItem("newNote4", false);
        MySwal.fire("Deleted!", "Your note has been deleted.", "success");
      }
    });
  };
  const handleEraseNoteOne = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setValueNote1("");
        localStorage.removeItem("valueNote1");
        MySwal.fire("Erased!", "Your note has been erased.", "success");
      }
    });
  };

  // TASKBOARDCOMPONENT
  const finishedProjectAlert = () => {
    setTimeout(() => {
      MySwal.fire({
        position: "top-end",
        icon: "success",
        title: "Your project has been finished!",
        text: "You can check the dashboard for information & statistics of your work done!",
        footer: "Always Just for better organization",
        showConfirmButton: false,
        timer: 4200,
      });
    }, 1000);
  };

  // DASHBOARDCOMPONENT
  const handlePrice = () => {
    MySwal.fire({
      title: "Enter your Daily Rate in dollars",
      input: "number",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Look up",
      // showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log(result);
        setTjm(result.value);
        Swal.fire("Saved!", "Your daily rate has been saved.", "success");
      }
    });
  };

  return {
    handleReset,
    deteleAll,
    setClickedAlert,
    setNewNote2,
    noteNumberToDisplay,
    setNoteNumberToDisplay,
    setNewNote3,
    setNewNote4,
    newNote2,
    newNote3,
    newNote4,
    handleEraseNoteOne,
    handleDeleteNote2,
    handleDeleteNote3,
    handleDeleteNote4,
    valueNote1,
    valueNote2,
    valueNote3,
    valueNote4,
    setValueNote1,
    setValueNote2,
    setValueNote3,
    setValueNote4,
    finishedProjectAlert,
    tjm,
    setTjm,
    handlePrice,
  };
};

export default useCustomAlertHook;
