import { useMemo } from 'react';
import type { FC } from 'react';
import {
  Widget,
  useConfig,
} from 'dacha-workbench';
import type { WidgetProps } from 'dacha-workbench';
import type { LevelConfig } from 'dacha';

export const ArcadeCabinetGameWidget: FC<WidgetProps> = ({
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
