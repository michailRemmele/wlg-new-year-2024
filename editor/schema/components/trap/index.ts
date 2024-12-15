import type { WidgetSchema } from 'remiz-editor';

export const trap: WidgetSchema = {
  title: 'components.trap.title',
  fields: [
    {
      name: 'damage',
      title: 'components.trap.damage.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    damage: 1,
  }),
};
