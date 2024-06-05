import {Hero} from "./hero.model";

export interface Update {
  isLoading?: Boolean,
  item?: Hero,
  error?: string,
}
