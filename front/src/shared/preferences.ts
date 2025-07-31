import { UserReportsLimitStatus } from "./reports";

export type Preferences = UserReportsLimitStatus & {
  maxWebViewTagsCount: number;
};
