import type { WidgetSchema } from 'remiz-editor';

export const interactable: WidgetSchema = {
  title: 'components.interactable.title',
  fields: [
    {
      name: 'action',
      title: 'components.interactable.action.title',
      type: 'select',
      referenceId: 'actions',
    },
  ],
  references: {
    actions: {
      items: [
        {
          title: 'components.interactable.actions.take.title',
          value: 'take',
        },
        {
          title: 'components.interactable.actions.enter.title',
          value: 'enter',
        },
        {
          title: 'components.interactable.actions.inspect.title',
          value: 'inspect',
        },
      ],
    },
  },
  getInitialState: () => ({
    action: 'take',
  }),
};
