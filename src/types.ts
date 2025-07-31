import { Socket } from "socket.io";

export type Request<T> = T & {
  requestId?: string;
  token?: string;
  deviceId?: string;
};

export type SocketResponse<T> = {
  requestId?: string;
  error?: string;
  payload: T;
};

export type PreferencesResponse = {
  currentReportsCount?: number;
  maxUserReports?: number;
  maxWebViewTagsCount: number;
} | null;

export type ApiHandlers<ACTIONS extends string> = Record<ACTIONS, ApiHandler>;

export type ApiHandler = (
  payload: unknown,
  socket?: Socket,
) => unknown | Promise<unknown>;
