import type { WidgetSchema } from 'remiz-editor';

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
