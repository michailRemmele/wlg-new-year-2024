import {
  EXAMPLE_ITEM_1_ID,
  EXAMPLE_ITEM_2_ID,
} from './actors';

interface Item {
  name: string
  title: string
  imageUrl: string
  templateId: string
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
};
