<script setup lang="ts">
import { NodeViewWrapper, Editor } from '@tiptap/vue-3'
import { Node } from '@tiptap/pm/model'
import { ref, computed, defineProps } from 'vue'
import { cn } from '@/lib/utils'

interface ImageBlockViewProps {
  editor: Editor
  getPos: () => number
  node: Node & {
    attrs: {
      src: string
      align?: string
      width?: string
    }
  }
  updateAttributes: (attrs: Record<string, string>) => void
}

const props = defineProps<ImageBlockViewProps>()
const imageWrapperRef = ref<HTMLDivElement | null>(null)

const wrapperClassName = computed(() =>
  cn(
    'node-imageBlock',
    props.node.attrs.align === 'left' ? 'ml-0' : 'ml-auto',
    props.node.attrs.align === 'right' ? 'mr-0' : 'mr-auto',
    props.node.attrs.align === 'center' && 'mx-auto'
  )
)

const onClick = () => {
  props.editor.commands.setNodeSelection(props.getPos())
}
</script>

<template>
  <NodeViewWrapper>
    <div :class="wrapperClassName" :style="{ width: props.node.attrs.width }">
      <div contenteditable="false" ref="imageWrapperRef">
        <img class="block" :src="props.node.attrs.src" :alt="props.node.attrs.alt" @click="onClick" />
      </div>
    </div>
  </NodeViewWrapper>
</template>
