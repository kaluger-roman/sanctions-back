import { createEffect, createEvent, createStore } from "effector";
import { authTools, SocketResponse } from "@master_kufa/client-tools";
import { io, Socket } from "socket.io-client";
import { nanoid } from "nanoid";

class AppSocket {
  private pendingRequests: Record<
    string,
    (response: SocketResponse<any>) => void
  > = {};
  private unAuthorizedFallbackUrl = "";

  client: Socket;
  $isConnected = createStore(false);

  private buildAuth() {
    return { token: authTools.getAuthToken() };
  }
  private handleUnAuthorized() {
    this.client.disconnect();
    authTools.handleUnAuthorized(this.unAuthorizedFallbackUrl, () => {
      this.client.auth = this.buildAuth();
      this.client.connect();
    });
  }

  connect() {
    this.client = io(process.env.REACT_APP_SERVER_HOST || "/", {
      transports: ["websocket"],
      auth: this.buildAuth(),
    });

    // this.client.on("connect_error", (err) => {
    //   if (unAuthorizedFallbackUrl && err.message === "UNAUTHORIZED")
    //     this.handleUnAuthorized();
    // });

    this.init();
  }
  disconnect() {
    this.handleUnAuthorized();
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
    this.client.emit(actions, { ...payload, requestId });

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
