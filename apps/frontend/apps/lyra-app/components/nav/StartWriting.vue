<script setup lang="ts">
import { computed } from 'vue';
import { Edit } from 'lucide-vue-next';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import ActionSplitButton from '~/components/ui/button/action-split-button/ActionSplitButton.vue';
const writeOption = [
  {
    label: 'Blank draft',
    href: '/new-post',
    description: 'Create a blank draft from scratch',
  },
  {
    label: 'Use template',
    href: '/new-template',
    description: 'Create a draft using a custom template',
  },
];
interface StartWritingProps {
  isCollapsed?: boolean;
}

const props = withDefaults(defineProps<StartWritingProps>(), {
  isCollapsed: false,
});

const identifier = computed(() => {
  return crypto.randomUUID();
});
</script>

<template>
  <ActionSplitButton variant="outline">
    <router-link
      v-if="!props.isCollapsed"
      :to="`/posts/${identifier}/edit`"
      class="flex items-center w-full"
    >
      <Edit class="mr-2 h-4 w-4" />
      Start Writing
    </router-link>

    <template v-if="props.isCollapsed" #icon>
      <Edit class="h-4 w-4 transition ease-out transform duration-100" />
    </template>

    <template #options>
      <DropdownMenuItem
        v-for="option in writeOption"
        :key="option.label"
        asChild
      >
        <div class="flex items-center justify-start">
          <router-link :to="option.href" class="flex flex-col items-start">
            <span class="text-left">{{ option.label }}</span>
            <span class="text-sm text-gray-500 text-left">{{
              option.description
            }}</span>
          </router-link>
        </div>
      </DropdownMenuItem>
    </template>
  </ActionSplitButton>
</template>
