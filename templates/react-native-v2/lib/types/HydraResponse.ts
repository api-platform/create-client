import ApiResource from "./ApiResource";
import { HydraView } from "./HydraView";

export interface HydraResponse<T extends ApiResource> {
    'hydra:member'?: Array<T>;
    'hydra:view'?: HydraView;
}