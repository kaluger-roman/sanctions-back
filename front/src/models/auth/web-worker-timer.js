let timerId;

onmessage = (event) => {
  const { action, interval } = event.data;

  if (action === "start" && interval) {
    if (timerId) return;
    timerId = setInterval(() => {
      postMessage("tick");
    }, interval);
  }

  if (action === "stop") {
    clearInterval(timerId);
    timerId = null;
  }
};
