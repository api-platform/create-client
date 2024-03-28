import { Modal, Pressable, Text, View } from "react-native";

export default function ConfirmModal(props: { isVisible: boolean, onDecline: Function, onAccept: Function }) {
    const { isVisible, onDecline, onAccept } = props;

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
        >
            <View className="flex flex-column items-center justify-center" style={containerStyle} >
                <View className="flex flex-column items-center border rounded py-4 px-12 bg-cyan-800">
                    <Text className="text-white text-1xl font-bold">Are you sure ?</Text>
                    <View className="flex flex-row mt-5 gap-3 justify-center">
                        <Pressable onPress={() => onAccept()}>
                            <Text className="bg-green-500 cursor-pointer text-white text-sm font-bold py-2 px-4 rounded">Yes</Text>
                        </Pressable>
                        <Pressable onPress={() => onDecline()}>
                            <Text className="bg-red-500 cursor-pointer text-white text-sm font-bold py-2 px-4 rounded">Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </View >
        </Modal>
    )
}

const containerStyle = { height: '100%', width: '100%' }