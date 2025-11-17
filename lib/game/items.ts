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
image: require('../../assets/images/water.jpg'),
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
id: 'powerbank',
name: 'Battery Pack (lithium)',
description: 'Lithium batteries are prohibited since 2021',
isProhibited: false,
difficulty: 'medium',
image: require('../../assets/images/powerbank.jpg'),
  },
          {
id: 'lighter',
name: 'Cigarettes lighter',
isProhibited: false,
difficulty: 'hard',
image: require('../../assets/images/lighter.jpg'),
  },
          {
id: 'baseball bat',
name: 'Baseball bat',
isProhibited: true,
difficulty: 'hard',
image: require('../../assets/images/baseball.jpg'),
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
image: require('../../assets/images/ammunition.jpg'),
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
