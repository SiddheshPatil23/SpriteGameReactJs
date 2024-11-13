import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDrag } from "react-dnd";
import { updateSprite, setMoveSteps, setTurnDegrees,selectedSpriteId, setSelectedSpriteId } from "../store";
import Icon from "./Icon";
import { calculateDelta } from "../utils";  

const DraggableAction = ({ type, spriteId, children }) => {
  const dispatch = useDispatch();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ACTION",
    item: { type, spriteId },  
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        padding: "8px",
        border: "1px solid gray",
        marginBottom: "4px",
      }}
      onClick={() => dispatch(setSelectedSpriteId(spriteId))} 
    >
      {children}
    </div>
  );
};

export default function Sidebar() {
  const dispatch = useDispatch();
  const selectedSpriteId = useSelector((state) => state.sprites.selectedSpriteId);
  const sprites = useSelector((state) => state.sprites.sprites);
  const moveSteps = useSelector((state) => state.sprites.moveSteps);      
  const turnDegrees = useSelector((state) => state.sprites.turnDegrees);  

  const handleMove = () => {
    if (!selectedSpriteId) {
      console.warn("No sprite selected.");
      return;
    }

    const selectedSprite = sprites.find((sprite) => sprite.id === selectedSpriteId);
    if (selectedSprite) {
      const { deltaX, deltaY } = calculateDelta(selectedSprite.rotation, moveSteps); 
      dispatch(updateSprite({ id: selectedSpriteId, deltaX, deltaY }));
    }
  };

  const handleTurnLeft = () => {
    if (selectedSpriteId) {
      dispatch(updateSprite({ id: selectedSpriteId, deltaRotation: -turnDegrees })); 
    } else {
      console.warn("No sprite selected.");
    }
  };

  const handleTurnRight = () => {
    if (selectedSpriteId) {
      dispatch(updateSprite({ id: selectedSpriteId, deltaRotation: turnDegrees }));
    } else {
      console.warn("No sprite selected.");
    }
  };

  const handleMoveInputChange = (e) => {
    dispatch(setMoveSteps(Number(e.target.value)));  
  };

  const handleTurnInputChange = (e) => {
    dispatch(setTurnDegrees(Number(e.target.value)));  
  };

  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <div className="font-bold"> {"Events"} </div>
      {sprites.map((sprite) => (
        <DraggableAction
          key={sprite.id}
          type="event"
          spriteId={sprite.id}
        >
          {`When clicked on Sprite ${sprite.id}`}
        </DraggableAction>
      ))}

      <div className="font-bold"> {"Motion"} </div>

      <label htmlFor="moveSteps">Move Steps:</label>
      <input
        id="moveSteps"
        type="number"
        value={moveSteps}
        onChange={handleMoveInputChange}
        className="border p-1 mb-2"
      />

      <DraggableAction type="move" spriteId={selectedSpriteId} onClick={handleMove}>
        <div onClick={handleMove} className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
          {"Move " + moveSteps + " steps"}
        </div>
      </DraggableAction>

      <label htmlFor="turnDegrees">Turn Degrees:</label>
      <input
        id="turnDegrees"
        type="number"
        value={turnDegrees}
        onChange={handleTurnInputChange}
        className="border p-1 mb-2"
      />

      <DraggableAction type="turnLeft" spriteId={selectedSpriteId} onClick={handleTurnLeft}>
        <div onClick={handleTurnLeft} className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
          {"Turn Left " + turnDegrees + " degrees"}
        </div>
      </DraggableAction>

      <DraggableAction type="turnRight" spriteId={selectedSpriteId} onClick={handleTurnRight}>
        <div onClick={handleTurnRight} className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
          {"Turn Right " + turnDegrees + " degrees"}
        </div>
      </DraggableAction>
    </div>
  );
}

