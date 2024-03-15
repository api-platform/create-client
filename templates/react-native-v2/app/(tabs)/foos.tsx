import Main from "@/components/Main";
import Navigation from "@/components/Navigation";
import CreateEditModal from "@/components/{{{lc}}}/CreateEditModal";
import LogsRenderer from "@/components/{{{lc}}}/LogsRenderer";
import { useLazyGetAllQuery } from "@/lib/api/{{{lc}}}Api";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setCurrentData, setData, setModalIsEdit, setModalIsVisible, setPage, setView } from "@/lib/slices/{{{lc}}}Slice";
import {{{ucf}}} from "@/lib/types/{{{ucf}}}";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function {{{ucf}}}s() {
    const datas = useAppSelector(state => state.{{lc}}.data);
    const view = useAppSelector(state => state.{{{lc}}}.view);
    const { page = '1' } = useLocalSearchParams<{ page: string }>();

    const dispatch = useAppDispatch();
    const [getAll] = useLazyGetAllQuery();

    const toggleEditModal = (data: {{{ucf}}}) => {
        dispatch(setCurrentData(data));
        dispatch(setModalIsVisible(true));
        dispatch(setModalIsEdit(true));
    };

    const toggleCreateModal = () => {
        dispatch(setModalIsVisible(true));
        dispatch(setModalIsEdit(false));
    }

    useEffect(() => {
        const intPage = parseInt(page);
        if (intPage < 0) return;
        dispatch(setPage(intPage));
        getAll(intPage)
            .unwrap()
            .then(fulfilled => {
                dispatch(setView(fulfilled["hydra:view"]));
                dispatch(setData(fulfilled["hydra:member"]));
            })
    }, [page]);

    return (
        <Main>
            <View className="py-3 flex flex-row items-center justify-between">
                <Text className="text-3xl">{{{ucf}}}s List</Text>
                <Pressable onPress={() => toggleCreateModal()}>
                    <Text className="bg-cyan-500 cursor-pointer text-white text-sm font-bold py-2 px-4 rounded">Create</Text>
                </Pressable>
            </View>
            <ScrollView>
                <LogsRenderer />
                <View>
                    {
                        datas.map(data => (
                            <Pressable onPress={() => toggleEditModal(data)} key={data["@id"]}>
                                <View className="flex flex-column my-2 block max-w p-6 bg-white border border-gray-300 rounded shadow">
                                    <Text>ID: {data['@id']}</Text>
                                    {{#each fields}}
                                        <Text>{{{name}}}: {data["{{{name}}}"]}</Text>
                                    {{/each}}
                                </View>
                            </Pressable>
                        ))
                    }
                </View>
                <CreateEditModal />
            </ScrollView>
            <Navigation view={view} />
        </Main >
    );
}