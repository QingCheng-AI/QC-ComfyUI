<template>
  <div>
    <h2 class="text-2xl font-bold mb-2">{{ $t('about') }}</h2>
    <div class="space-y-2">
      <a
        v-for="link in links"
        :key="link.url"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center no-underline"
      >
        <Tag class="mr-2">
          <template #icon>
            <i :class="[link.icon, 'mr-2 text-xl']"></i>
          </template>
          {{ link.label }}
        </Tag>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSystemStatsStore } from '@/stores/systemStatsStore'
import Tag from 'primevue/tag'
import { computed, onMounted } from 'vue'

const systemStatsStore = useSystemStatsStore()

const links = computed(() => [
  {
    label: `ComfyUI`,
    url: 'https://github.com/comfyanonymous/ComfyUI',
    icon: 'pi pi-github'
  },
  {
    label: `ComfyUI_frontend QingCheng Edition`,
    url: 'https://github.com/QingCheng-AI/QC-ComfyUI',
    icon: 'pi pi-github'
  }
])

onMounted(async () => {
  if (!systemStatsStore.systemStats) {
    await systemStatsStore.fetchSystemStats()
  }
})
</script>
