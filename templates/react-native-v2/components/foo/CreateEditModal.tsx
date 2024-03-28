import { Modal, Pressable, Text, View } from "react-native";
import Form from "./Form";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {{{ucf}}} from "@/lib/types/{{{ucf}}}";
import { remove } from "@/lib/api/{{{lc}}}Api";
import { useContext, useEffect, useState } from "react";
import ConfirmModal from "../ConfirmModal";
import { {{{ucf}}}Context } from "./Context";

export default function CreateEditModal() {
    const [requestDelete, setRequestDelete] = useState(false);
    const queryClient = useQueryClient();

    const context = useContext({{{ucf}}}Context);
    const { addNotification, setIsModalVisible, isModalEdit, isModalVisible, currentData: data } = context;

    const deleteMutation = useMutation({
        mutationFn: (data: {{{ucf}}}) => remove(data),
        onError: (error: string) => {
            addNotification('error', error.toString());
        },
        onSuccess: (data) => {
            if (data.ok) {
                addNotification('success', 'The {{{lc}}} has been deleted');
            } else {
                addNotification('error', `An error occured while deleting the {{{lc}}} (${data.statusText})`);
            }
            queryClient.invalidateQueries({ queryKey: ['getAll{{{ucf}}}s'] });
        },
    });

    useEffect(() => {
        if (data && data.deleted) {
            addNotification('error', `${data["@id"]} has been deleted by another user`);
            setIsModalVisible(false);
            setRequestDelete(false);
        }
    }, [JSON.stringify(data)])

    const onAccept = () => {
        deleteMutation.mutate(data);
        setIsModalVisible(false);
        setRequestDelete(false);
    }

    const onDecline = () => {
        setRequestDelete(false);
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
        >
            <View
                className="flex absolute bottom-0 rounded bg-white border border-gray-300"
                style={styles.container}
            >
                <View className="relative py-12 px-12">
                    <ConfirmModal isVisible={requestDelete} onAccept={onAccept} onDecline={onDecline} />
                    <Text className="text-2xl">{isModalEdit ? `Edit {{{ucf}}}` : 'Create a new {{{ucf}}}'} ({ data && data['@id'] })</Text>
                    <Form />
                    {
                        isModalEdit &&
                        <Pressable onPress={() => setRequestDelete(true)}>
                            <Text className="bg-red-500 cursor-pointer text-white text-sm font-bold py-2 px-4 rounded">Delete</Text>
                        </Pressable>
                    }
                    <Pressable style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
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