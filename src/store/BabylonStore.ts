import { create } from "zustand";

type State = {
    model: { type: string | null, model: string | undefined | null };
}

type Action = {
    setModel: (model: State["model"]) => void;
}

export const useModelStore = create<State & Action>((set) => ({
    model: { type: null, model: null },
    setModel: (model) => set(() => ({ model: model })),
}))