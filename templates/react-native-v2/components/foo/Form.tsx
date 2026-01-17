import {{{ucf}}} from "@/lib/types/{{{ucf}}}";
import { useContext, useState } from "react";
import { Controller, SubmitErrorHandler, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { create, update } from "@/lib/api/{{{lc}}}Api";
import { {{{ucf}}}Context } from "./Context";

export default function Form() {
    const [errors, setErrors] = useState([]);
    const queryClient = useQueryClient();

    const context = useContext({{{ucf}}}Context);
    const { addNotification, isModalEdit, setIsModalVisible, currentData: data } = context;

    const queryFn = isModalEdit ? update : create;

    const mutation = useMutation({
        mutationFn: (data: {{{ucf}}}) => queryFn(data),
        onError: (error) => {
            addNotification('error', error.toString());
        },
        onSuccess: (data) => {
            if (data.ok) {
                addNotification('success', `The {{{lc}}} has been ${isModalEdit ? 'updated' : 'created'}`);
            } else {
                addNotification('error', `An error occured while ${isModalEdit ? 'updating' : 'creating'} the {{{lc}}} (${data.statusText})`);
            }
            queryClient.invalidateQueries({ queryKey: ['getAll'] });
        }
    });

    let initValues: {{{ucf}}} = (isModalEdit && data) ? data : {
        '@id': '',
        {{#each formFields}}
            {{{name}}}: {{#if (compare type "==" "number")}}0{{else}}''{{/if}},
        {{/each}}
    }

    const { control, handleSubmit, reset } = useForm<{{{ucf}}}>({
        defaultValues: initValues
    });

    const onSubmit = (data: {{{ucf}}}) => {
        intParser(data);
        mutation.mutate(data);
        setIsModalVisible(false);
        reset();
    };

    const intParser = (data: {{{ucf}}}) => {
        Object.keys(data).forEach(key => {
            if ((typeof initValues[key] == "number") && !isNaN(parseInt(data[key]))) {
                data[key] = parseInt(data[key]);
            }
        });
    }

    const onError: SubmitErrorHandler<{{{ucf}}}> = (errors, e) => {
        setErrors(Object.keys(errors));
    }

    return (
        <SafeAreaView>
            <View className="my-5 flex flex-column gap-3">
                {errors.length > 0 &&
                    <View className="p-4 mb-4 text-sm rounded-lg bg-red-400" role="alert">
                        <Text className="font-medium">
                            Field{errors.length > 1 ? "s" : ""} "{errors.join(', ')}" {errors.length > 1 ? "are" : "is"} empty
                        </Text>
                    </View>
                }
                {{#each formFields}}
                <Controller
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <View className="flex flex-row items-center gap-3">
                            <Text>{{{name}}} :</Text>
                            <TextInput
                                style={styles.textInput}
                                value={value?.toString()}
                                onChangeText={onChange}
                                inputMode="{{#if (compare type "==" "number")}}numeric{{else}}text{{/if}}"
                                placeholder="{{{name}}}"
                                placeholderTextColor="black"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-1.5"
                            />
                        </View>
                    )}
                    name="{{{name}}}"
                    {{#if required}}rules={fieldRequired}{{/if}}
                />
                {{/each}}
                <Pressable onPress={handleSubmit(onSubmit, onError)}>
                    <Text className="bg-cyan-500 cursor-pointer text-white text-sm font-bold py-2 px-4 rounded">{isModalEdit ? 'Edit' : 'Create'}</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const fieldRequired = {
    required: true
}

const styles = {
    textInput: { minWidth: 200 }
}