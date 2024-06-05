import {Hero} from "./hero.model";

export interface Show {
  isLoading?: Boolean,
  item?: Hero,
  error?: string,
}
