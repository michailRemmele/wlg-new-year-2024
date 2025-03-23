import type { WidgetPartSchema } from 'dacha-workbench';

export const lockerScript: WidgetPartSchema = {
  fields: [
    {
      name: 'items',
      title: 'resources.scriptSystem.lockerScript.items.title',
      type: 'multitext',
    },
  ],
  getInitialState: () => ({
    items: [],
  }),
};
