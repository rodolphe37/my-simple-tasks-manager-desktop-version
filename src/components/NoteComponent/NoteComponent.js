import { useEffect, useState } from "react";
import "./noteComponent.css";
import Erasericon from "../assets/eraser.svg";
import useCustomAlertHook from "../../hooks/useCustomAlertHook";

const NoteComponent = () => {
  const {
    setNewNote2,
    noteNumberToDisplay,
    setNoteNumberToDisplay,
    setNewNote3,
    setNewNote4,
    newNote2,
    newNote3,
    newNote4,
    valueNote1,
    valueNote2,
    valueNote3,
    valueNote4,
    setValueNote1,
    setValueNote2,
    setValueNote3,
    setValueNote4,
    handleEraseNoteOne,
    handleDeleteNote2,
    handleDeleteNote3,
    handleDeleteNote4,
  } = useCustomAlertHook();

  // eslint-disable-next-line no-unused-vars
  const [newNote1, setNewNote1] = useState(true);
  const [createButtonState, setCreateButtonState] = useState(true);

  const handleCreateNote2 = () => {
    setNewNote2((newNote2) => !newNote2);
    setNoteNumberToDisplay((prevState) => prevState + 1);
    localStorage.setItem("newNote2", true);
  };
  const handleCreateNote3 = () => {
    setNewNote3((newNote3) => !newNote3);
    setNoteNumberToDisplay((prevState) => prevState + 1);
    localStorage.setItem("noteNumberToDisplay", noteNumberToDisplay);
    localStorage.setItem("newNote3", true);
  };
  const handleCreateNote4 = () => {
    setNewNote4((newNote4) => !newNote4);
    setNoteNumberToDisplay((prevState) => prevState + 1);
    localStorage.setItem("noteNumberToDisplay", noteNumberToDisplay);
    localStorage.setItem("newNote4", true);
  };

  const handleCreateNotes = () => {
    if (newNote1 && !newNote2 && !newNote3 && !newNote4) {
      handleCreateNote2();
    }
    if (newNote1 && newNote2 && !newNote3 && !newNote4) {
      handleCreateNote3();
    }
    if (newNote1 && newNote2 && newNote3 && !newNote4) {
      handleCreateNote4();
    }
  };

  useEffect(() => {
    if (newNote1 && newNote2 && newNote3 && newNote4) {
      setCreateButtonState(false);
    }

    if (newNote1 && !newNote2 && !newNote3 && !newNote4) {
      setCreateButtonState(true);
    }
    if (valueNote1) {
      localStorage.setItem("valueNote1", valueNote1);
    }
    if (valueNote2) {
      localStorage.setItem("valueNote2", valueNote2);
    }
    if (valueNote3) {
      localStorage.setItem("valueNote3", valueNote3);
    }
    if (valueNote4) {
      localStorage.setItem("valueNote4", valueNote4);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueNote1, valueNote2, valueNote3, valueNote4, noteNumberToDisplay]);

  return (
    <div className="scale-in-ver-top" style={{ display: "flex", marginTop: 7 }}>
      <button
        style={{ position: "relative", zIndex: 5 }}
        disabled={createButtonState ? false : true}
        className={createButtonState ? "" : "opacity"}
        onClick={handleCreateNotes}
        id="create"
      >
        +
        <sub
          style={{
            fontSize: 22,
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 65,
            zIndex: 99,
            height: 16,
          }}
        >
          {noteNumberToDisplay}/4
        </sub>
      </button>
      <div
        style={{
          position: "relative",
          maxWidth: 520,
          maxHeight: 250,
        }}
      >
        <div style={{ position: "relative" }}>
          {valueNote1 ? (
            <button
              style={{ marginRight: 2 }}
              onClick={handleEraseNoteOne}
              className="button remove noColor"
            >
              <span className="infoEraser">
                <img
                  style={{ width: 24, marginLeft: -2, marginTop: -2 }}
                  src={Erasericon}
                  alt="eraser"
                />
                <span className="tooltip tooltipEraser">Erase content</span>
              </span>
            </button>
          ) : null}

          <textarea
            value={valueNote1}
            onChange={(e) => setValueNote1(e.target.value)}
          ></textarea>
        </div>
      </div>
      {newNote2 ? (
        <div style={{ position: "relative" }}>
          <button onClick={handleDeleteNote2} className="button remove">
            X
          </button>
          <textarea
            value={valueNote2}
            onChange={(e) => setValueNote2(e.target.value)}
          ></textarea>
        </div>
      ) : null}
      {newNote3 ? (
        <div
          style={{
            position: "relative",
            maxWidth: 520,
            maxHeight: 250,
          }}
        >
          <button onClick={handleDeleteNote3} className="button remove">
            X
          </button>
          <textarea
            value={valueNote3}
            onChange={(e) => setValueNote3(e.target.value)}
          ></textarea>
        </div>
      ) : null}
      {newNote4 ? (
        <div
          style={{
            position: "relative",
            maxWidth: 520,
            maxHeight: 250,
          }}
        >
          <button onClick={handleDeleteNote4} className="button remove">
            X
          </button>
          <textarea
            value={valueNote4}
            onChange={(e) => setValueNote4(e.target.value)}
          ></textarea>
        </div>
      ) : null}
    </div>
  );
};

export default NoteComponent;
