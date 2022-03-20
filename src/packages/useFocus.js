// 获取选中的元素
import { computed, ref } from "vue";

export function useFocus(data, callback) {

    const selectIndex = ref(-1);

    // 最后选择的block，辅助线
    const lastSelectBlock = computed(() => data.value.blocks[selectIndex.value])

    const focusData = computed(() => {
        let focus = [];
        let unFocus = [];
        data.value.blocks.forEach(block => (block.focus ? focus : unFocus).push(block));
        return {
            focus,
            unFocus
        }
    });

    const clearBlocksFocus = () => {
        data.value.blocks.forEach(block => block.focus = false);
    };

    const containerMousedown = () => {
        selectIndex.value = -1;
        clearBlocksFocus();
    };

    const blockMousedown = (e, block, index) => {
        e.preventDefault();
        e.stopPropagation();
        // 获取焦点则增加属性focus，设置为true
        if (e.shiftKey) {
            console.log('==');
            if (focusData.value.focus.length <= 1) {
                block.focus = true;
            }
            else {
                block.focus = !block.focus;
            }
        }
        else {
            if (!block.focus) {
                clearBlocksFocus();
                block.focus = true;
            }
        }
        selectIndex.value = index;
        callback(e);
    };

    return {
        blockMousedown,
        containerMousedown,
        focusData,
        lastSelectBlock
    }
}