import { h } from 'vue';
import { describe, it, expect } from 'vitest';
import { shallowMount, mount } from '@vue/test-utils';
import BaseTable from '../../components/BaseTable.vue';

const columns = [
  { name: 'name', label: 'Name', field: 'name' },
  { name: 'value', label: 'Value', field: 'value' },
];
const rows = [
  { name: 'A', value: 1 },
  { name: 'B', value: 2 },
];

describe('BaseTable.vue', () => {
  it('renders table headers and rows', () => {
    const wrapper = shallowMount(BaseTable, {
      props: { columns, rows },
    });
    // Check headers
    expect(wrapper.html()).toContain('Name');
    expect(wrapper.html()).toContain('Value');
    // Check row data
    expect(wrapper.html()).toContain('A');
    expect(wrapper.html()).toContain('B');
    expect(wrapper.html()).toContain('1');
    expect(wrapper.html()).toContain('2');
  });

  it('renders custom slot for cell', () => {
    const wrapper = mount(BaseTable, {
      props: { columns, rows },
      slots: {
        'body-cell-value': (slotProps) => h('span', { class: 'custom' }, slotProps.value * 10)
      }
    });
    // Should render custom slot content
    expect(wrapper.html()).toContain('10');
    expect(wrapper.html()).toContain('20');
    expect(wrapper.findAll('.custom').length).toBe(2);
  });
}); 