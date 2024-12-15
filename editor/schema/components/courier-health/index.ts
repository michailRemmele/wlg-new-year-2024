import type { WidgetSchema } from 'remiz-editor';

export const courierHealth: WidgetSchema = {
  title: 'components.courierHealth.title',
  fields: [
    {
      name: 'points',
      title: 'components.courierHealth.points.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    points: 3,
  }),
};
