import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {{{ucf}}} from '../types/{{{ucf}}}';
import { ENTRYPOINT } from '@/config/entrypoint';

export const {{{lc}}}Api = createApi({
    reducerPath: '{{{lc}}}Api',
    baseQuery: fetchBaseQuery({ baseUrl: ENTRYPOINT }),
    endpoints: builder => ({
        getAll: builder.query<any, number>({
            query: (page) => {
                return `/{{{lc}}}s?page=${page}`
            }
        }),
        delete: builder.mutation<any, string>({
            query: (id) => {
                return {
                    url: `${id}`,
                    method: 'DELETE'
                }
            }
        }),
        create: builder.mutation<any, {{{ucf}}}>({
            query: ({{{lc}}}) => {
                return {
                    url: `/{{{lc}}}s`,
                    method: 'POST',
                    body: {{{lc}}},
                }
            }
        }),
        update: builder.mutation<any, {{{ucf}}}>({
            query: ({{{lc}}}) => {
                return {
                    url: {{{lc}}}['@id'],
                    method: 'PUT',
                    body: {{{lc}}},
                }
            }
        }),
    })
});

export const { useLazyGetAllQuery, useDeleteMutation, useCreateMutation, useUpdateMutation } = {{{lc}}}Api;