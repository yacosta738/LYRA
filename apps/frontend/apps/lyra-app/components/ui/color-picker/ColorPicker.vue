<script setup lang="ts">
import { Vue3ColorPicker } from '@cyhnkckali/vue3-color-picker';
import { defineEmits, defineProps, ref, computed } from "vue";
import '@cyhnkckali/vue3-color-picker/dist/style.css';
import { useColorMode } from "#imports";

const colorMode = useColorMode();

type ColorPickerProps = {
  color?: string;
};

const props = defineProps<ColorPickerProps>();
const emit = defineEmits<{
  (e: "update:color", value: string): void;
}>();

const localColor = ref(props.color || "");

const onChangeColorPicker = (newColor: string) => {
  emit("update:color", newColor);
};

const theme = computed(() => {
  return colorMode.value === 'dark' ? 'dark' : 'light';
});
</script>

<template>
  <Vue3ColorPicker
    v-model="localColor"
    @update:model-value="onChangeColorPicker"
    mode="solid"
    :theme="theme"
  />
</template>

<style lang="scss">
:root {
  --cp-container-bg: 0 0% 100%;
  --cp-container-shadow: none;
}

.ck-cp-container[cp-theme="dark"]  {
  --cp-container-bg: 222.2 84% 4.9%;
  --cp-container-shadow: none;
}
</style>
