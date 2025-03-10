import Main from "@/components/Main";
import Navigation from "@/components/Navigation";
import CreateEditModal from "@/components/{{{lc}}}/CreateEditModal";
import LogsRenderer from "@/components/{{{lc}}}/LogsRenderer";
import {{{ucf}}} from "@/lib/types/{{{ucf}}}";
import { useLocalSearchParams, Link } from "expo-router";
import { useEffect } from "react";
import { useQuery } from '@tanstack/react-query'
import { Pressable, ScrollView, Text, View } from "react-native";
import { getAll } from "@/lib/api/{{{lc}}}Api";
import { HydraResponse } from "@/lib/types/HydraResponse";
import { {{{ucf}}}Context, {{{ucf}}}ContextData } from "@/components/{{{lc}}}/Context";
import { useMercure } from "@/lib/hooks/mercure";
import { useData } from "@/lib/hooks/data";
import { useNotifications } from "@/lib/hooks/notifications";
import { useModal } from "@/lib/hooks/modal";
import { Icon } from "@/lib/utils/icons";

export default function Books() {
    const { page = '1' } = useLocalSearchParams<{ page: string }>();
    const { id = undefined } = useLocalSearchParams<{ id: Nullable<string> }>();

    const { member, setMember, processMercureData, view, setView, currentData, setCurrentData } = useData<{{{ucf}}}>();
    const { notifications, addNotification, clearNotifications } = useNotifications();
    const { isModalEdit, isModalVisible, toggleEditModal, toggleCreateModal, setIsModalVisible } = useModal();

    useMercure(['/{{{lc}}}s'], processMercureData);

    const { isSuccess, data, isLoading, error } = useQuery<HydraResponse<{{{ucf}}}>>({
        queryKey: ['getAll{{{ucf}}}s', page],
        queryFn: () => getAll(page),
    });

    useEffect(() => {
        if (isSuccess) {
            setMember(data["{{{hydraPrefix}}}member"]);
            setView(data['{{{hydraPrefix}}}view']);
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (!id) return;

        const data = member.find(item => item["@id"].includes(id) == true);
        if (data) {
            setCurrentData(data);
            toggleEditModal();
        }
    }, [member, id])

    const providerValues: {{{ucf}}}ContextData = { notifications, addNotification, clearNotifications, isModalVisible, isModalEdit, setIsModalVisible, currentData };
    const viewButtonStyle = { width: "5vw", minWidth: '100px', height: "100%" };

    return (
        <Main>
            <View className="py-3 flex flex-row items-center justify-between">
                <Text className="text-3xl">{{{ucf}}}s List</Text>
                <Pressable onPress={() => toggleCreateModal()}>
                    <Text className="bg-cyan-500 cursor-pointer text-white text-sm font-bold py-2 px-4 rounded">Create</Text>
                </Pressable>
            </View>
            <{{{ucf}}}Context.Provider value={providerValues}>
                <ScrollView>
                    <LogsRenderer />
                    <View>
                        {
                            member && member.length < 1 &&
                            <View className="flex flex-row justify-between p-4 mb-4 text-sm rounded-lg bg-cyan-300" role="alert">
                                <Text className="text-1xl">{isLoading ? 'Loading data...' : 'No data found'}</Text>
                            </View>
                        }
                        {
                            error &&
                            <View className="flex flex-row justify-between p-4 mb-4 text-sm rounded-lg bg-red-300" role="alert">
                                <Text className="text-1xl">{error.message}</Text>
                            </View>
                        }
                        {
                            member && member.map((item: {{{ucf}}}) => (
                                !item.deleted && 
                                <View key={item['@id']} className="flex relative my-2 block max-w p-6 bg-white border border-gray-300 rounded shadow">
                                    <View>
                                        <Text>ID: {item['@id']}</Text>
                                        {{#each fields}}
                                            {{#if isReferences}}
                                                <Text>{{{name}}}:</Text>
                                                {item['{{{name}}}'].map((ref: any) => <Link className="text-blue-500" href={`/{{{reference.name}}}?id=${ref}`} key={ref}>{ref}</Link>)}
                                            {{else if reference}}
                                                <Text>{{{name}}}: <Link className="text-blue-500" href={`/{{{reference.name}}}?id=${item["{{{name}}}"]}`} key={item["{{{name}}}"]}>{item["{{{name}}}"]}</Link></Text>
                                            {{else if isEmbeddeds}}
                                                <Text>{{{name}}}:</Text>
                                                {item['{{{name}}}'].map((emb: any) => <Link className="text-blue-500" href={`/{{{embedded.name}}}?id=${emb["@id"]}`} key={emb["@id"]}>{emb["@id"]}</Link>)}
                                            {{else if embedded}}
                                                <Text>{{{name}}}: <Link className="text-blue-500" href={`/{{{embedded.name}}}?id=${item["{{{name}}}"]["@id"]}`} key={item["{{{name}}}"]["@id"]}>{item["{{{name}}}"]["@id"]}</Link></Text>
                                            {{else}}
                                                <Text>{{{name}}}: {item["{{{name}}}"]}</Text>
                                            {{/if}}
                                        {{/each}}
                                    </View>
                                    <View className="flex justify-center items-center absolute bottom-0 right-0 bg-cyan-500" style={viewButtonStyle}>
                                        <Pressable onPress={() => {
                                        setCurrentData(item);
                                        toggleEditModal();
                                        }}>
                                            <Icon name="eye" />
                                        </Pressable>
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                    <CreateEditModal />
                </ScrollView>
            </{{{ucf}}}Context.Provider>
            <Navigation view={view} />
        </Main >
    );
}