import { createEffect, createEvent, createStore } from "effector";
import { io, Socket } from "socket.io-client";
import { nanoid } from "nanoid";
import { TOKEN_KEY } from "shared/authorization";

export type SocketResponse<T = "success" | "error"> = {
  requestId?: string;
  error?: string;
  payload: T;
};

class AppSocket {
  private pendingRequests: Record<
    string,
    (response: SocketResponse<any>) => void
  > = {};

  private postponedRequests: Record<string, () => void> = {};

  client: Socket;
  $isConnected = createStore(false);

  connect() {
    this.client = io(
      (process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_SERVER_HOST
        : process.env.REACT_APP_SERVER_HOST_DEV) || "/",
      {
        transports: ["websocket"],
      },
    );

    this.init();
  }

  private init() {
    this.client.onAny((_, response: SocketResponse) => {
      if (response.requestId && this.pendingRequests[response.requestId]) {
        this.pendingRequests[response.requestId](response);
        Reflect.deleteProperty(this.pendingRequests, response.requestId);
      }
    });

    const socketConnected = createEvent<boolean>();
    this.client.on("connect", () => socketConnected(true));
    this.client.on("disconnect", () => socketConnected(false));
    this.$isConnected.on(socketConnected, (_, payload) => payload);

    this.$isConnected.watch((isConnected) => {
      if (isConnected) {
        for (const [actions, fn] of Object.entries(this.postponedRequests)) {
          fn();
          Reflect.deleteProperty(this.postponedRequests, actions);
        }
      }
    });
  }

  emitWithAnswer<T, V>(actions: string, payload?: T): Promise<V> {
    if (!this.$isConnected.getState()) {
      return new Promise((resolve) => {
        this.postponedRequests[actions] = () =>
          resolve(this.emitWithAnswer(actions, payload));
      });
    }

    const requestId = nanoid();
    this.client.emit(actions, {
      ...payload,
      requestId,
      token: localStorage[TOKEN_KEY],
    });

    return new Promise((resolve, reject) => {
      this.pendingRequests[requestId] = (response: SocketResponse<V>) => {
        Reflect.deleteProperty(response, requestId);
        response.error ? reject(response.error) : resolve(response.payload);
      };
    });
  }
}

export const socket = new AppSocket();

export const connectSocketFx = createEffect(() => socket.connect());
