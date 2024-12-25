export const showOverlay = (): void => {
  const overlay = document.getElementById('overlay');
  if (overlay && !overlay.classList.contains('overlay_black')) {
    overlay.classList.add('overlay_black');
  }
};

export const hideOverlay = (): void => {
  const overlay = document.getElementById('overlay');
  if (overlay && overlay.classList.contains('overlay_black')) {
    overlay.classList.remove('overlay_black');
  }
};
