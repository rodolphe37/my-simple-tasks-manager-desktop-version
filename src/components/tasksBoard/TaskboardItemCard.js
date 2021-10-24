import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Modal, Typography, Dropdown, Menu, Form } from "antd";
import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import { red } from "@ant-design/colors";
import styled from "styled-components";
import BaseTooltip from "../shared/BaseTooltip";
import Checklist from "../assets/arrows.svg";
import List from "../assets/lists.svg";
import Clipboard from "../assets/clipboard.svg";
import { useRecoilState } from "recoil";
import TimerEndIcon from "../assets/timer.svg";
import StartIcon from "../assets/start.svg";
import { v4 as uuidv4 } from "uuid";
import completCardsTimeArrayAtom from "../../statesManager/atoms/completCardsTimeArrayAtom";
import projectDoneAtom from "../../statesManager/atoms/projectDoneAtom";
import finishedDatasAtom from "../../statesManager/atoms/finishedDatasAtom";
import useDateTime from "../../hooks/useDateTime";

const StyledCard = styled(Card)`
  margin: 0.5rem;
  padding: 0.5rem;
  background-color: ${({ $isDragging }) => ($isDragging ? "#fafafa" : "#fff")};
`;

const TaskboardItemCardTitle = styled(Typography.Title)`
  white-space: pre-wrap;
  margin-right: 0.25rem;
`;

const DeleteMenuItem = styled(Menu.Item)`
  color: ${red.primary};
`;

function TaskboardItemCard({
  item,
  status,
  isDragging,
  onEdit,
  onDelete,
  itemsByStatus,
}) {
  const { n } = useDateTime();

  const [completCardsTimeArray, setCompletCardsTimeArray] = useRecoilState(
    completCardsTimeArrayAtom
  );
  const [finishedDatas, setFinishedDatas] = useRecoilState(finishedDatasAtom);
  const [timeAllCards, setTimeAllCards] = useState([]);

  const [startWorkState, setStartWorkState] = useState(
    localStorage.getItem("startTimeWork") ?? ""
  );
  const [stopWorkState, setStopWorkState] = useState(
    localStorage.getItem("stopTimeWork") ?? ""
  );
  const [cardId, setCardId] = useState(0);

  let cardIdFromTimeAll = timeAllCards.map((res) =>
    JSON.parse(`${res.cardId}`)
  );

  const [projectDone, setProjectDone] = useRecoilState(projectDoneAtom);

  const TotalTimeStart = completCardsTimeArray
    .filter((res) => res.start)
    .map((result) => result.start !== "");

  const TotalTimeStop = completCardsTimeArray
    .filter((res) => res.stop)
    .map((result) => result.stop !== "");

  let tasksCount =
    itemsByStatus["In Progress"].length === 0 &&
    itemsByStatus["To Do"].length === 0 &&
    itemsByStatus["Done"].length !== 0;

  useEffect(() => {
    if (tasksCount) {
      setTimeout(() => {
        setProjectDone(true);
        localStorage.setItem("ProjectDone", true);
      }, 1000);
      localStorage.setItem(
        "finishedData",
        JSON.stringify(completCardsTimeArray)
      );
    } else {
      setProjectDone(false);
      localStorage.setItem("ProjectDone", false);
      localStorage.removeItem("finishedData");
    }
    if (localStorage.getItem("finishedData") !== null && !projectDone)
      setFinishedDatas(JSON.parse(localStorage.getItem("finishedData")));
  }, [
    setProjectDone,
    itemsByStatus,
    projectDone,
    completCardsTimeArray,
    tasksCount,
    setFinishedDatas,
  ]);

  useEffect(() => {
    if (status === "In Progress") {
      setStartWorkState(n);
      setTimeAllCards([
        { cardId: item.id, cardTitle: item.title, start: `${n}`, stop: "" },
      ]);
      localStorage.setItem("startTimeWork", startWorkState);
      localStorage.setItem("timeAllCards", JSON.stringify(timeAllCards));
    }

    if (!projectDone && finishedDatas !== []) {
      if (status === "Done") {
        setCardId(cardIdFromTimeAll);
        setStopWorkState(n);
        setStartWorkState(localStorage.getItem("startTimeWork"));

        setTimeAllCards([
          {
            cardId: item.id,
            cardTitle: item.title,
            start: startWorkState,
            stop: `${n}`,
            uuid: uuidv4(),
          },
        ]);

        if (
          Number(item.id) !== cardId[0] &&
          TotalTimeStart !== "" &&
          TotalTimeStop !== ""
        ) {
          setCompletCardsTimeArray((completCardsTimeArray) =>
            completCardsTimeArray.concat(timeAllCards)
          );
        }

        localStorage.setItem(
          "completCardsTimeArray",
          JSON.stringify(completCardsTimeArray)
        );

        if (!stopWorkState) {
          localStorage.setItem("stopTimeWork", stopWorkState);
        }
      }
    }

    if (itemsByStatus["In Progress"].length === 0) {
      setTimeout(() => {
        localStorage.removeItem("startTimeWork");
      }, 1000);
      localStorage.removeItem("timeAllCards");
    }
    if (itemsByStatus["In Progress"].length !== 0) {
      localStorage.removeItem("clickedOnDashButton");
    }

    if (itemsByStatus["Done"].length === 0) {
      localStorage.removeItem("stopTimeWork");
      localStorage.removeItem("clickedOnDashButton");
    }

    if (JSON.parse(localStorage.getItem("timeAllCards")) !== null) {
      setTimeAllCards((prevState) => prevState, timeAllCards);
    }

    return () => {
      // localStorage.removeItem("startTimeWork");
      localStorage.removeItem("stopTimeWork");
      localStorage.removeItem("allCarsTime");
      localStorage.removeItem("timeAllCards");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    status,
    startWorkState,
    stopWorkState,
    completCardsTimeArray,
    item.id,
    projectDone,
  ]);

  return (
    <StyledCard
      $isDragging={isDragging}
      size="small"
      title={
        <BaseTooltip overlay={item.title}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TaskboardItemCardTitle
              key={uuidv4()}
              level={5}
              ellipsis={{ rows: 2 }}
            >
              {item.title}
            </TaskboardItemCardTitle>
          </span>
        </BaseTooltip>
      }
      extra={
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key={uuidv4()}
                icon={<EditOutlined />}
                onClick={() => onEdit(item)}
              >
                Edit
              </Menu.Item>
              <DeleteMenuItem
                key={uuidv4()}
                icon={<DeleteOutlined />}
                onClick={() =>
                  Modal.confirm({
                    title: "Delete?",
                    content: `Are you sure to delete "${item.title}"?`,
                    onOk: () =>
                      onDelete({
                        status,
                        itemToDelete: item,
                      }),
                  })
                }
              >
                Delete
              </DeleteMenuItem>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button size="small" icon={<MoreOutlined />} />
        </Dropdown>
      }
    >
      <BaseTooltip>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography.Paragraph
            key={uuidv4()}
            type="secondary"
            ellipsis={{ rows: 2 }}
          >
            {item.timestamp ?? "edit to set the Date/time"}
          </Typography.Paragraph>
          <div className="">
            {status === "In Progress" ? (
              <img style={{ width: 30 }} src={Checklist} alt="progress" />
            ) : null}
            {status === "To Do" ? (
              <img style={{ width: 24 }} src={List} alt="progress" />
            ) : null}
            {status === "Done" ? (
              <img style={{ width: 28 }} src={Clipboard} alt="progress" />
            ) : null}
          </div>
        </div>
      </BaseTooltip>
      <BaseTooltip overlay={item.description}>
        <Typography.Paragraph
          key={uuidv4()}
          type="secondary"
          ellipsis={{ rows: 2 }}
        >
          {item.description}
        </Typography.Paragraph>
      </BaseTooltip>
      {status === "In Progress" ? (
        <BaseTooltip overlay={item.startWork}>
          <Form>
            <hr />
            <div
              style={{
                height: "20px",
              }}
            >
              <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                <Form.Item
                  style={{ fontSize: 11 }}
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.additional !== curValues.additional
                  }
                >
                  {() => {
                    return (
                      <Form.Item key={uuidv4()}>
                        <img
                          style={{ width: 21, marginRight: 20 }}
                          src={StartIcon}
                          alt=""
                        />{" "}
                        {startWorkState}
                      </Form.Item>
                    );
                  }}
                </Form.Item>
              </Typography.Paragraph>
            </div>
          </Form>
        </BaseTooltip>
      ) : null}
      <div
        style={
          status === "Done"
            ? { border: "1px dotted gray", padding: 8 }
            : { display: "none" }
        }
      >
        {status === "Done" && !projectDone ? (
          <BaseTooltip key={uuidv4()} overlay={item.stopWork}>
            {completCardsTimeArray
              .filter((resu) => resu.start !== "")
              .map((res) => (
                <Form key={uuidv4()} className="myForm">
                  {item.id === res.cardId ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-around",
                        height: "20px",
                      }}
                    >
                      <Fragment>
                        <Form.Item key={uuidv4()}>
                          <p style={{ fontSize: 10 }}>{res.start}</p>
                        </Form.Item>
                        <Typography.Paragraph
                          type="secondary"
                          ellipsis={{ rows: 2 }}
                        >
                          <Form.Item
                            shouldUpdate={(prevValuesStop, curValuesStop) =>
                              prevValuesStop.additional !==
                              curValuesStop.additional
                            }
                          >
                            {() => {
                              return (
                                <Form.Item key={uuidv4()}>
                                  <p style={{ fontSize: 10 }}>{res.stop}</p>
                                </Form.Item>
                              );
                            }}
                          </Form.Item>
                        </Typography.Paragraph>
                      </Fragment>
                    </div>
                  ) : null}
                </Form>
              ))}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-around",
              }}
            >
              <img style={{ width: 28 }} src={StartIcon} alt="" />
              <img style={{ width: 28 }} src={TimerEndIcon} alt="" />
            </div>
          </BaseTooltip>
        ) : projectDone ? (
          <BaseTooltip key={uuidv4()} overlay={item.stopWork}>
            {finishedDatas
              .filter((resu) => resu.start !== "")
              .map((res) => (
                <Form key={uuidv4()} className="myForm">
                  {item.id === res.cardId ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-around",
                        height: "20px",
                      }}
                    >
                      <Fragment>
                        <Form.Item key={uuidv4()}>
                          <p style={{ fontSize: 10 }}>{res.start}</p>
                        </Form.Item>
                        <Typography.Paragraph
                          type="secondary"
                          ellipsis={{ rows: 2 }}
                        >
                          <Form.Item
                            shouldUpdate={(prevValuesStop, curValuesStop) =>
                              prevValuesStop.additional !==
                              curValuesStop.additional
                            }
                          >
                            {() => {
                              return (
                                <Form.Item key={uuidv4()}>
                                  <p style={{ fontSize: 10 }}>{res.stop}</p>
                                </Form.Item>
                              );
                            }}
                          </Form.Item>
                        </Typography.Paragraph>
                      </Fragment>
                    </div>
                  ) : null}
                </Form>
              ))}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-around",
              }}
            >
              <img style={{ width: 28 }} src={StartIcon} alt="" />
              <img style={{ width: 28 }} src={TimerEndIcon} alt="" />
            </div>
          </BaseTooltip>
        ) : null}
      </div>
    </StyledCard>
  );
}

export default TaskboardItemCard;
