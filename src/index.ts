import {
  Engine,

  Animator,
  CameraSystem,
  KeyboardInputSystem,
  KeyboardControlSystem,
  MouseInputSystem,
  MouseControlSystem,
  PhysicsSystem,
  SpriteRenderer,
  ScriptSystem,
  UiBridge,
  GameStatsMeter,
  AudioSystem,

  Animatable,
  Camera,
  KeyboardControl,
  MouseControl,
  RigidBody,
  ColliderContainer,
  Light,
  Sprite,
  Transform,
  ScriptBundle,
  AudioSource,
} from 'dacha';
import {
  ParallaxSystem,
  Parallax,
} from 'dacha-game-systems';

import * as GameSystems from './game/systems';
import * as GameComponents from './game/components';
import * as GameScripts from './game/scripts';
import { isTouchDevice } from './utils/is-touch-device';
import { applyIosSafariScreenFix } from './utils/ios-screen-fix';
import { isIos } from './utils/is-ios';

import config from '../data/data.json';

const touchDevice = isTouchDevice();

const engine = new Engine({
  config,
  systems: [
    AudioSystem,
    Animator,
    CameraSystem,
    PhysicsSystem,
    SpriteRenderer,
    UiBridge,
    ScriptSystem,
    GameStatsMeter,
    MouseInputSystem,
    MouseControlSystem,
    ...(!touchDevice
      ? [
        KeyboardInputSystem,
        KeyboardControlSystem,
      ]
      : []
    ),
    ParallaxSystem,
    ...Object.values(GameSystems),
  ],
  components: [
    AudioSource,
    Animatable,
    Camera,
    MouseControl,
    KeyboardControl,
    RigidBody,
    ColliderContainer,
    Light,
    Sprite,
    Transform,
    ScriptBundle,
    Parallax,
    ...Object.values(GameComponents),
  ],
  resources: {
    [ScriptSystem.systemName]: [
      ...Object.values(GameScripts),
    ],
    [UiBridge.systemName]: {
      // comment: to avoid eslint issues with extensions
      // eslint-disable-next-line import/extensions
      loadUiApp: () => import('./ui/index.tsx'),
    },
  },
});

void engine.play();

if (isIos()) {
  applyIosSafariScreenFix();
}
