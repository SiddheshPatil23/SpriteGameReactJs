export function calculateDelta(rotation, steps = 50) {
    const deltaX = steps * Math.cos((rotation * Math.PI) / 180);
    const deltaY = steps * Math.sin((rotation * Math.PI) / 180);
    return { deltaX, deltaY };
  }
  