import { DragDropContext } from "react-beautiful-dnd";
import { Fragment, useEffect, useMemo, useState } from "react";
import produce from "immer";
import styled from "styled-components";

import { TaskboardItemStatus } from "./TaskboardTypes";
import TaskboardItemModal from "./TasksBoardItemModal";
import TaskboardCol from "./TaskboardCol";
import { useSyncedState } from "../shared/SharedHooks";
import InfoMessage from "../infoMessage/InfoMessage";
import { useRecoilState } from "recoil";
import closedStateAtom from "../../statesManager/atoms/closedStateAtom";
import TimeTracker from "../timeTracker/TimeTracker";
import automaticTrackTimerAtom from "../../statesManager/atoms/automaticTrackTimerAtom";
import CustomConfirm from "../customConfirm/CustomConfirm";
import clickedAddToDoAtom from "../../statesManager/atoms/clickedAddToDoAtom";
import chevron from "../assets/chevron.svg";
import pinIcon from "../assets/pin.svg";
import pinGreen from "../assets/pin-green.svg";
import ButtonDashboard from "../dashboard/ButtonDashboard";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import projectDoneAtom from "../../statesManager/atoms/projectDoneAtom";
import useCustomAlertHook from "../../hooks/useCustomAlertHook";
import finishedDatasAtom from "../../statesManager/atoms/finishedDatasAtom";

const generateId = () => Date.now().toString();

const TaskboardRoot = styled.div`
  min-height: 0;
  height: 100%;
  min-width: 800px;
  max-width: 1400px;
  margin: auto;
`;

const TaskboardContent = styled.div`
  height: 100%;
  padding: 0.5rem;
  display: flex;
  justify-content: space-around;
`;

const defaultItems = {
  [TaskboardItemStatus.TO_DO]: [],
  [TaskboardItemStatus.IN_PROGRESS]: [],
  [TaskboardItemStatus.DONE]: [],
};

function Taskboard() {
  let newTaskArray = [];
  const [finishedDatas] = useRecoilState(finishedDatasAtom);
  const { finishedProjectAlert } = useCustomAlertHook();
  const MySwal = withReactContent(Swal);
  const [autoTrackTime] = useRecoilState(automaticTrackTimerAtom);
  const [projectDone] = useRecoilState(projectDoneAtom);
  const [itemsByStatus, setItemsByStatus] = useSyncedState(
    "itemsByStatus",
    defaultItems
  );
  const [closed] = useRecoilState(closedStateAtom);
  const [clickedOnDashButton] = useState(
    localStorage.getItem("clickedOnDashButton") ?? false
  );

  const [DoneAlert] = useState(
    localStorage.getItem("DoneAlert") !== null ? true : false
  );

  const { JSalert } = CustomConfirm();

  useEffect(() => {
    if (
      projectDone &&
      itemsByStatus["In Progress"].length === 0 &&
      itemsByStatus["To Do"].length === 0 &&
      localStorage.getItem("DoneAlert") === null
    ) {
      finishedProjectAlert();
      localStorage.setItem("DoneAlert", true);
    }

    if (!projectDone) {
      localStorage.removeItem("DoneAlert");
    }
    if (finishedDatas) {
      newTaskArray.push(finishedDatas.filter((res) => res.start !== ""));
    }

    if (projectDone && newTaskArray) {
      const counts = newTaskArray[0]
        .map((resu) => resu.cardTitle)
        .reduce(
          (acc, value) => ({
            ...acc,
            [value]: (acc[value] || 0) + 1,
          }),
          {}
        );
      localStorage.setItem("counts", JSON.stringify(counts));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectDone, MySwal, clickedOnDashButton, DoneAlert, itemsByStatus]);

  const handleDragEnd = ({ source, destination }) => {
    // console.log("destination", destination);
    if (
      itemsByStatus["In Progress"].length === 1 &&
      destination.droppableId === "In Progress"
    ) {
      JSalert();
    } else {
      setItemsByStatus((current) =>
        produce(current, (draft) => {
          // dropped outside the list
          if (!destination) {
            return;
          }
          const [removed] = draft[source.droppableId].splice(source.index, 1);
          draft[destination.droppableId].splice(destination.index, 0, removed);
        })
      );
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [itemToEdit, setItemToEdit] = useState(null);

  const openTaskItemModal = (itemToEdit) => {
    setItemToEdit(itemToEdit);
    setIsModalVisible(true);
  };

  const closeTaskItemModal = () => {
    setItemToEdit(null);
    setIsModalVisible(false);
    setClickedAddButton(false);
  };

  const handleDelete = ({ status, itemToDelete }) =>
    setItemsByStatus((current) =>
      produce(current, (draft) => {
        draft[status] = draft[status].filter(
          (item) => item.id !== itemToDelete.id
        );
      })
    );

  // set date for each message
  let d = new Date();
  let n = d.toLocaleString();

  const initialValues = useMemo(
    () => ({
      timestamp: itemToEdit?.timestamp ?? "",
      title: itemToEdit?.title ?? "",
      description: itemToEdit?.description ?? "",
      startWork: 0,
      stopWork: 0,
      totalTime: 0,
    }),
    [itemToEdit]
  );

  const statusOf = Object.values(TaskboardItemStatus).map((status) => status);

  const [clickedAddButton, setClickedAddButton] =
    useRecoilState(clickedAddToDoAtom);

  const [viewBottomToolbar, setViewBottomToolbar] = useState(false);

  useEffect(() => {
    const syncTrackTime = (values) => {
      setItemsByStatus((current) =>
        produce(current, (draft) => {
          // Editing existing item
          const draftItem = Object.values(draft);
          draftItem.startWork = n;
        })
      );
    };
    syncTrackTime();

    if (!projectDone) {
      localStorage.removeItem("stopArrayTimes");
      localStorage.removeItem("startArrayTimes");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues, statusOf, projectDone]);

  const handleViewBottomToolbar = () => {
    if (viewBottomToolbar) {
      setViewBottomToolbar(false);
    }
    if (!viewBottomToolbar) {
      setViewBottomToolbar(true);
    }
  };

  return (
    <>
      {localStorage.getItem("completCardsTimeArray") &&
      itemsByStatus["In Progress"].length === 0 &&
      itemsByStatus["Done"].length === 0 ? (
        <Fragment>
          <div className={closed ? "none" : "overlay"}></div>
          <InfoMessage
            type="warning"
            content="Do you want to delete the complete history of the time spent on the cards? "
            subContent="You won't be able to revert this!"
          />
        </Fragment>
      ) : null}
      <DragDropContext onDragEnd={handleDragEnd}>
        <TaskboardRoot>
          {itemsByStatus["In Progress"].length === 0 &&
          itemsByStatus["To Do"].length === 0 &&
          itemsByStatus["Done"].length !== 0 ? (
            <ButtonDashboard />
          ) : null}
          <TaskboardContent
            style={autoTrackTime ? { paddingBottom: "7em" } : {}}
          >
            {Object.values(TaskboardItemStatus).map((status) => (
              <TaskboardCol
                key={status}
                status={status}
                items={itemsByStatus[status]}
                itemsByStatus={itemsByStatus}
                setItemsByStatus={setItemsByStatus}
                onClickAdd={
                  status === TaskboardItemStatus.TO_DO
                    ? () => {
                        openTaskItemModal(null);
                        setClickedAddButton(true);
                      }
                    : undefined
                }
                setClickedAddButton={setClickedAddButton}
                clickedAddButton={clickedAddButton}
                onEdit={openTaskItemModal}
                onDelete={handleDelete}
              />
            ))}
          </TaskboardContent>
        </TaskboardRoot>
      </DragDropContext>

      {autoTrackTime ? (
        <div
          className={viewBottomToolbar ? "" : "slideBottom"}
          style={{ position: "absolute", bottom: 0, width: "100%" }}
        >
          <span className="chevron-container">
            <img
              className={
                viewBottomToolbar ? "chevronIcon rotate" : "chevronIcon"
              }
              src={chevron}
              alt="chevron"
              style={{ width: 22 }}
            />
          </span>
          <span className="pinIcon-container">
            <img
              onClick={handleViewBottomToolbar}
              className={viewBottomToolbar ? "pinIcon-green" : "pinIcon"}
              src={viewBottomToolbar ? pinGreen : pinIcon}
              alt="pin"
              style={{ width: 22 }}
            />
          </span>
          <TimeTracker itemsByStatus={itemsByStatus} />
        </div>
      ) : null}

      <TaskboardItemModal
        visible={isModalVisible}
        onCancel={closeTaskItemModal}
        onOk={(values) => {
          setItemsByStatus((current) =>
            produce(current, (draft) => {
              // console.log("current", current);
              if (itemToEdit) {
                // Editing existing item
                const draftItem = Object.values(draft)
                  .flatMap((items) => items)
                  .find((item) => item.id === itemToEdit.id);
                if (draftItem) {
                  draftItem.timestamp = n;
                  draftItem.title = values.title;
                  draftItem.description = values.description;
                  draftItem.startWork = values.startWork;
                }
              } else {
                // Adding new item as "to do"
                draft[TaskboardItemStatus.TO_DO].push({
                  ...values,
                  id: generateId(),
                });
              }
            })
          );
        }}
        initialValues={initialValues}
      />
    </>
  );
}

export default Taskboard;
