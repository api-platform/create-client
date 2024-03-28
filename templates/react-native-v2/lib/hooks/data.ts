import { useCallback, useState } from "react";
import ApiResource from "../types/ApiResource";
import { HydraView } from "../types/HydraView";

type useDataType<T extends ApiResource> = {
    member: T[];
    setMember: (member: T[]) => void,
    processMercureData: (member: T) => void,
    view: HydraView;
    setView: (view: HydraView) => void;
    currentData: Nullable<T>;
    setCurrentData: (data: T) => void;
}

export const useData = <T extends ApiResource>(): useDataType<T> => {
    const [member, setMember] = useState<T[]>([]);
    const [view, setView] = useState<HydraView>({});
    const [currentData, setCurrentData] = useState<Nullable<T>>(undefined);

    const processMercureData = useCallback((data: T) => {
        const currentMember = member.find(item => item["@id"] == data["@id"]);

        if (Object.keys(data).length == 1) {
            data.deleted = true;
        }

        if (currentMember) {
            Object.assign(currentMember, data);
            setMember([...member]); // force re-render
        } else {
            setMember([...member, data]);
        }
    }, [member]);

    return { member, setMember, processMercureData, view, setView, currentData, setCurrentData };
}