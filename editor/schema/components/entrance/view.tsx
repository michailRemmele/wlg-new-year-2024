import { useMemo } from 'react';
import type { FC } from 'react';
import {
  Widget,
  useConfig,
} from 'remiz-editor';
import type { WidgetProps } from 'remiz-editor';
import type { LevelConfig } from 'remiz';

export const EntranceWidget: FC<WidgetProps> = ({
  fields,
  path,
  references,
}) => {
  const levelIdPath = useMemo(() => path.concat('levelId'), [path]);

  const levels = useConfig('levels') as Array<LevelConfig>;
  const levelId = useConfig(levelIdPath);

  const selectedLevel = levels.find((level) => level.id === levelId);

  const extendedReferences = useMemo(() => ({
    ...references,
    levels: {
      items: levels.map((level) => ({
        title: level.name,
        value: level.id,
      })),
    },
    spawners: {
      items: (selectedLevel?.actors ?? []).map((actor) => ({
        title: actor.name,
        value: actor.id,
      })),
    },
  }), [references]);

  return (
    <Widget path={path} fields={fields} references={extendedReferences} />
  );
};
