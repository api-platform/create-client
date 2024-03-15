import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {{{ucf}}} from '../types/{{{ucf}}}';
import { HydraView } from '../types/HydraView';
import { Log, NewLog } from '../types/Logs';

interface {{{ucf}}}SliceState {
    page: number;
    data: {{{ucf}}}[];
    currentData?: {{{ucf}}};
    modalState: ModalState;
    view: HydraView;
    logs: Log;
}

interface ModalState {
    open: boolean;
    edit: boolean;
}

const initialState: {{{ucf}}}SliceState = {
    page: 1,
    data: [],
    currentData: undefined,
    modalState: {
        open: false,
        edit: false,
    },
    view: {},
    logs: {
        errors: [],
        successes: [],
    }
}

export const {{{lc}}}Slice = createSlice({
    name: '{{{lc}}}Slice',
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setData: (state, action: PayloadAction<{{{ucf}}}[]>) => {
            state.data = action.payload;
        },
        setView: (state, action: PayloadAction<HydraView>) => {
            state.view = action.payload;
        },
        setCurrentData: (state, action: PayloadAction<{{{ucf}}}>) => {
            state.currentData = action.payload;
        },
        setModalIsVisible: (state, action: PayloadAction<boolean>) => {
            state.modalState.open = action.payload;
        },
        setModalIsEdit: (state, action: PayloadAction<boolean>) => {
            state.modalState.edit = action.payload;
        },
        addLog: (state, action: PayloadAction<NewLog>) => {
            state.logs[action.payload.type] = [...state.logs[action.payload.type], action.payload.message];
        },
        cleanLogs: (state, action: PayloadAction<keyof Log>) => {
            state.logs[action.payload] = [];
        },
    }
})

export const { setPage, setData, setView, setCurrentData, setModalIsEdit, setModalIsVisible, addLog, cleanLogs } = {{{lc}}}Slice.actions;

export default {{{lc}}}Slice.reducer;