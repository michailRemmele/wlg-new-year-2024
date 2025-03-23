import type { WidgetSchema } from 'dacha-workbench';

export const movement: WidgetSchema = {
  title: 'components.movement.title',
  fields: [
    {
      name: 'speed',
      title: 'components.movement.speed.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    speed: 0,
  }),
};
