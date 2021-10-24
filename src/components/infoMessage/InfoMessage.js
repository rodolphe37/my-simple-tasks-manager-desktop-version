import { useEffect } from "react";
import { useRecoilState } from "recoil";
import closedStateAtom from "../../statesManager/atoms/closedStateAtom";
import "./infoMessage.css";

// For this reusable component you have many choices of type, you have :
// danger - primary - success - warning - info -- This is pre formated style for all types of pop up message
const InfoMessage = ({ type, content, subContent }) => {
  const [closed, setClosed] = useRecoilState(closedStateAtom);

  const handleClose = () => {
    setClosed(true);
  };

  const handleErase = () => {
    localStorage.removeItem("completCardsTimeArray");
    setClosed(true);
    window.location.reload();
  };

  useEffect(() => {
    // console.log("closed:", closed);
  }, [closed]);
  return (
    <div className={closed ? "none" : "offlineMessCOntainer"}>
      <div className={` offline ${type} slide-in-bck-center`} role="alert">
        {type === "danger" || type === "warning" ? (
          <svg
            className="scale-in-center"
            id="exclamation-triangle-fill"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
          </svg>
        ) : type === "success" ? (
          <svg
            className="scale-in-center"
            id="check-circle-fill"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
          </svg>
        ) : type === "info" || type === "primary" ? (
          <svg
            className="scale-in-center"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            viewBox="0 0 16 16"
          >
            <path
              fill="currentColor"
              d="M8 0c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM9 13h-2v-2h2v2zM9 10h-2v-7h2v7z"
            ></path>
          </svg>
        ) : null}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            position: "relative",
          }}
        >
          <span className="content-infoMessage-text">
            <div style={{ fontWeight: "bold", color: "darkRed" }}>
              {content}
            </div>
            <br />
            <sub style={{ fontWeight: "bold", color: "red", fontSize: 14 }}>
              {subContent}
            </sub>
          </span>
          <div style={{ position: "absolute", right: 15 }}>
            <button
              className="small green button"
              onClick={handleErase}
              style={{ marginRight: 15 }}
            >
              Yes
            </button>
            <button className="small red button" onClick={handleClose}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoMessage;
