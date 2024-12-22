import type { WidgetPartSchema } from 'remiz-editor';

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
