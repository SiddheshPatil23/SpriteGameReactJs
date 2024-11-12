import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBoundaries, setSelectedSpriteId, updateSprite } from "../store";
import CatSprite from "./CatSprite";
import { useDrop } from "react-dnd";

function mergeRefs(...refs) {
  return (element) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    });
  };
}

export default function PreviewArea() {
  const previewRef = useRef(null);
  const dispatch = useDispatch();
  const sprites = useSelector((state) => state.sprites.sprites);
  const selectedSpriteId = useSelector((state) => state.sprites.selectedSpriteId);
  const boundaries = useSelector((state) => state.sprites.boundaries);

  useEffect(() => {
    if (previewRef.current) {
      const updateBoundaries = () => {
        const { offsetWidth, offsetHeight } = previewRef.current;
        if (offsetWidth !== boundaries.width || offsetHeight !== boundaries.height) {
          dispatch(setBoundaries({ width: offsetWidth, height: offsetHeight }));
        }
      };

      updateBoundaries();
      window.addEventListener("resize", updateBoundaries);

      return () => window.removeEventListener("resize", updateBoundaries);
    }
  }, [dispatch, previewRef, boundaries]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "SPRITE",
    drop: (item, monitor) => {
      const offset = monitor.getSourceClientOffset();
      if (offset && item.id && previewRef.current) {
  
        const containerRect = previewRef.current.getBoundingClientRect();

        const spriteWidth = 50;
        const spriteHeight = 50;

        const newPosX = Math.max(0, Math.min(boundaries.width - spriteWidth, offset.x - containerRect.left - spriteWidth / 2));
        const newPosY = Math.max(0, Math.min(boundaries.height - spriteHeight, offset.y - containerRect.top - spriteHeight / 2));

        dispatch(updateSprite({ id: item.id, deltaX: newPosX - item.position.x, deltaY: newPosY - item.position.y }));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={mergeRefs(previewRef, drop)}
      className="flex-none h-full overflow-hidden p-2"
      style={{
        position: "relative",
        width: `${boundaries.width}px`,
        height: `${boundaries.height}px`,
        border: "1px solid #ccc",
        backgroundColor: isOver ? "lightgreen" : "white",
      }}
    >
      {sprites.map((sprite) => (
        <CatSprite
          key={sprite.id}
          id={sprite.id}
          position={sprite.position}
          rotation={sprite.rotation}
          isSelected={sprite.id === selectedSpriteId}
          onClick={() => dispatch(setSelectedSpriteId(sprite.id))}
        />
      ))}
    </div>
  );
}
