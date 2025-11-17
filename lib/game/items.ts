export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameItem = {
id: string;
name: string;
description?: string;
isProhibited: boolean;
difficulty: Difficulty;
image: any;
};

//Easy level
export const easyItems: GameItem[] = [
        {
id: 'book',
name: 'Book',
isProhibited: false,
difficulty: 'easy',
image: require('../../assets/images/book.jpg'),
  },
          {
id: 'tshirt',
name: 'T-shirt',
isProhibited: false,
difficulty: 'easy',
image: require('../../assets/images/tshirt.jpg'),
  },
          {
id: 'snacks',
name: 'Snacks',
isProhibited: false,
difficulty: 'easy',
image: require('../../assets/images/snacks.jpg'),
  },
          {
id: 'umbrella',
name: 'Umbrella',
isProhibited: false,
difficulty: 'easy',
image: require('../../assets/images/umbrella.jpg'),
  },
          {
id: 'water-bottle-500',
name: 'Water Bottle (500 mL)',
description: 'Over the 100 mL liquid rule.',
isProhibited: true,
difficulty: 'easy',
image: require('../../assets/images/water-bottle-500.jpg'),
  },
          {
id: 'knife',
name: 'Kitchen Knife',
isProhibited: true,
difficulty: 'easy',
image: require('../../assets/images/knife.jpg'),
  },
          ];

//Medium level
export const mediumItems: GameItem[] = [
        {
id: 'laptop',
name: 'Laptop',
isProhibited: false,
difficulty: 'medium',
image: require('../../assets/images/laptop.jpg'),
  },
          {
id: 'toothbrush',
name: 'Toothbrush',
isProhibited: false,
difficulty: 'medium',
image: require('../../assets/images/toothbrush.jpg'),
  },
          {
id: 'powerbank',
name: 'Battery Pack',
isProhibited: false,
difficulty: 'medium',
image: require('../../assets/images/powerbank.jpg'),
  },
          {
id: 'scissors',
name: 'Kitchen Scissors',
isProhibited: true,
difficulty: 'medium',
image: require('../../assets/images/scissors.jpg'),
  },
          ];

// Hard level
export const hardItems: GameItem[] = [
        {
id: 'sunscreen-100',
name: 'Sunscreen (100 mL)',
description: 'Exactly 100 mL, allowed.',
isProhibited: false,
difficulty: 'hard',
image: require('../../assets/images/sunscreen-100.jpg'),
  },
          {
id: 'shampoo-80',
name: 'shampoo (80 mL)',
isProhibited: false,
difficulty: 'hard',
image: require('../../assets/images/shampoo-80.jpg'),
  },
          {
id: 'perfume-150',
name: 'Perfume (150 mL)',
description: 'Over the 100 mL rule.',
isProhibited: true,
difficulty: 'hard',
image: require('../../assets/images/perfume-150.jpg'),
  },
          {
id: 'gun',
name: 'Gun',
isProhibited: true,
difficulty: 'hard',
image: require('../../assets/images/gun.jpg'),
  },
          {
id: 'ammo',
name: 'Ammunition',
isProhibited: true,
difficulty: 'hard',
image: require('../../assets/images/ammo.jpg'),
  },
          ];

export const allItems: GameItem[] = [
        ...easyItems,
        ...mediumItems,
        ...hardItems,
        ];

export function getItemsByDifficulty(diff: Difficulty): GameItem[] {
        switch (diff) {
        case 'easy':
        return easyItems;
    case 'medium':
            return mediumItems;
    case 'hard':
            return hardItems;
default:
        return allItems;
  }
          }

export function pickRandomItems(
        diff: Difficulty,
        count: number
): GameItem[] {
        const source = [...getItemsByDifficulty(diff)];
        for (let i = source.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [source[i], source[j]] = [source[j], source[i]];
        }
        return source.slice(0, count);
}
