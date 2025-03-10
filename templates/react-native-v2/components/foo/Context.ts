import {{{ucf}}} from "@/lib/types/{{{ucf}}}";
import { Log, addNotificationFunction, clearNotificationsFunction } from "@/lib/utils/Logs";
import { createContext } from "react";

export type {{{ucf}}}ContextData = {
    notifications: Log[];
    addNotification: addNotificationFunction,
    clearNotifications: clearNotificationsFunction,
    isModalVisible: boolean;
    isModalEdit: boolean;
    setIsModalVisible: (visible: boolean) => void;
    currentData?: {{{ucf}}};
}

export const {{{ucf}}}Context = createContext<{{{ucf}}}ContextData>(null);