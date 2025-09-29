<script setup lang="ts">
import { fieldDictionary } from "@/shared/utils/fieldDictionary";
import { type ComputedRef } from "vue";
import { handleRowClick } from "../lib/handlers/handleRowClick";
import { useTableData } from "../model/useTableData";

const { headers, paginatedData } = defineProps<{
  headers: ComputedRef<string[]> | string[] | undefined;
  paginatedData: any[];
}>();

const emit = defineEmits<{
  (e: "edit-click", payload: any): void;
}>();

const { columnCount, currentSection, navigationStore } = useTableData(headers);
</script>

<template>
  <table :key="currentSection + '-table'" class="data-table">
    <thead>
      <tr>
        <th v-for="key in headers" :key="key" style="position: relative">
          {{ fieldDictionary[key] }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="paginatedData.length === 0">
        <td :colspan="columnCount">Нет данных для отображения.</td>
      </tr>
      <tr
        v-else
        v-for="(item, index) in paginatedData"
        :data-js-section-data="JSON.stringify(item)"
        :key="item.id || index"
        @click="handleRowClick(emit, item)"
        :class="{
          'selected-row':
            String(navigationStore.selectedRow?.id) === String(item.id),
        }"
      >
        <template v-for="(value, title) in item">
          <td v-if="title !== 'password' && title !== 'id'" :key="title">
            <template v-if="typeof value === 'boolean'">
              <input type="checkbox" :checked="value" disabled />
            </template>
            <template v-else>
              {{ value }}
            </template>
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>
