<script setup lang="ts">
import CloseIcon from "@/shared/ui/CloseIcon/ui/CloseIcon.vue";
import "../style.scss";
import { onMounted, ref, watch } from "vue";
import { MoreDetailsCollapseModel } from "../model/MoreDetailsCollapseModel";
import { useGlobalStore } from "@/shared/store/globalStore";
import { localizatedSectionsList } from "@/shared/config/localizatedSections";

const props = defineProps<{
  model: MoreDetailsCollapseModel;
}>();

const data = ref<any>();
const currentTableHeaders = ref<any>();
const globalStore = useGlobalStore();
const selectedRow = ref<any>();
const currentSection = ref<string>("bills_components");

onMounted(async () => {
  data.value = await props.model.fetchData(
    `${currentSection.value}/generateData/${props.model.SelectedRow.id}`
  );
  globalStore.setActiveSection(currentSection.value);

  if (data.value && Array.isArray(data.value) && data.value.length > 0) {
    currentTableHeaders.value = Object.keys(data.value[0]).filter(
      (item) => item !== "id"
    );
  }
});

function handleCloseCollapse() {
  globalStore.setActiveSection(props.model.CurrentSection);
  props.model.closeCollapse();
}

const handleEditModalWindow = () => {};
</script>

<template>
  <div class="moreDetailsCollapse">
    <CloseIcon
      :handle-click="handleCloseCollapse"
      class="moreDetailsCollapse__closeIcon"
    />
    <h1 class="moreDetailsCollapse__title">
      {{ localizatedSectionsList[currentSection] }}
    </h1>

    <table
      :key="currentSection + '-table'"
      :id="currentSection + '-table'"
      class="data-table"
    >
      <thead>
        <tr>
          <th
            v-for="key in currentTableHeaders"
            :key="key"
            style="position: relative"
          >
            {{ key }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in data"
          :key="`${item.id}-child` || index"
          @dblclick="handleEditModalWindow"
          @click="globalStore.setSelectedRow(item)"
          :class="{
            'selected-row':
              String(globalStore.selectedRow?.id) === String(item.id),
          }"
        >
          <template v-for="(value, title) in item">
            <td v-if="title !== 'password' && title !== 'id'" :key="title">
              {{ console.debug(value, title) }}
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
  </div>
</template>
