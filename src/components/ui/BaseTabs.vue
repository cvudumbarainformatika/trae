<script setup>
import { computed } from 'vue'
import Icon from '@/components/ui/Icon.vue'

const props = defineProps({
  tabs: {
    type: Array,
    required: true
  },
  activeTab: {
    type: [String, Number, Object],
    required: true
  },
  color: {
    type: String,
    default: 'primary'
  }
})

const emit = defineEmits(['update:activeTab', 'removeTab', 'addTab'])

const handleTabClick = (tabId) => {
  if (tabId !== props.activeTab?.unique_code) {
    emit('update:activeTab', tabId)
  }
}
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden ">

    <div class="flex">
      <div class="flex items-center overflow-x-auto">
        <div v-for="tab in tabs" :key="tab.unique_code" @click="handleTabClick(tab.unique_code)" :class="[
          'p-2 py-1 cursor-pointer rounded-t-lg transition flex items-center gap-2',
          tab.unique_code === activeTab
            ? 'bg-primary-600 border border-transparent text-secondary-900 dark:text-white'
            : 'hover:bg-secondary-700 border border-transparent  text-secondary-900 dark:text-gray-400'
        ]">

          <div class="text-xs">{{ tab.unique_code }}</div>
          <div class="-mr-1">
            <Icon name="x" size="20" class=" hover:bg-primary-800 rounded-full p-1"
              @click.stop="emit('removeTab', tab.unique_code)" />
          </div>
          <slot name="tab-action" :tab="tab"></slot>
        </div>
        <!-- <slot name="add-tab"></slot> -->
        <div class="ml-2 hover:bg-secondary-700 border border-transparent text-secondary-900 dark:text-gray-400">
          <Icon name="plus" size="24" class=" hover:bg-primary-800 p-1" @click="emit('addTab')" />
        </div>
      </div>
    </div>
    <div :key="activeTab"
      class="flex-1 border border-gray-300 dark:border-gray-600 text-secondary-900 dark:text-white rounded-b-md h-full overflow-y-auto">
      <Transition name="fade" mode="out-in">
        <div :key="activeTab" class="h-full">
          <slot name="tab-content"></slot>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}



.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}
</style>
