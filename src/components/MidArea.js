import React, { useState, useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { updateSprite } from "../store";

export default function MidArea() {
  const dispatch = useDispatch();
  const selectedSpriteId = useSelector((state) => state.sprites.selectedSpriteId);  
    const sprites = useSelector((state) => state.sprites.sprites);
  const [actionQueue, setActionQueue] = useState([]);

  const spritesRef = useRef(sprites);
  useEffect(() => {
    spritesRef.current = sprites;
  }, [sprites]);

  
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "ACTION",
    drop: (item) => {
      console.log(`[MidArea] Dropped item with type: ${item.type}`);
      setActionQueue((prevQueue) => [
        ...prevQueue,
        { type: item.type }
      ]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const executeActions = async () => {
    if (actionQueue.length === 0 || !selectedSpriteId) {
      console.warn("No actions in queue or no sprite selected.");
      return;
    }

    for (const action of [...actionQueue]) {
      const { type } = action;

      console.log(`[MidArea] Executing action type: ${type} on selected spriteId: ${selectedSpriteId}`);
      const sprite = spritesRef.current.find((sprite) => sprite.id === selectedSpriteId);
      if (!sprite) continue;

      if (type === "move") {
        const deltaX = 10 * Math.cos((sprite.rotation * Math.PI) / 180);
        const deltaY = 10 * Math.sin((sprite.rotation * Math.PI) / 180);
        dispatch(updateSprite({ id: selectedSpriteId, deltaX, deltaY }));
      } else if (type === "turnLeft") {
        dispatch(updateSprite({ id: selectedSpriteId, deltaRotation: -15 }));
      } else if (type === "turnRight") {
        dispatch(updateSprite({ id: selectedSpriteId, deltaRotation: 15 }));
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setActionQueue([]);  
  };

  return (
    <div
      ref={drop}
      className="flex-1 h-full overflow-auto border border-gray-200"
      style={{
        backgroundColor: isOver ? (canDrop ? "lightgreen" : "lightcoral") : "white",
      }}
    >
      <div>{"Mid Area - Drop actions here"}</div>
      <button
        onClick={executeActions}
        className="mt-2 p-2 bg-blue-500 text-white"
        disabled={actionQueue.length === 0}
      >
        Play Actions
      </button>
      <div>
        <h3>Queued Actions:</h3>
        <ul>
          {actionQueue.map((action, index) => (
            <li key={index}>{`${action.type} on Selected Sprite ID: ${selectedSpriteId}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
