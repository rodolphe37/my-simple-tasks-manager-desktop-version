import { Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { Button, Card } from "antd";
import TaskboardItemCard from "./TaskboardItemCard";

const TaskboardColRoot = styled(Card)`
  user-select: none;
  flex: 1;
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  min-width: 0;
  box-shadow: 0 0 3px lightgrey;
  > .ant-card-body {
    overflow: hidden;
    height: 100%;
    padding: 0;
  }
`;

const DroppableRoot = styled.div`
  height: 100%;
  overflow-y: auto;
  background-color: ${({ isDraggingOver }) =>
    isDraggingOver ? "#e0e0e0" : "#f5f5f5"};
`;

function TaskboardCol({
  items,
  status,
  onClickAdd,
  onEdit,
  onDelete,
  itemsByStatus,
  setItemsByStatus,
}) {
  return (
    <TaskboardColRoot
      title={`${status} (${items.length})`}
      extra={
        onClickAdd && (
          <Button type="primary" onClick={onClickAdd}>
            Add
          </Button>
        )
      }
    >
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <DroppableRoot
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {items.map((item, index) => {
              return (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      key={item.id}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskboardItemCard
                        item={item}
                        itemsByStatus={itemsByStatus}
                        setItemsByStatus={setItemsByStatus}
                        items={itemsByStatus[status]}
                        status={status}
                        isDragging={snapshot.isDragging}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </DroppableRoot>
        )}
      </Droppable>
    </TaskboardColRoot>
  );
}

export default TaskboardCol;
