import type { WidgetSchema } from 'remiz-editor';

export const cursorPainter: WidgetSchema = {
  title: 'systems.cursorPainter.title',
  fields: [
    {
      name: 'windowNodeId',
      title: 'systems.cursorPainter.windowNodeId.title',
      type: 'string',
    },
    {
      name: 'src',
      title: 'systems.cursorPainter.src.title',
      type: 'file',
      properties: {
        extensions: ['png'],
      },
    },
  ],
  getInitialState: () => ({
    windowNodeId: '',
  }),
};
