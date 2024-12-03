import type { FC } from 'react';
import { useContext, useEffect, useState } from 'react';

import * as EventType from '../../../../../game/events';
import type { UpdateJournalEvent } from '../../../../../game/events';
import { EngineContext } from '../../../../providers';

import './style.css';

type Entry = {
  id: string
  title: string
};

export const Journal: FC = () => {
  const { scene } = useContext(EngineContext);

  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const handleUpdateJournal = (event: UpdateJournalEvent): void => {
      setEntries((prev) => [...prev, { id: event.id, title: event.title }]);
    };

    scene.addEventListener(EventType.UpdateJournal, handleUpdateJournal);

    return (): void => {
      scene.removeEventListener(EventType.UpdateJournal, handleUpdateJournal);
    };
  }, []);

  return (
    <div className="journal">
      <ul className="journal__list">
        {entries.map((entry) => (
          <li className="journal__entry" key={entry.id}>
            {entry.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
