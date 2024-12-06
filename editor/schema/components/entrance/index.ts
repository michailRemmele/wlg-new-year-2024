import type { WidgetSchema } from 'remiz-editor';

import { EntranceWidget } from './view';

export const entrance: WidgetSchema = {
  title: 'components.entrance.title',
  fields: [
    {
      name: 'levelId',
      title: 'components.entrance.levelId.title',
      type: 'select',
      referenceId: 'levels',
    },
    {
      name: 'spawnerId',
      title: 'components.entrance.spawnerId.title',
      type: 'select',
      referenceId: 'spawners',
    },
  ],
  view: EntranceWidget,
  getInitialState: () => ({
    levelId: '',
    spawnerId: '',
  }),
};
