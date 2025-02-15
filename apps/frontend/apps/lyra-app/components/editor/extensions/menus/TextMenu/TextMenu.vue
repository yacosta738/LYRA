<script setup lang="ts">
import { computed, defineProps } from "vue";
import { BubbleMenu as BaseBubbleMenu } from "@tiptap/vue-3";
import { sticky, type Props } from "tippy.js";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import EditLinkPopover from "./components/EditLinkPopover.vue";
import ColorPickerPopover from "./components/ColorPickerPopover.vue";
import HeadingsPopover from "./components/HeadingsPopover.vue";
import ListPopover from "./components/ListPopover.vue";
import TextAlignmentPicker from "./components/TextAlignmentPicker.vue";
import TextStylesPopover from "./components/TextStylesPopover.vue";
import MenuButtonGroup from "../MenuButtonGroup.vue";
import type { MenuProps } from "../types";
import type { EditorView } from "@tiptap/pm/view";
import { isCustomNodeSelected, isTextSelected } from "@/components/editor/lib/";
import { useTextMenuState } from "./utils/useTextMenuStates";

const props = defineProps<MenuProps>();
const pluginKey = computed(() => `textMenu-${crypto.randomUUID()}`);
const { menuGroups, commands } = useTextMenuState(props.editor);

const currentAttributes = computed(() => {
  const editor = props.editor;
  return {
    color: editor.getAttributes("textStyle")?.color,
    highlight: editor.getAttributes("highlight")?.color,
    font: editor.getAttributes("textStyle")?.fontFamily,
    size: editor.getAttributes("textStyle")?.fontSize,
  };
});

const shouldShow = ({ view, from }: { view: EditorView; from: number }) => {
  if (!view || props.editor.view.dragging) {
    return false;
  }

  const domAtPos = view.domAtPos(from || 0).node;
  const nodeDOM = view.nodeDOM(from || 0);
  const node =
    nodeDOM instanceof HTMLElement
      ? nodeDOM
      : domAtPos instanceof HTMLElement
      ? domAtPos
      : null;

  if (node && isCustomNodeSelected(props.editor, node)) {
    return false;
  }

  return isTextSelected({ editor: props.editor });
};

const tippyOptions: Partial<Props> = {
  role: "menu",
  maxWidth: "calc(100vw - 16px)",
  popperOptions: {
    placement: "top-start",
    modifiers: [
      {
        name: "preventOverflow",
        options: { boundary: "viewport", padding: 8 },
      },
      {
        name: "flip",
        options: {
          fallbackPlacements: ["bottom-start", "top-end", "bottom-end"],
        },
      },
    ],
  },
  plugins: [sticky],
  sticky: "popper",
};
</script>

<template>
  <BaseBubbleMenu
    :editor="props.editor"
    :pluginKey="pluginKey"
    :shouldShow="shouldShow"
    :updateDelay="100"
    :tippy-options="tippyOptions"
  >
    <Card>
      <div class="flex items-center gap-0.5 w-full p-0.5">
        <MenuButtonGroup :buttons="menuGroups.textFormatting" />
        <EditLinkPopover :onSetLink="commands.onLink" />
        <ColorPickerPopover
          icon="Highlighter"
          label="Highlight"
          :is-active="!!currentAttributes.highlight"
          :color="currentAttributes.highlight"
          :on-change="commands.onChangeHighlight"
          :on-clear="commands.onClearHighlight"
        />
        <ColorPickerPopover
          icon="Palette"
          label="Text color"
          :is-active="!!currentAttributes.color"
          :color="currentAttributes.color"
          :on-change="commands.onChangeColor"
          :on-clear="commands.onClearColor"
        />
        <Separator orientation="vertical" class="w-px h-6 mx-2" />
        <HeadingsPopover :editor="props.editor" />
        <ListPopover :editor="props.editor" />
        <MenuButtonGroup :buttons="menuGroups.advancedTextOptions" />
        <Separator orientation="vertical" class="w-px h-6 mx-2" />
        <TextAlignmentPicker :editor="props.editor" />
        <TextStylesPopover
          icon="lucide:square-chart-gantt"
          label="Text Styles"
          :font-family="currentAttributes.font"
          :font-size="currentAttributes.size"
          :text-color="currentAttributes.color"
          @update:font-family="commands.onSetFont"
          @update:font-size="commands.onSetFontSize"
          @update:text-color="commands.onChangeColor"
        />
      </div>
    </Card>
  </BaseBubbleMenu>
</template>
