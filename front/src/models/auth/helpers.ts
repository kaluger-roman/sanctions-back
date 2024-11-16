import { createEffect, createEvent, Event, sample } from "effector";

export const webWorkerInterval = ({
  start,
  stop,
  interval,
}: {
  start: Event<void>;
  stop: Event<void>;
  interval: number;
}) => {
  const tick = createEvent();
  const timerUrl = new URL("./web-worker-timer.js", import.meta.url);
  const timerWorker = new Worker(timerUrl);

  timerWorker.onmessage = () => tick();

  sample({
    clock: stop,
    target: createEffect(() => timerWorker.postMessage({ action: "stop" })),
  });

  sample({
    clock: start,
    target: createEffect(() =>
      timerWorker.postMessage({ action: "start", interval }),
    ),
  });

  return tick;
};
