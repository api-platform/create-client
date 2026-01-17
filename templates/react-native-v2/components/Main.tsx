import { View } from "react-native";

export default function Main({ children }) {
    return (
        <View className="flex flex-1 py-16" style={styles.container}>
            {children}
        </View>
    )
}

const styles = {
    container: {
        position: 'relative',
        marginHorizontal: '3%',
    }
}