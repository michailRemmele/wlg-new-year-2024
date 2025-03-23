import type { WidgetPartSchema } from 'dacha-workbench';

export const audioManagerScript: WidgetPartSchema = {
  fields: [
    {
      name: 'buttonPress',
      title: 'buttonPress',
      type: 'string',
    },
    {
      name: 'enterRoom',
      title: 'enterRoom',
      type: 'string',
    },
    {
      name: 'takeItem',
      title: 'takeItem',
      type: 'string',
    },
    {
      name: 'selectItem',
      title: 'selectItem',
      type: 'string',
    },
    {
      name: 'switchOn',
      title: 'switchOn',
      type: 'string',
    },
    {
      name: 'lockerOpen',
      title: 'lockerOpen',
      type: 'string',
    },
    {
      name: 'shortCircuit',
      title: 'shortCircuit',
      type: 'string',
    },
  ],
};
