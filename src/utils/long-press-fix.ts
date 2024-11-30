const TIMEOUT = 500;

export const createLongPressFixHandler = () => {
  let pressTimer: NodeJS.Timeout | number = 0;
  let isDoubleTapPressed = false;

  return (e: TouchEvent): void => {
    clearTimeout(pressTimer);
    if (isDoubleTapPressed) {
      e.preventDefault();
      isDoubleTapPressed = false;
    } else {
      isDoubleTapPressed = true;
      pressTimer = setTimeout(() => {
        isDoubleTapPressed = false;
      }, TIMEOUT);
    }
  };
};
