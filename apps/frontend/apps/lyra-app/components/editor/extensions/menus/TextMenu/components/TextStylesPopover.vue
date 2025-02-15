<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { cn } from "~/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Card, CardContent } from "~/components/ui/card";
import { Icon } from "~/components/ui/icon";
import { Button } from "@/components/ui/button";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Separator } from "@/components/ui/separator";
import { ColorPicker } from '~/components/ui/color-picker';
import MenuButton from "~/components/editor/extensions/menus/MenuButton.vue";

type ViewStates = 'main' | 'fontFamily' | 'colorPicker'

export interface TextStylesPopoverProps {
  icon: string;
  label: string;
  textColor: string;
  fontSize: string;
  fontFamily: string;
}

const props = defineProps<TextStylesPopoverProps>();
const emit = defineEmits(['update:textColor', 'update:fontSize', 'update:fontFamily']);
const menuOpen = ref(false);

const colorOptions = ['#6E44FF', '#B892FF', '#FFC2E2', '#FF90B3', '#EF7A85', '#8d8c93']

const defaultColor = colorOptions[0]

const view = ref<ViewStates>('main')
const fontFamily = ref(props.fontFamily || 'None')
const fontSize = ref(props.fontSize || 'Default')
const textColor = ref(props.textColor || defaultColor)
const selectedColors = ref<string[]>([])
const tempColor = ref(defaultColor)
const fontFamilyFilter = ref('')

const fontSizes = [
  { value: 'default', label: 'Default' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'x-large', label: 'X-Large' },
  { value: 'huge', label: 'Huge' }
]

const fontFamilies = [
  { value: 'none', label: 'None' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Arial', label: 'Arial' },
]

const filteredFontFamilies = computed(() => {
  const filter = fontFamilyFilter.value.toLowerCase();
  return fontFamilies.filter(font => font.label.toLowerCase().includes(filter));
});

const addSelectedColor = (color: string) => {
  if (!selectedColors.value.includes(color)) {
    if (selectedColors.value.length >= 5) {
      selectedColors.value.shift();
    }
    selectedColors.value.push(color);
  }
}

const showColorPicker = () => {
  view.value = 'colorPicker';
  tempColor.value = textColor.value;
}

const onTextColorChange = (color: string) => {
  tempColor.value = color;
}

const setColor = () => {
  textColor.value = tempColor.value;
  addSelectedColor(tempColor.value);
  view.value = 'main';
}

const selectFontFamily = (font: { value: string, label: string }) => {
  fontFamily.value = font.label
  view.value = 'main'
}

const showFontFamilyPanel = () => {
  view.value = 'fontFamily'
  fontFamilyFilter.value = ''
}

const resetColors = () => {
  selectedColors.value = [];
}

watch(textColor, (newColor) => {
  emit('update:textColor', newColor);
});

watch(fontSize, (newSize) => {
  emit('update:fontSize', newSize);
});

watch(fontFamily, (newFamily) => {
  emit('update:fontFamily', newFamily);
});

</script>

<template>
  <Popover v-model:open="menuOpen" asChild>
    <PopoverTrigger>
      <MenuButton :icon="props.icon" :label="props.label" >
        <template #icon-after>
          <Icon name="ChevronDown" class="w-2 h-2" />
        </template>
      </MenuButton>
    </PopoverTrigger>
    <PopoverContent class="w-full h-full p-0" side="bottom" :sideOffset="8" asChild>
      <Card class="p-1">
        <CardContent class="p-0">
          <ScrollArea class="min-h-72">
            <div v-if="view === 'main'" class="space-y-4 p-1">
              <div class="space-y-2">
                <Button variant="ghost" class="w-full flex items-center justify-between text-sm" @click="showFontFamilyPanel();">
                  <span>Font family override</span>
                  <div class="flex items-center gap-2 text-gray-400">
                    <span>{{ fontFamily }}</span>
                    <Icon name="ChevronRight" class="h-4 w-4" />
                  </div>
                </Button>
              </div>

              <div class="space-y-2">
                <span class="text-sm">Font size</span>
                <div class="grid grid-cols-3 gap-2">
                  <Button
                    v-for="size in fontSizes"
                    :key="size.value"
                    size="sm"
                    variant="ghost"
                    :class="cn('px-3 py-1 text-sm rounded-md',
                      fontSize === size.label ? 'bg-accent-foreground text-accent' : ''
                    )"
                    @click="fontSize = size.label"
                  >
                    {{ size.label }}
                  </Button>
                </div>
              </div>

              <div class="space-y-2">
                <span class="text-sm">Text color</span>
                <div class="grid grid-cols-6 gap-2">
                  <button
                    v-for="color in colorOptions"
                    :key="color"
                    :class="cn('size-5 rounded-full border-2',
                      textColor === color ? 'border-accent-foreground' : 'border-transparent'
                    )"
                    :style="{ backgroundColor: color }"
                    @click="textColor = color"
                  />
                </div>
                <Separator class="my-1"/>
                <div class="grid grid-cols-6 gap-2">
                  <button
                    class="size-5 rounded-full bg-gradient-to-br from-pink-500 via-blue-500 to-green-500"
                    @click="showColorPicker"
                  />
                  <button
                    v-for="color in selectedColors"
                    :key="color"
                    :class="cn('size-5 rounded-full border-2',
                      textColor === color ? 'border-accent-foreground' : 'border-transparent'
                    )"
                    :style="{ backgroundColor: color }"
                    @click="textColor = color"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    class="size-5 rounded-full border-2 border-transparent"
                    @click="resetColors"
                  >
                    <Icon name="Ban" class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div v-else-if="view === 'colorPicker'" class="p-1">
              <Button variant="ghost" @click="view = 'main'" class="w-full flex items-center justify-start">
                  <Icon name="ChevronLeft" class="h-4 w-4" />
                  <span class="text-sm">
                    Text color
                  </span>
                </Button>
                <Separator class="my-1"/>
              <ColorPicker
                :color="tempColor"
                @update:color="onTextColorChange"
              />
              <Separator class="my-1"/>
                <Button v-if="tempColor !== textColor" variant="ghost" class="w-full flex items-center justify-start" @click="setColor">
                Set Color
                </Button>
            </div>

            <div v-else class="p-1">
              <div class="sticky top-0 z-10">
                <Button variant="ghost" @click="view = 'main'" class="w-full flex items-center justify-start">
                  <Icon name="ChevronLeft" class="h-4 w-4" />
                  <span class="text-sm">Font family</span>
                </Button>
                <Separator class="my-1"/>
                <Input
                  v-model="fontFamilyFilter"
                  class="mb-2"
                  placeholder="Filter font family"
                />
              </div>
              <div class="space-y-1">
                <Button
                  v-for="font in filteredFontFamilies"
                  :key="font.value"
                  variant="ghost"
                  :class="cn('w-full flex items-center justify-start px-3 py-2 rounded-md text-sm',
                    fontFamily === font.label ? 'bg-accent-foreground text-accent' : '',
                  )"
                  @click="selectFontFamily(font)"
                >
                  {{ font.label }}
                </Button>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </PopoverContent>
  </Popover>
</template>
