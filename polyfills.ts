// navigator.onLine is undefined in React Native's Hermes runtime.
// Libraries like @clerk/clerk-js check !navigator.onLine to detect offline state,
// which is always true without this polyfill.
if (typeof navigator !== 'undefined' && navigator.onLine === undefined) {
  Object.defineProperty(navigator, 'onLine', {
    get: () => true,
    configurable: true,
  });
}
