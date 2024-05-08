import React, { useState, useEffect } from 'react'
import {
  Drawer, Switch,
} from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


const grid = 8;
const getListStyle = isDraggingOver => ({
  // background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: `${grid * 2}px 0`,
});

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: `${grid}px 24px ${grid}px 12px`,

  ...draggableStyle
});

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default function (props) {
  const { columns, visible, onClose, onUpdate  } = props;
  const items = columns;

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const results = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    onUpdate(results);
  }

  return <Drawer
    title="Table Columns Setting"
    placement="right"
    width={350}
    onClose={onClose}
    visible={visible}
    bodyStyle={{padding: 0}}
  >
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {items.map((item, index) => (
              <Draggable key={item.dataKey} draggableId={item.dataKey} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                    className={snapshot.isDragging ? "dragItem dragging" : "dragItem"}
                  >
                    <span className="dragIcon" />
                    {item.title}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  </Drawer>
}
