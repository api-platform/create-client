import ApiResource from "./ApiResource";
import { HydraView } from "./HydraView";

export interface HydraResponse<T extends ApiResource> {
    '{{{hydraPrefix}}}member'?: Array<T>;
    '{{{hydraPrefix}}}view'?: HydraView;
}