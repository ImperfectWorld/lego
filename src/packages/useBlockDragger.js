import { reactive } from "vue";

export function useBlockDragger(focusData, lastSelectBlock, data) {

    let dragState = {
        startX: 0,
        startY: 0
    };
    let markLine = reactive({
        x: null,
        y: null
    });
    const mousemove = (e) => {
        let { clientX: moveX, clientY:moveY} = e;

        // 计算当前元素最新的left和top，去与lines左匹配找到显示线
        let left = moveX - dragState.startX + dragState.startLeft;
        let top = moveY - dragState.startY + dragState.startTop;

        // 横线计算，距离参照物元素还有5px的时候显示
        let y = null;
        let x = null;
        for (let i = 0; i < dragState.lines.y.length; i++) {
            const {top: t, showTop: s} = dragState.lines.y[i];
            if (Math.abs(t - top) < 5) {
                y = s;
                // 实现快速和目标元素贴在一起
                moveY = dragState.startY - dragState.showTop + t;

                break;
            }
        }

        for (let i = 0; i < dragState.lines.x.length; i++) {
            const {left: l, showLeft: s} = dragState.lines.x[i];
            if (Math.abs(l - left) < 5) {
                x = s;
                // 实现快速和目标元素贴在一起
                moveX = dragState.startX - dragState.showLeft + l;

                break;
            }
        }

        markLine.x = x; // markLine 响应式数据
        markLine.y = y;

        let durX = moveX - dragState.startX; // 之前和之后拖拽的距离
        let durY = moveY - dragState.startY;
        focusData.value.focus.forEach((block, idx) => {
            block.top = dragState.startPos[idx].top + durY;
            block.left = dragState.startPos[idx].left + durX;
        })
    }
    const mouseup = (e) => {
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);

        markLine.x = null; // markLine 响应式数据
        markLine.y = null;
    }
    const mousedown = (e) => {

        const { width: BWidth, height: BHeight } = lastSelectBlock.value;

        dragState = {
            startX: e.clientX,
            startY: e.clientY,
            startLeft: lastSelectBlock.value.left,
            startTop: lastSelectBlock.value.top,
            startPos: focusData.value.focus.map(({top, left}) => ({top, left})),
            lines: (() => {
                const { unFocus } = focusData.value;

                let lines = {x: [], y: []}; // 计算横线的位置y， x存储纵向
                [...unFocus,
                    {
                        top: 0,
                        left: 0,
                        width: data.value.container.width,
                        height: data.value.container.height
                    }
                ].forEach(block => {
                    const {top: ATop, left: ALeft, width: AWidth, height: AHeight} = block;

                    lines.y.push({showTop: ATop, top: ATop}); // 顶对顶
                    lines.y.push({showTop: ATop, top: ATop - BHeight}); // 顶对低
                    lines.y.push({showTop: ATop + AHeight / 2, top: ATop + AHeight / 2 - BHeight / 2}); // 中对中
                    lines.y.push({showTop: ATop + AHeight, top: ATop + AHeight}); // 低对顶
                    lines.y.push({showTop: ATop + AHeight, top: ATop + AHeight - BHeight}); // 底对底
                
                    lines.x.push({showLeft: ALeft, left: ALeft}); // 左对左
                    lines.x.push({showLeft: ALeft + AWidth, left: ALeft + AWidth}); // 右对左
                    lines.x.push({showLeft: ALeft + AWidth / 2, left: ALeft + AWidth / 2 - BWidth / 2});
                    lines.x.push({showLeft: ALeft + AWidth, left: ALeft + AWidth - BWidth});
                    lines.x.push({showLeft: ALeft, left: ALeft - BWidth});
                })
                return lines;
            })()
        };
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
    }

    return {
        mousedown,
        markLine
    }
}