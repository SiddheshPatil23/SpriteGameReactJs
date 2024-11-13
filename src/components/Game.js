import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import PreviewArea from "./PreviewArea";
import MidArea from "./MidArea";
import { addSprite, updateSprite } from "../store";

export default function Game() {
  const dispatch = useDispatch();
  const sprites = useSelector((state) => state.sprites.sprites);
  const boundaries = useSelector((state) => state.sprites.boundaries);

  return (
    <div className="bg-blue-100 pt-6 font-sans">
      <button onClick={() => dispatch(addSprite())} className="p-2 bg-green-500 text-white mb-4">
        Add Sprite
      </button>
      <div className="h-screen overflow-hidden flex flex-row">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar />
          <MidArea />
        </div>
        <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea />
        </div>
      </div>
    </div>
  );
}
