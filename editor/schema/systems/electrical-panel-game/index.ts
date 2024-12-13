import type { WidgetSchema } from 'remiz-editor';

import { ElectricalPanelGameWidget } from './view';

export const electricalPanelGame: WidgetSchema = {
  title: 'systems.electricalPanelGame.title',
  fields: [
    {
      name: 'windowNodeId',
      title: 'systems.electricalPanelGame.windowNodeId.title',
      type: 'string',
    },
    {
      name: 'exitLevelId',
      title: 'systems.electricalPanelGame.exitLevelId.title',
      type: 'select',
      referenceId: 'levels',
    },
  ],
  view: ElectricalPanelGameWidget,
  getInitialState: () => ({
    windowNodeId: '',
    exitLevelId: '',
  }),
};
