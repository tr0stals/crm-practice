<script setup lang="ts">
import "../style.scss";
import CloseIcon from "@/shared/ui/CloseIcon/ui/CloseIcon.vue";
import { onMounted, reactive, ref } from "vue";
import { getDataAsync } from "../api/getDataAsync";
import type { IEdittingProps } from "@/shared/config/IEdittingProps";
import Button from "@/shared/ui/Button/ui/Button.vue";
import { fieldDictionary } from "@/shared/utils/fieldDictionary";
import { AddModalWindowModel } from "../model/AddModalWindowModel";
import { guessTableName } from "@/shared/utils/guessTable";

const props = defineProps<{
  config?: IEdittingProps;
  onApplyCallback: () => {};
}>();

const formData: any = reactive({});

const tableColumns = ref();
const selectOptions = reactive<Record<string, any[]>>({});

onMounted(async () => {
  /*
   * получение ключей таблицы
   */
  await getDataAsync(`database/${props.config?.sectionName}/columns`)
    .then((res) => (tableColumns.value = res.data))
    .catch((e) => console.error(e));

  new AddModalWindowModel(props.onApplyCallback);

  for (const item of tableColumns.value) {
    if (item !== "id") {
      formData[item] = "";

      if (item.endsWith("Id")) {
        const tableName = guessTableName(item);

        try {
          const res = await getDataAsync(`database/${tableName}`);
          selectOptions[item] = res.data;
        } catch (e) {
          console.error(
            `Не удалось загрузить данные для внешней таблицы: ${tableName}`
          );
        }
      }
    }
  }
});
</script>
<template>
  <div id="modalWindow" class="modalWindow addModalWindow">
    <component
      class="addModalWindow__closeIcon"
      id="closeIcon"
      :is="CloseIcon"
    />
    <h1>{{ props.config?.sectionName || "[Section name]" }}</h1>
    <div class="addModalWindow__content">
      <div v-for="item in tableColumns" class="addModalWindow__content__field">
        <template v-if="item !== 'id'">
          <label :for="item">{{ fieldDictionary[item] }}</label>
          <template v-if="item.slice(-2) === 'Id'">
            <select v-model="formData[item]" :id="item" :name="item">
              <option value="" disabled>Выберите значение</option>
              <option
                v-for="option in selectOptions[item]"
                :key="option.id"
                :value="option.id"
              >
                {{
                  option.name ||
                  option.title ||
                  option.code ||
                  "ID: " + option.id
                }}
              </option>
            </select>
          </template>
          <template v-else>
            <input
              type="text"
              v-model="formData[item]"
              :id="item"
              :name="item"
            />
          </template>
        </template>
      </div>
    </div>
    <div class="addModalWindow__controls">
      <Button
        data-js-cancel-btn=""
        text="Отменить"
        button-color="button__buttonBlue"
        :extra-classes="['addModalWindow__controls__btn']"
      />
      <Button
        :data-js-add-btn="
          JSON.stringify({
            sectionName: props.config?.sectionName,
            data: formData,
          })
        "
        text="Сохранить"
        button-color="button__buttonBlue"
        :extra-classes="['addModalWindow__controls__btn']"
      />
    </div>
  </div>
</template>
