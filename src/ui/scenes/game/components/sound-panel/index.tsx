import type { FC, ChangeEvent } from 'react';
import { useContext } from 'react';
import { SetAudioVolume } from 'dacha/events';

import { EngineContext } from '../../../../providers';

import './style.css';

export const SoundPanel: FC = () => {
  const { scene } = useContext(EngineContext);

  const handleMasterVolumeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    scene.dispatchEvent(SetAudioVolume, { group: 'master', value: Number(event.target.value) });
  };

  const handleMusicVolumeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    scene.dispatchEvent(SetAudioVolume, { group: 'music', value: Number(event.target.value) });
  };

  const handleEffectsVolumeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    scene.dispatchEvent(SetAudioVolume, { group: 'effects', value: Number(event.target.value) });
  };

  return (
    <div className="sound-panel">
      <label htmlFor="master">
        Master
        <input type="range" min={0} max={1} step={0.1} name="master" onChange={handleMasterVolumeChange} />
      </label>
      <label htmlFor="music">
        Music
        <input type="range" min={0} max={1} step={0.1} name="music" onChange={handleMusicVolumeChange} />
      </label>
      <label htmlFor="effects">
        Effects
        <input type="range" min={0} max={1} step={0.1} name="effects" onChange={handleEffectsVolumeChange} />
      </label>
    </div>
  );
};
