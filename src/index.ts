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
} from 'remiz';

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
    ...Object.values(GameSystems),
  ],
  components: [
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
