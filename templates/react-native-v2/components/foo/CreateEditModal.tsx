import { useAppSelector } from "@/lib/hooks";
import { Modal, Pressable, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import Form from "./Form";
import { addLog, setData, setModalIsVisible, setView } from "@/lib/slices/{{{lc}}}Slice";
import { useDeleteMutation, useLazyGetAllQuery } from "@/lib/api/{{{lc}}}Api";
import { createErrorLog, createSuccessLog } from "@/lib/factory/logFactory";

export default function CreateEditModal() {
    const {{{lc}}}State = useAppSelector(state => state.{{{lc}}});
    const { modalState, currentData, page } = {{{lc}}}State;
    const dispatch = useDispatch();
    const [deleteMutation] = useDeleteMutation();
    const [getAll] = useLazyGetAllQuery();

    function handleDelete() {
        deleteMutation(currentData['@id'])
            .unwrap()
            .then(() => {
                dispatch(addLog(createSuccessLog(`{{{ucf}}} ${currentData['@id']} has been deleted successfully.`)))
                getAll(page)
                    .unwrap()
                    .then(fulfilled => {
                        dispatch(setModalIsVisible(false));
                        dispatch(setView(fulfilled["hydra:view"]));
                        dispatch(setData(fulfilled["hydra:member"]));
                    });
            })
            .catch(error => {
                if (error.data) {
                    dispatch(addLog(createErrorLog(`Error: ${error.data["hydra:description"]}`)))
                }
            });
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalState.open}
        >
            <View
                className="flex absolute bottom-0 rounded bg-white border border-gray-300"
                style={styles.container}
            >
                <View className="relative py-12 px-12">
                    <Text className="text-2xl">{modalState.edit ? `Edit {{{ucf}}}` : 'Create a new {{{ucf}}}'}</Text>
                    <Form />
                    {
                        modalState.edit &&
                        <Pressable onPress={() => handleDelete()}>
                            <Text className="bg-red-500 cursor-pointer text-white text-sm font-bold py-2 px-4 rounded">Delete</Text>
                        </Pressable>
                    }
                    <Pressable style={styles.closeButton} onPress={() => dispatch(setModalIsVisible(false))}>
                        <Text className="bg-black cursor-pointer text-white text-sm font-bold py-2 px-4 rounded">Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}

const styles = {
    container: { height: '80%', width: '100%', backgroundColor: '#e3e9e5' },
    closeButton: { position: 'absolute', right: 5, top: 5 }
}