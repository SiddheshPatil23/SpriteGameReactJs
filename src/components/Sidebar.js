import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDrag } from "react-dnd";
import { updateSprite, setSelectedSpriteId } from "../store";
import Icon from "./Icon";

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

  const handleMove = () => {
    if (!selectedSpriteId) {
      console.warn("No sprite selected.");
      return;
    }

    const selectedSprite = sprites.find((sprite) => sprite.id === selectedSpriteId);
    if (selectedSprite) {
      const { rotation } = selectedSprite;
      const deltaX = 10 * Math.cos((rotation * Math.PI) / 180);
      const deltaY = 10 * Math.sin((rotation * Math.PI) / 180);
      dispatch(updateSprite({ id: selectedSpriteId, deltaX, deltaY }));
    }
  };

  const handleTurnLeft = () => {
    if (selectedSpriteId) {
      dispatch(updateSprite({ id: selectedSpriteId, deltaRotation: -15 }));
    } else {
      console.warn("No sprite selected.");
    }
  };

  const handleTurnRight = () => {
    if (selectedSpriteId) {
      dispatch(updateSprite({ id: selectedSpriteId, deltaRotation: 15 }));
    } else {
      console.warn("No sprite selected.");
    }
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
      <DraggableAction type="move" spriteId={selectedSpriteId} onClick={handleMove}>
        <div spriteId={selectedSpriteId} onClick={handleMove}className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
          {"Move 10 steps"}
        </div>
      </DraggableAction>
      <DraggableAction type="turnLeft" spriteId={selectedSpriteId} onClick={handleTurnLeft}>
        <div onClick={handleTurnLeft} className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
          {"Turn "}
          <Icon name="undo" size={15} className="text-white mx-2" />
          {"15 degrees"}
        </div>
      </DraggableAction>
      <DraggableAction type="turnRight" spriteId={selectedSpriteId} onClick={handleTurnRight}>
        <div onClick={handleTurnRight} className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
          {"Turn "}
          <Icon name="redo" size={15} className="text-white mx-2" />
          {"15 degrees"}
        </div>
      </DraggableAction>
    </div>
  );
}
