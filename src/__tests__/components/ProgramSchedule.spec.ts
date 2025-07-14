import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ProgramSchedule from '../../components/ProgramSchedule.vue';
import BaseTable from '../../components/BaseTable.vue';
import { createStore } from 'vuex';
import { nextTick } from 'vue';

describe('ProgramSchedule.vue', () => {
  const rounds = [
    { distance: 1200, horses: [ { name: 'A' }, { name: 'B' } ] },
    { distance: 1400, horses: [ { name: 'C' }, { name: 'D' } ] },
  ];
  const roundResults = [
    [ { name: 'A' }, { name: 'B' } ],
    [ { name: 'C' }, { name: 'D' } ],
  ];
  const store = createStore({
    state: { rounds, roundResults },
    getters: {},
  });

  it('renders program and result tables for each round', async () => {
    const wrapper = mount(ProgramSchedule, {
      global: {
        plugins: [store],
        stubs: { BaseTable },
      },
    });
    await nextTick();
    // Check for program & results header
    expect(wrapper.text()).toContain('Program & Results');
    // Check for round distances
    expect(wrapper.text()).toContain('1200m');
    expect(wrapper.text()).toContain('1400m');
    // Check for horse names
    expect(wrapper.text()).toContain('A');
    expect(wrapper.text()).toContain('B');
    expect(wrapper.text()).toContain('C');
    expect(wrapper.text()).toContain('D');
  });

  it('renders correct number of BaseTable components', async () => {
    const wrapper = mount(ProgramSchedule, {
      global: {
        plugins: [store],
        stubs: { BaseTable },
      },
    });
    await nextTick();
    // For each round, there should be 2 BaseTable (program + result)
    expect(wrapper.findAllComponents(BaseTable).length).toBe(rounds.length * 2);
  });
}); 