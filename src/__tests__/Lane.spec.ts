import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Lane from '../components/race-track/Lane.vue';
import Horse from '../components/race-track/Horse.vue';

describe('Lane.vue', () => {
  const horse = { id: 1, name: 'Thunder', color: '#ff0000', position: 42, condition: 80 };
  const laneNumber = 3;

  it('renders lane number and passes horse props to Horse', () => {
    const wrapper = mount(Lane, {
      props: { horse, laneNumber },
      global: {
        stubs: { Horse },
      },
    });
    // Check lane number
    expect(wrapper.text()).toContain(laneNumber.toString());
    // Check Horse subcomponent receives correct props
    const horseComp = wrapper.findComponent(Horse);
    expect(horseComp.exists()).toBe(true);
    expect(horseComp.props('color')).toBe(horse.color);
    expect(horseComp.props('name')).toBe(horse.name);
    expect(horseComp.props('position')).toBe(horse.position);
  });
}); 