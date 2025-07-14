import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Horse from '../components/race-track/Horse.vue';
import HorseIcon from '../components/race-track/HorseIcon.vue';

describe('Horse.vue', () => {
  const color = '#ff0000';
  const name = 'Thunder';
  const position = 55;

  it('renders horse name and passes props to HorseIcon', () => {
    const wrapper = mount(Horse, {
      props: { color, name, position },
      global: {
        stubs: { HorseIcon },
      },
    });
    // Check horse name
    expect(wrapper.text()).toContain(name);
    // Check HorseIcon subcomponent receives correct props
    const icon = wrapper.findComponent(HorseIcon);
    expect(icon.exists()).toBe(true);
    expect(icon.props('color')).toBe(color);
    expect(icon.props('position')).toBe(position);
  });
}); 