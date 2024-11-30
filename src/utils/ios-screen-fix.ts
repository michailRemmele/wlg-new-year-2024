export const applyIosSafariScreenFix = (): void => {
  /**
   * This hack triggers extra resize event to update canvas and control buttons
   */
  const orientation = window.matchMedia('(orientation:landscape)');
  orientation.addEventListener('change', () => {
    setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
  });
};
