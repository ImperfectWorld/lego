import { computed, defineComponent, inject, ref } from "vue";
import './editor.scss';
import EditorBlock from './editor-block';
import draggable from 'vuedraggable'
import deepcopy from "deepcopy";
import { useMenuDrag } from "./useMenuDrag";
import { useFocus } from './useFocus';
import { useBlockDragger } from "./useBlockDragger";

export default defineComponent({
    props: {
        modelValue: {type: Object}
    },
    emits: ['update:modelValue'],
    setup(props, ctx) {
        const data = computed({
            get() {
                return props.modelValue
            },
            set(newValue) {
                ctx.emit("update:modelValue", deepcopy(newValue))
            }
        });

        const containerStyles = computed(() => ({
            width: data.value.container.width + 'px',
            height: data.value.container.height + 'px',
        }));

        const config = inject('config');
        const containerRef = ref(null);

        // 菜单的拖拽功能
        const { dragStart, dragend} = useMenuDrag(data, containerRef);
        
        // 获取焦点
        let { blockMousedown, focusData, containerMousedown, lastSelectBlock } = useFocus(data, (e) => {
            // 获取焦点后拖拽
            mousedown(e);
        });

        // 组件拖拽
        const { mousedown, markLine } = useBlockDragger(focusData, lastSelectBlock, data);
        
        // 实现拖拽多个元素

        return () => <div class="editor">
            <div class="editor-left">
                {/* 根据注册列表渲染对应内容，可以拖拽 */}
                {config.componentList.map(component => (
                    <div
                        class="editor-left-item"
                        draggable
                        onDragstart={e => dragStart(e, component)}
                        onDragend={dragend}
                    >
                        <span>{component.label}</span>
                        <div>{component.preview()}</div>
                    </div>
                ))}
            </div>
            <div class="editor-top">菜单栏</div>
            <div class="editor-right">属性控制栏</div>
            <div class="editor-container">
                <div class="editor-container-canvas">
                    <div class="editor-container-canvas_content"
                        style={containerStyles.value}
                        ref={containerRef}
                        onMousedown={containerMousedown}
                    >
                        {
                            (data.value.blocks.map((block, index) => (
                                <EditorBlock
                                    class={block.focus ? 'editor-block-focus' : ''}
                                    block={block}
                                    onMousedown={(e) => blockMousedown(e, block, index)}
                                ></EditorBlock>
                            )))
                        }

                        {markLine.x !== null && <div class="line-x" style={{left: markLine.x + 'px'}}></div>}
                        {markLine.y !== null && <div class="line-y" style={{top: markLine.y + 'px'}}></div>}
                    </div>
                </div>
            </div>
        </div>
    }
})