import { useModelStore } from "@/store/BabylonStore"

const useModel = () => {
    const model = useModelStore((state)=>state.model);
    const setModel = useModelStore((state)=>state.setModel);

    return {model,setModel}
}

export default useModel;