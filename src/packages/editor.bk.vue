<template>
    <div class="editor">
        <div class="editor-left">
            <div class="editor-left-item"
                v-for="component in config.componentList"
                :key="component.id"
            >
                <span>{{component.label}}</span>
                <div>{{component.preview}}</div>
            </div>
        </div>
        <div class="editor-top">菜单栏</div>
        <div class="editor-right">属性控制栏</div>
        <div class="editor-container">
            <div class="editor-container-canvas">
                <div class="editor-container-canvas_content" style={{containerStyles.value}}>
                    <EditorBlock
                        v-for="block in data.blocks"
                        :key="block.id"
                        :block="block"
                    >
                    </EditorBlock>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { computed, inject } from "vue";
import './editor.scss';
import EditorBlock from './editor-block';
export default {
    props: {
        modelValue: {type: Object}
    },
    components: { 
        EditorBlock
    },
    setup(props) {
        const data = computed({
            get() {
                console.log('===');
                return props.modelValue
            }
        });

        const containerStyles = computed(() => ({
            width: data.value.container.width + 'px',
            height: data.value.container.height + 'px',
        }));

        const config = inject('config');

        return {
            config,
            data,
            containerStyles
        }
    },
}
</script>
