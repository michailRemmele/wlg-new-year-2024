import {
  BAUBLE_1_ID,
  BAUBLE_2_ID,
  BAUBLE_3_ID,
  BAUBLE_4_ID,
  BAUBLE_5_ID,
  GARLAND_ID,
} from './actors';
import {
  PIZZA_ID,
} from './templates';

interface Item {
  name: string
  title: string
  imageUrl: string
  templateId: string
  onlyTemplate?: boolean
}

export const ITEM: Record<string, Item> = {
  [BAUBLE_1_ID]: {
    name: 'bauble1',
    title: 'Красный шар',
    imageUrl: './images/bauble-1.png',
    templateId: '9738343c-f321-4781-aef8-7224536980dc',
  },
  [BAUBLE_2_ID]: {
    name: 'bauble2',
    title: 'Синий шар',
    imageUrl: './images/bauble-2.png',
    templateId: 'fa503edd-278d-4b6c-8ec3-a0245ea1a247',
  },
  [BAUBLE_3_ID]: {
    name: 'bauble3',
    title: 'Фиолетовый шар',
    imageUrl: './images/bauble-3.png',
    templateId: 'b1aed82a-d5a5-449d-b6ec-9f750da53f24',
  },
  [BAUBLE_4_ID]: {
    name: 'bauble4',
    title: 'Зеленый шар',
    imageUrl: './images/bauble-4.png',
    templateId: 'b8aecb00-27ac-4923-a70f-9e8402bfbdd5',
  },
  [BAUBLE_5_ID]: {
    name: 'bauble5',
    title: 'Бирюзовый шар',
    imageUrl: './images/bauble-5.png',
    templateId: 'c7d71713-3b1c-4d1c-8e51-11afdc71ef42',
  },
  [GARLAND_ID]: {
    name: 'garland',
    title: 'Гирлянда',
    imageUrl: './images/garland.png',
    templateId: 'e44bfbb8-72c9-42ec-a08b-4cfb936828b3',
  },

  [PIZZA_ID]: {
    name: 'pizza',
    title: 'Пицца',
    imageUrl: './images/pizza.png',
    templateId: PIZZA_ID,
    onlyTemplate: true,
  },
};
