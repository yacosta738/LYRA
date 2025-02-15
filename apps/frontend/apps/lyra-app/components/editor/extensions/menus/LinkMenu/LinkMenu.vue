<template>
  <BaseBubbleMenu
    :editor="editor"
    :pluginKey="pluginKey"
    :shouldShow="shouldShow"
    :updateDelay="0"
    :tippy-options="{
      role: 'menu',
      maxWidth: 'calc(100vw - 16px)',
      popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
      },
          onCreate: (instance: Instance) => {
          tippyInstance = instance;
        },
        plugins: [sticky],
        sticky: 'popper',
     }"
  >
    <Card>
      <div class="flex items-center gap-1 w-full p-1">
        <TooltipProvider v-if="!isEditing">
          <div v-if="isEmbedLink" class="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  class="flex"
                  :active="isLayoutImageLeft"
                  @click="onLayoutImageLeft"
                >
                  <Icon name="lucide:layout-panel-left" />
                  <span class="sr-only">Layout Image Left / Text Right</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Layout Image Left / Text Right</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  class="flex"
                  :active="isLayoutImageCenter"
                  @click="onLayoutImageTop"
                >
                  <Icon name="lucide:layout-panel-top" />
                  <span class="sr-only">Layout Image Top / Text Bottom</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Layout Image Top / Text Bottom</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  class="flex"
                  :active="isLayoutImageRight"
                  @click="onLayoutImageRight"
                >
                  <Icon
                    name="lucide:layout-panel-left"
                    class="transform rotate-180"
                  />
                  <span class="sr-only">Layout Image Right / Text Left</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Layout Image Right / Text Left</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  class="flex"
                  :active="isLayoutOnlyText"
                  @click="onLayoutOnlyText"
                >
                  <Icon name="lucide:text" />
                  <span class="sr-only">Layout Only Text</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Layout Only Text</p>
              </TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" class="w-px h-6 mx-2" />
          </div>

          <Tooltip v-if="isValidLink">
            <TooltipTrigger>
              <Button
                variant="ghost"
                class="flex"
                @click="onEditLink"
              >
                <Icon name="lucide:link" />
                <span class="sr-only">Edit Link</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Link</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip v-if="isValidLink">
            <TooltipTrigger>
              <Button
                variant="ghost"
                class="flex"
                @click="openLink"
              >
                <Icon name="lucide:external-link" />
                <span class="sr-only">Open Link</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open Link</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" class="w-px h-6 mx-2" />

          <Tooltip v-if="isValidLink">
            <TooltipTrigger>
              <Button
                variant="ghost"
                class="flex"
                @click="deleteLink"
              >
                <Icon name="lucide:trash-2" />
                <span class="sr-only">Delete embed</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete embed</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <template v-else>
          <LinkEditorPanel
            :initialUrl="newUrl"
            @confirm="confirmEditLink"
            @cancel="cancelEditLink"
          />
        </template>
      </div>
    </Card>
  </BaseBubbleMenu>
</template>

<script setup lang="ts">
import { ref, computed, defineProps } from "vue";
import { BubbleMenu as BaseBubbleMenu } from "@tiptap/vue-3";
import { sticky, type Instance } from "tippy.js";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import type { MenuProps } from "../types";
import LinkEditorPanel from "./LinkEditorPanel.vue";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const { $api } = useNuxtApp();
const props = defineProps<MenuProps>();
const tippyInstance = ref<Instance | null>(null);
const pluginKey = computed(() => `linkMenu-${crypto.randomUUID()}`);
const isEditing = ref(false);
const newUrl = ref("");

const shouldShow = () =>
  props.editor.isActive("link") || props.editor.isActive("embedLink");

const onLayoutImageLeft = () =>
  props.editor.chain().focus().setEmbedLinkLayout("left").run();

const onLayoutImageTop = () =>
  props.editor.chain().focus().setEmbedLinkLayout("top").run();

const onLayoutImageRight = () =>
  props.editor.chain().focus().setEmbedLinkLayout("right").run();

const onLayoutOnlyText = () =>
  props.editor.chain().focus().setEmbedLinkLayout("text").run();

const openLink = () => {
  const url =
    props.editor.getAttributes("link").href ||
    props.editor.getAttributes("embedLink").url ||
    "";
  window.open(url, "_blank");
};

const deleteLink = () => {
  const { from, to } = props.editor.state.selection;
  props.editor.chain().focus().deleteRange({from, to}).run();
};

const onEditLink = () => {
  isEditing.value = true;
  newUrl.value =
    props.editor.getAttributes("link").href ||
    props.editor.getAttributes("embedLink").url ||
    "";
};

const confirmEditLink = async (url: string) => {
  newUrl.value = url;
  if (!newUrl.value) return;

  const editorChain = props.editor.chain().focus();

  if (props.editor.isActive("link")) {
    editorChain.extendMarkRange("link").setLink({ href: newUrl.value }).run();
  }

  if (props.editor.isActive("embedLink")) {
    try {
      const response = await $api.linkPreview.fetchLinkPreview(newUrl.value);
      const { imageUrl, title, description } = response;
      const { layout } = props.editor.getAttributes("embedLink");

      editorChain.updateEmbedLinkBlock({
        url: newUrl.value,
        image: imageUrl || "",
        title,
        description,
        layout,
      }).run();
    } catch (error) {
      console.error("Failed to fetch link preview:", error);
    }
  }

  isEditing.value = false;
};

const cancelEditLink = () => {
  isEditing.value = false;
};

const isLayoutImageLeft = computed(() =>
  props.editor.isActive("embedLink", { layout: "left" })
);
const isLayoutImageCenter = computed(() =>
  props.editor.isActive("embedLink", { layout: "top" })
);
const isLayoutImageRight = computed(() =>
  props.editor.isActive("embedLink", { layout: "right" })
);
const isLayoutOnlyText = computed(() =>
  props.editor.isActive("embedLink", { layout: "text" })
);
const isLink = computed(() => props.editor.isActive("link"));
const isEmbedLink = computed(() => props.editor.isActive("embedLink"));
const isValidLink = computed(
  () => isLink.value || (isEmbedLink.value && props.editor.getAttributes("embedLink").url)
);
</script>
