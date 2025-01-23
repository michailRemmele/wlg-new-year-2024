import type { WidgetPartSchema } from 'dacha-workbench';

export const packageScript: WidgetPartSchema = {
  fields: [
    {
      name: 'items',
      title: 'resources.scriptSystem.packageScript.items.title',
      type: 'multitext',
    },
  ],
  getInitialState: () => ({
    items: [],
  }),
};
