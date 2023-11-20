// self.addEventListener("activate", (event) => {});

// self.addEventListener("install", (event) => {});

console.log("hello from sw.js");

let body;

addEventListener("message", (event) => {
  console.log(`Message received:`);
  body = event.data;
});

self.addEventListener("fetch", (event) => {
  console.log(`Fetch:`);
  event.respondWith(new Response(body));
});
