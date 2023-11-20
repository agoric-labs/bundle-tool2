// cribbed from
// https://github.com/mdn/dom-examples/blob/main/service-worker/simple-service-worker/app.js
// 36e9841 2022-11

// @ts-check
const { freeze } = Object;

const registerServiceWorker = async (
  scriptURL = "pub/sw.js",
  scope = "/pub/"
) => {
  if (!("serviceWorker" in navigator)) throw Error("no serviceWorker API");
  const registration = await navigator.serviceWorker.register(scriptURL, {
    scope,
  });
  if (registration.installing) {
    console.log("Service worker installing");
  } else if (registration.waiting) {
    console.log("Service worker installed");
  } else if (registration.active) {
    console.log("Service worker active");
  }
  return registration;
};

// NOTE: assertion functions may not be defined as plain function expressions
function assert<T>(
  condition: T,
  message: string = "assertion failed"
): asserts condition is NonNullable<T> {
  if (!condition) {
    throw new Error(message);
  }
}

export const makeFileResource = async (_url: string) => {
  const worker = await registerServiceWorker();
  return freeze({
    async setBody(body: Blob) {
      console.log("in setBody");
      if (!worker.active) return;
      worker.active.postMessage(body);
    },
  });
};
