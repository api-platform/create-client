import {Hero} from "./hero.model";

export interface List {
  isLoading?: Boolean | undefined | null,
  items?: Hero[],
  error?: string,
}
