<template>
  <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-md">
    <div class="flex">
      <div class="flex-shrink-0">
        <Icon name="Info" class="h-5 w-5 text-blue-500" /> <!-- Ubah dari 'InformationCircle' menjadi 'Info' -->
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300">{{ title }}</h3>
        <div class="mt-2 text-sm text-blue-700 dark:text-blue-400">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>