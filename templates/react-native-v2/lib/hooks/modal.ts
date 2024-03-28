import { useState } from "react";

type useModalType = {
    isModalVisible: boolean;
    isModalEdit: boolean;
    toggleEditModal: () => void;
    toggleCreateModal: () => void;
    setIsModalEdit: (state: boolean) => void;
    setIsModalVisible: (state: boolean) => void;
}

export const useModal = (): useModalType => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalEdit, setIsModalEdit] = useState(false);

    const toggleEditModal = () => {
        setIsModalVisible(true);
        setIsModalEdit(true);
    };

    const toggleCreateModal = () => {
        setIsModalVisible(true);
        setIsModalEdit(false);
    }

    return { isModalEdit, isModalVisible, toggleCreateModal, toggleEditModal, setIsModalEdit, setIsModalVisible }
}