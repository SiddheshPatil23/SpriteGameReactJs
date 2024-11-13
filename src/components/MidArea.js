import React, { useState, useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { updateSprite } from "../store";
import { calculateDelta } from "../utils";  

export default function MidArea() {
  const dispatch = useDispatch();
  const selectedSpriteId = useSelector((state) => state.sprites.selectedSpriteId);  
  const sprites = useSelector((state) => state.sprites.sprites);
  const [actionQueue, setActionQueue] = useState([]);

  const [currentSpriteId, setCurrentSpriteId] = useState(selectedSpriteId);

  const spritesRef = useRef(sprites);
  useEffect(() => {
    spritesRef.current = sprites;
    console.log("Sprites: ", spritesRef.current)
  }, [sprites]);

  const selectedSpriteIdRef = useRef(selectedSpriteId);
    useEffect(() => {
      selectedSpriteIdRef.current = selectedSpriteId;
    }, [selectedSpriteId]);

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "ACTION",
    drop: (item) => {
      console.log(`[MidArea] Dropped item with type: ${item.type}`);
      setActionQueue((prevQueue) => [
        ...prevQueue,
        { type: item.type, id: selectedSpriteIdRef.current }
      ]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));  

  const moveSteps = useSelector((state) => state.sprites.moveSteps);      
  const turnDegrees = useSelector((state) => state.sprites.turnDegrees);

  const executeActions = async () => {
    if (actionQueue.length === 0) {
      console.warn("No actions in queue.");
      return;
    }
  
    const actionsBySpriteId = actionQueue.reduce((acc, action) => {
      const { id } = action;
      if (!acc[id]) acc[id] = [];
      acc[id].push(action);
      return acc;
    }, {});
  
    const executeSpriteActions = async (spriteActions) => {
      for (const action of spriteActions) {
        const { type, id } = action;
  
        console.log(`[MidArea] Executing action type: ${type} on spriteId: ${id}`);
        const sprite = spritesRef.current.find((sprite) => sprite.id === id);
        if (!sprite) continue;
  
        if (type === "move") {
          const { deltaX, deltaY } = calculateDelta(sprite.rotation, moveSteps);
          dispatch(updateSprite({ id, deltaX, deltaY }));
        } else if (type === "turnLeft") {
          dispatch(updateSprite({ id, deltaRotation: -turnDegrees }));
        } else if (type === "turnRight") {
          dispatch(updateSprite({ id, deltaRotation: turnDegrees }));
        }
  
        await new Promise((resolve) => setTimeout(resolve, 500)); 
      }
    };
  
    const actionPromises = Object.values(actionsBySpriteId).map((spriteActions) =>
      executeSpriteActions(spriteActions)
    );
  
    await Promise.all(actionPromises);
  
    setActionQueue([]); 
  };

  useEffect(()=>{
    console.log("Selected ID ", selectedSpriteId);
    console.log("Action ", actionQueue);
  }, [actionQueue])

  useEffect(()=>{
    setCurrentSpriteId(selectedSpriteId);
  }, [selectedSpriteId])

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
          {actionQueue
            .filter(action => action.id === selectedSpriteId) 
            .map((action, index) => (
              <li key={index}>{`${action.type} on Selected Sprite ID: ${selectedSpriteId}`}</li>
            ))}
        </ul>
      </div>
    </div>
  );
}
