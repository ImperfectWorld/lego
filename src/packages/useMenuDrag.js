export function useMenuDrag(data, containerRef) {
    let currentComponent = null; // 当前拖拽对象
    const dragenter = (e) => {
        e.dataTransfer.dropEffect = 'move';
    };
    const dragover = (e) => {
        e.preventDefault();
    };
    const dragleave = (e) => {
        e.dataTransfer.dropEffect = 'none';
    };
    const drop = (e) => {
        let block = data.value.blocks; // 内部已经渲染的组件
        data.value = {
            ...data.value,
            blocks: [
                ...block,
                {
                    top: e.offsetY,
                    left: e.offsetX,
                    zIndex: 1,
                    key: currentComponent.key,
                    alignCenter: true
                }
            ]
        }
        currentComponent = null;
    };
    const dragStart = (e, component) => {
        containerRef.value.addEventListener('dragenter', dragenter);
        containerRef.value.addEventListener('dragover', dragover);
        containerRef.value.addEventListener('dragleave', dragleave);
        containerRef.value.addEventListener('drop', drop);
        currentComponent = component;
    }

    const dragend = (e) => {
        containerRef.value.removeEventListener('dragenter', dragenter);
        containerRef.value.removeEventListener('dragover', dragover);
        containerRef.value.removeEventListener('dragleave', dragleave);
        containerRef.value.removeEventListener('drop', drop);
    }

    return {
        dragStart,
        dragend
    }
}