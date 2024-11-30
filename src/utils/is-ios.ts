export const isIos = (): boolean => navigator.platform.toLowerCase() === 'iphone'
  && navigator.userAgent.toLowerCase().includes('safari');
