import { useMemo } from 'react';
import type { FC } from 'react';
import {
  Widget,
  useConfig,
} from 'remiz-editor';
import type { WidgetProps } from 'remiz-editor';
import type { LevelConfig } from 'remiz';

export const ElectricalPanelGameWidget: FC<WidgetProps> = ({
  fields,
  path,
  references,
}) => {
  const levels = useConfig('levels') as Array<LevelConfig>;

  const extendedReferences = useMemo(() => ({
    ...references,
    levels: {
      items: levels.map((level) => ({
        title: level.name,
        value: level.id,
      })),
    },
  }), [references]);

  return (
    <Widget path={path} fields={fields} references={extendedReferences} />
  );
};
