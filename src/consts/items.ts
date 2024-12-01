import {
  ExampleItem1,
  ExampleItem2,
} from './templates';

interface Item {
  name: string
  title: string
  imageUrl: string
}

export const ITEM: Record<string, Item> = {
  [ExampleItem1]: {
    name: 'exampleItem1',
    title: 'Предмет 1',
    imageUrl: './images/example-item-1.png',
  },
  [ExampleItem2]: {
    name: 'exampleItem2',
    title: 'Предмет 2',
    imageUrl: './images/example-item-2.png',
  },
};
