import { create } from "zustand";

type State = {
    model: string | undefined | null;
}

type Action = {
    setModel: (model: any) => void;
}

export const useModelStore = create<State & Action>((set) => ({
    model: null,
    setModel: (model) => set(() => ({ model: model })),
}))