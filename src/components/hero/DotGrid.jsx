/**
 * DotGrid - the interactive background decoration in the hero section.
 * 
 * It's a grid of dots that responds to clicks. When you click anywhere
 * on the grid, it creates a ripple-like animation spreading out from
 * the clicked dot.
 * 
 * Uses anime.js for the smooth animations.
 * 
 * The grid is 25 dots wide and 20 dots tall.
 */

import anime from "animejs";

// Grid dimensions
const GRID_WIDTH = 25;
const GRID_HEIGHT = 20;

const DotGrid = () => {
  // Handle clicks - triggers the ripple animation
  const handleDotClick = (e) => {
    anime({
      targets: ".dot-point",
      // Dots scale up and back down
      scale: [
        { value: 1.35, easing: "easeOutSine", duration: 250 },
        { value: 1, easing: "easeInOutQuad", duration: 500 },
      ],
      // Dots move up and back
      translateY: [
        { value: -15, easing: "easeOutSine", duration: 250 },
        { value: 1, easing: "easeInOutQuad", duration: 500 },
      ],
      // Opacity pulses
      opacity: [
        { value: 1, easing: "easeOutSine", duration: 250 },
        { value: 0.5, easing: "easeInOutQuad", duration: 500 },
      ],
      // Stagger creates the ripple effect - dots further from the click animate later
      delay: anime.stagger(100, {
        grid: [GRID_WIDTH, GRID_HEIGHT],
        from: e.target.dataset.index, // Start from the clicked dot
      }),
    });
  };

  // Build the dot grid
  const dots = [];
  let index = 0;

  for (let i = 0; i < GRID_WIDTH; i++) {
    for (let j = 0; j < GRID_HEIGHT; j++) {
      dots.push(
        // Outer div handles hover state
        <div
          className="group cursor-crosshair rounded-full p-2 transition-colors hover:bg-zinc-600"
          data-index={index}
          key={`${i}-${j}`}
        >
          {/* Inner div is what animates */}
          <div
            className="dot-point h-2 w-2 rounded-full bg-gradient-to-b from-zinc-700 to-zinc-400 opacity-50 group-hover:from-green-400 group-hover:to-white"
            data-index={index}
          />
        </div>
      );
      index++;
    }
  }

  return (
    <div
      onClick={handleDotClick}
      style={{ gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)` }}
      className="absolute right-0 top-[50%] z-0 grid max-w-[75%] -translate-y-[50%]"
    >
      {dots}
    </div>
  );
};

export default DotGrid;
