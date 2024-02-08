import { useCallback, useEffect, useState } from "react";

const config = {
  starAnimationDuration: 1500,
  minimumTimeBetweenStars: 55,
  minimumDistanceBetweenStars: 55,
  glowDuration: 0,
  maximumGlowPointSpacing: 10,
  colors: [
    "253 58 132",
    "253 58 132",
    "253 58 132",
    "255 166 141",
    "254 125 138",
    "255 255 255",
  ],
  sizes: ["1rem", "0.7rem", "1.2rem"],
  animations: ["fall-1", "fall-2", "fall-3"],
};

const calcDistance = (a, b) => {
  const diffX = b.x - a.x,
    diffY = b.y - a.y;

  return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
};

const calcElapsedTime = (start, end) => end - start;

const appendElement = (element) => document.body.appendChild(element);

const removeElement = (element, delay) =>
  setTimeout(() => document.body.removeChild(element), delay);

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const selectRandom = (items) => items[rand(0, items.length - 1)];

const px = (value) => `${value}px`;
const ms = (value) => `${value}ms`;

const useStarsAnimation = () => {
  const [last, setLast] = useState({
    starTimestamp: new Date().getTime(),
    starPosition: { x: 0, y: 0 },
    mousePosition: { x: 0, y: 0 },
  });

  let count = 0;

  const createStar = useCallback(
    (position) => {
      console.log("createStar");
      const star = document.createElement("span");
      const color = selectRandom(config.colors);

      star.className = "star";
      star.innerHTML = `<svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 20a1 1 0 0 1-.437-.1C11.214 19.73 3 15.671 3 9a5 5 0 0 1 8.535-3.536l.465.465.465-.465A5 5 0 0 1 21 9c0 6.646-8.212 10.728-8.562 10.9A1 1 0 0 1 12 20z"></path> </g></svg>`;

      star.style.left = px(position.x);
      star.style.top = px(position.y);
      star.style.width = selectRandom(config.sizes);
      star.style.height = selectRandom(config.sizes);
      star.style.color = `rgb(${color})`;
      star.style.textShadow = `0px 0px 1.5rem rgb(${color} / 0.5)`;
      star.style.animationName = config.animations[count++ % 3];
      star.style.animationDuration = ms(config.starAnimationDuration);

      appendElement(star);

      removeElement(star, config.starAnimationDuration);
    },
    [count]
  );

  const updateLastStar = (position) => {
    setLast((prev) => ({
      ...prev,
      starTimestamp: new Date().getTime(),
      starPosition: position,
    }));
  };

  const updateLastMousePosition = (position) =>
    setLast((prev) => ({ ...prev, mousePosition: position }));

  const adjustLastMousePosition = useCallback(
    (position) => {
      if (last.mousePosition.x === 0 && last.mousePosition.y === 0) {
        setLast((prev) => ({ ...prev, mousePosition: position }));
      }
    },
    [last.mousePosition.x, last.mousePosition.y]
  );

  const handleOnMove = useCallback(
    (e) => {
      const mousePosition = { x: e.clientX, y: e.clientY };

      adjustLastMousePosition(mousePosition);

      const now = new Date().getTime(),
        hasMovedFarEnough =
          calcDistance(last.starPosition, mousePosition) >=
          config.minimumDistanceBetweenStars,
        hasBeenLongEnough =
          calcElapsedTime(last.starTimestamp, now) >
          config.minimumTimeBetweenStars;

      if (hasMovedFarEnough || hasBeenLongEnough) {
        createStar(mousePosition);

        updateLastStar(mousePosition);
      }

      updateLastMousePosition(mousePosition);
    },
    [adjustLastMousePosition, createStar, last.starPosition, last.starTimestamp]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleOnMove);
    window.addEventListener("touchmove", (e) => handleOnMove(e.touches[0]));
    document.body.addEventListener("mouseleave", () =>
      updateLastMousePosition({ x: 0, y: 0 })
    );

    return () => {
      window.removeEventListener("mousemove", handleOnMove);
      window.removeEventListener("touchmove", (e) =>
        handleOnMove(e.touches[0])
      );
      document.body.removeEventListener("mouseleave", () =>
        updateLastMousePosition({ x: 0, y: 0 })
      );
    };
  }, [handleOnMove]);

  // Cleanup function for removing event listeners

  return {
    // You can return any values or functions that you want to expose
    // from your hook, for example, if you need to expose the state or
    // any utility functions.
  };
};

export default useStarsAnimation;
