<template>
  <table class="base-table">
    <thead>
      <tr>
        <th v-for="col in columns" :key="col.name" :style="col.headerStyle" :class="col.headerClasses">
          {{ col.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
        <template v-for="col in columns" :key="col.name">
          <td
            :style="tdStyle(col, row)"
            :class="tdClass(col, row)"
          >
            <slot :name="'body-cell-' + col.name" :row="row" :value="getFieldValue(col, row)" :col="col" :rowIndex="rowIndex">
              {{ formatValue(col, row) }}
            </slot>
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
// Column type for BaseTable
export interface IBaseTableColumn<T = any> {
  name: string;
  label: string;
  field: keyof T | ((row: T) => any);
  align?: string;
  required?: boolean;
  style?: string | ((row: T) => string);
  classes?: string | ((row: T) => string);
  headerStyle?: string;
  headerClasses?: string;
  format?: (val: any, row: T) => any;
}

// Props
defineProps<{ columns: IBaseTableColumn[]; rows: any[] }>()

function getFieldValue<T = any>(col: IBaseTableColumn<T>, row: T): any {
  if (typeof col.field === 'function') return col.field(row)
  return row[col.field as keyof T]
}
function formatValue<T = any>(col: IBaseTableColumn<T>, row: T): any {
  const val = getFieldValue(col, row)
  return col.format ? col.format(val, row) : val
}
function tdStyle<T = any>(col: IBaseTableColumn<T>, row: T): any {
  return typeof col.style === 'function' ? col.style(row) : col.style
}
function tdClass<T = any>(col: IBaseTableColumn<T>, row: T): any {
  return typeof col.classes === 'function' ? col.classes(row) : col.classes
}
</script>

<style scoped>
.base-table {
  width: 100%;
  border-collapse: collapse;
}
.base-table th, .base-table td {
  border: 1px solid #ccc;
  padding: 4px 8px;
  text-align: left;
}
</style> 