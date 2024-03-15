import { useAppSelector } from "@/lib/hooks";
import { cleanLogs } from "@/lib/slices/{{{lc}}}Slice";
import { Log } from "@/lib/types/Logs";
import { Pressable, Text, View } from "react-native";
import { useDispatch } from "react-redux";

export default function LogsRenderer() {
    const logs = useAppSelector(state => state.{{{lc}}}.logs);
    const { errors, successes } = logs;

    return (
        <View>
            {
                errors.length > 0 &&
                <View className="flex flex-row justify-between p-4 mb-4 text-sm rounded-lg bg-red-300" role="alert">
                    <View>
                        {errors.map((error: string, index: number) => (
                            <Text className="font-medium" key={index}>- {error}</Text>
                        ))}
                    </View>
                    <CloseButton type="errors" />
                </View>
            }
            {
                successes.length > 0 &&
                <View className="flex flex-row justify-between p-4 mb-4 text-sm rounded-lg bg-green-300" role="alert">
                    <View>
                        {successes.map((success: string, index: number) => (
                            <Text className="font-medium" key={index}>- {success}</Text>
                        ))}
                    </View>
                    <CloseButton type="successes" />
                </View>
            }
        </View>
    )
}

const CloseButton = (props: { type: keyof Log }) => {
    const dispatch = useDispatch();

    return (
        <Pressable onPress={() => dispatch(cleanLogs(props.type))}>
            <Text className="text-black cursor-pointer text-sm font-bold py-2 px-4 rounded">X</Text>
        </Pressable>
    )
}