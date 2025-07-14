import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import RaceTrack from '../components/race-track/RaceTrack.vue';
import Lane from '../components/race-track/Lane.vue';
import { createStore } from 'vuex';
import { nextTick } from 'vue';

describe('RaceTrack.vue', () => {
  const horses = [
    { id: 1, name: 'Thunder', color: '#ff0000', position: 10 },
    { id: 2, name: 'Lightning', color: '#00ff00', position: 20 },
  ];
  const lapLabel = 'Lap 1';
  const store = createStore({
    getters: {
      currentHorses: () => horses,
      lapLabel: () => lapLabel,
    },
    state: {},
  });

  it('renders a Lane for each horse and displays lap label', async () => {
    const wrapper = mount(RaceTrack, {
      global: {
        plugins: [store],
        stubs: { Lane },
      },
    });
    await nextTick();
    // Check Lane components
    expect(wrapper.findAllComponents(Lane).length).toBe(2);
    // Check lap label
    expect(wrapper.text()).toContain(lapLabel);
  });
}); 