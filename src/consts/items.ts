import {
  EXAMPLE_ITEM_1_ID,
  EXAMPLE_ITEM_2_ID,
  EXAMPLE_ITEM_3_ID,
  EXAMPLE_ITEM_4_ID,
  EXAMPLE_ITEM_5_ID,
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
  [EXAMPLE_ITEM_1_ID]: {
    name: 'exampleItem1',
    title: 'Предмет 1',
    imageUrl: './images/example-item-1.png',
    templateId: 'c9491264-a219-480b-b5f3-baf9434a04ba',
  },
  [EXAMPLE_ITEM_2_ID]: {
    name: 'exampleItem2',
    title: 'Предмет 2',
    imageUrl: './images/example-item-2.png',
    templateId: '9dda67a3-d655-4615-9570-03a69b0f8e02',
  },
  [EXAMPLE_ITEM_3_ID]: {
    name: 'exampleItem3',
    title: 'Предмет 3',
    imageUrl: './images/example-item-3.png',
    templateId: '4f114cf8-6b1f-45dd-886b-329ef8ab9099',
  },
  [EXAMPLE_ITEM_4_ID]: {
    name: 'exampleItem4',
    title: 'Предмет 4',
    imageUrl: './images/example-item-4.png',
    templateId: '77bcfe83-72de-4a00-9a57-53814b206d80',
  },
  [EXAMPLE_ITEM_5_ID]: {
    name: 'exampleItem5',
    title: 'Предмет 5',
    imageUrl: './images/example-item-5.png',
    templateId: 'b74d6f6c-3025-4acb-ba09-f22684a1a907',
  },

  [PIZZA_ID]: {
    name: 'pizza',
    title: 'Пицца',
    imageUrl: './images/pizza.png',
    templateId: PIZZA_ID,
    onlyTemplate: true,
  },
};
