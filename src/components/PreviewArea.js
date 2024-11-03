import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBoundaries, setSelectedSpriteId } from "../store";
import CatSprite from "./CatSprite";

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

  return (
    <div
      ref={previewRef}
      className="flex-none h-full overflow-hidden p-2"
      style={{
        position: "relative",
        width: "500px",
        height: "500px",
        border: "1px solid #ccc",
      }}
    >
      {sprites.map((sprite) => (
        <CatSprite
          key={sprite.id}
          position={sprite.position}
          rotation={sprite.rotation}
          isSelected={sprite.id === selectedSpriteId}
          onClick={() => dispatch(setSelectedSpriteId(sprite.id))}
        />
      ))}
    </div>
  );
}
