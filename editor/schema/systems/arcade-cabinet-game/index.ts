import type { WidgetSchema } from 'remiz-editor';

import { ArcadeCabinetGameWidget } from './view';

export const arcadeCabinetGame: WidgetSchema = {
  title: 'systems.arcadeCabinetGame.title',
  fields: [
    {
      name: 'exitLevelId',
      title: 'systems.arcadeCabinetGame.exitLevelId.title',
      type: 'select',
      referenceId: 'levels',
    },
  ],
  view: ArcadeCabinetGameWidget,
  getInitialState: () => ({
    exitLevelId: '',
  }),
};
