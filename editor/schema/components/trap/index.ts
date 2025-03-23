import type { WidgetSchema } from 'dacha-workbench';

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
