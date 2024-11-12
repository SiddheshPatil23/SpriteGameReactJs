import { configureStore, createSlice } from "@reduxjs/toolkit";

const spritesSlice = createSlice({
  name: "sprites",
  initialState: {
    sprites: [{ id: 1, position: { x: 0, y: 0 }, rotation: 0 }],
    selectedSpriteId: 1,
    boundaries: { width: 500, height: 500 }
  },
  reducers: {
    addSprite: (state) => {
      if (state.sprites.length < 2) {
        state.sprites.push({ id: state.sprites.length + 1, position: { x: 150, y: 0 }, rotation: 0 });
      }
    },
    updateSprite: (state, action) => {
      const { id, deltaX = 0, deltaY = 0, deltaRotation = 0 } = action.payload;
      const sprite = state.sprites.find((sprite) => sprite.id === id);
      if (sprite) {
        const boundaries = state.boundaries;
        sprite.position.x = Math.max(0, Math.min(boundaries.width - 50, sprite.position.x + deltaX));
        sprite.position.y = Math.max(0, Math.min(boundaries.height - 50, sprite.position.y + deltaY));
        sprite.rotation = (sprite.rotation + deltaRotation) % 360;
      }
    },
    setBoundaries: (state, action) => {
      state.boundaries = action.payload;
    },
    setSelectedSpriteId: (state, action) => {
      const id = action.payload;
      const spriteExists = state.sprites.some(sprite => sprite.id === id);
      if (spriteExists) state.selectedSpriteId = id;
    }
  }
});

export const {
  addSprite,
  updateSprite,
  setBoundaries,
  setSelectedSpriteId
} = spritesSlice.actions;

const store = configureStore({
  reducer: {
    sprites: spritesSlice.reducer
  }
});

export default store;
