import { Log, LogType } from "@/lib/utils/Logs";
import { useContext, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { {{{ucf}}}Context } from "./Context";

export default function LogsRenderer() {
    const context = useContext({{{ucf}}}Context);
    const { notifications, clearNotifications } = context;

    const filterLogs = (type: keyof LogType) => {
        return notifications.filter(log => log.type == type);
    }

    const errors = useMemo(() => filterLogs("error"), [notifications]);
    const successes = useMemo(() => filterLogs("success"), [notifications]);

    return (
        <View>
            {
                errors.length > 0 &&
                <View className="flex flex-row justify-between p-4 mb-4 text-sm rounded-lg bg-red-300" role="alert">
                    <View>
                        {errors.map((error: Log, index: number) => (
                            <Text className="font-medium" key={index}>- {error.message}</Text>
                        ))}
                    </View>
                    <Pressable onPress={() => clearNotifications('error')}>
                        <Text className="text-black cursor-pointer text-sm font-bold py-2 px-4 rounded">X</Text>
                    </Pressable >
                </View>
            }
            {
                successes.length > 0 &&
                <View className="flex flex-row justify-between p-4 mb-4 text-sm rounded-lg bg-green-300" role="alert">
                    <View>
                        {successes.map((success: Log, index: number) => (
                            <Text className="font-medium" key={index}>- {success.message}</Text>
                        ))}
                    </View>
                    <Pressable onPress={() => clearNotifications('success')}>
                        <Text className="text-black cursor-pointer text-sm font-bold py-2 px-4 rounded">X</Text>
                    </Pressable >
                </View>
            }
        </View>
    )
}