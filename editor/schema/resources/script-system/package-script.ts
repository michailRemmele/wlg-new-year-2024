import type { WidgetPartSchema } from 'remiz-editor';

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
