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

  client: Socket;
  $isConnected = createStore(false);

  connect() {
    this.client = io(process.env.REACT_APP_SERVER_HOST || "/", {
      transports: ["websocket"],
    });

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
  }

  emitWithAnswer<T, V>(actions: string, payload?: T): Promise<V> {
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
