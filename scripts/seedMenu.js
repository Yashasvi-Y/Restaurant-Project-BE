require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(mongoURI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => {
    console.error('✗ MongoDB connection error:', err);
    process.exit(1);
  });

const menuItems = [
  // LUNCH - Starters
  {
    category: 'Lunch',
    section: 'Starters',
    name: 'MARLOWE FRIES',
    description: 'herbs, sea salt & horseradish aioli',
    price: 945,
    allergens: [],
    dietaryTags: ['vegan'],
    isSpecial: false
  },
  {
    category: 'Lunch',
    section: 'Starters',
    name: 'BRUSSELS SPROUTS CHIPS',
    description: 'lemon & sea salt',
    price: 1120,
    allergens: [],
    dietaryTags: ['vegan'],
    isSpecial: false
  },
  {
    category: 'Lunch',
    section: 'Starters',
    name: 'Warm DEVILED EGG',
    description: 'aged provolone, pickled jalapeño & bacon',
    price: 470,
    allergens: ['eggs', 'dairy'],
    dietaryTags: [],
    isSpecial: false
  },
  {
    category: 'Lunch',
    section: 'Starters',
    name: 'Crispy POTATO CROQUETTES',
    description: 'mozzarella cheese & homemade ranch',
    price: 1440,
    allergens: ['dairy', 'gluten'],
    dietaryTags: ['vegetarian'],
    isSpecial: false
  },

  // LUNCH - Mains
  {
    category: 'Lunch',
    section: 'Mains',
    name: 'Grilled SKIRT STEAK Salad',
    description: 'head lettuces, shaved parmesan, smoked olive oil & steak sauce vinaigrette',
    price: 2930,
    allergens: ['dairy'],
    dietaryTags: [],
    isSpecial: false
  },
  {
    category: 'Lunch',
    section: 'Mains',
    name: 'Spicy Brick CHICKEN',
    description: 'roasted cauliflower & Calabrian chili romesco',
    price: 3110,
    allergens: [],
    dietaryTags: [],
    isSpecial: true,
    specialBadge: 'Chef\'s Special'
  },
  {
    category: 'Lunch',
    section: 'Mains',
    name: 'Grilled SCALLOPS',
    description: 'avocado, la rossa radicchio & citrus',
    price: 2780,
    allergens: ['shellfish'],
    dietaryTags: [],
    isSpecial: false
  },

  // LUNCH - Salads & Soups
  {
    category: 'Lunch',
    section: 'Salads & Soups',
    name: 'Baby Head LETTUCES',
    description: 'herbs & citrus-shallot vinaigrette',
    price: 1772,
    allergens: [],
    dietaryTags: ['vegan'],
    isSpecial: false
  },
  {
    category: 'Lunch',
    section: 'Salads & Soups',
    name: 'Sweet Gem LETTUCES',
    description: 'Point Reyes blue cheese, candied bacon, herbed breadcrumbs & red wine vinaigrette',
    price: 1720,
    allergens: ['dairy'],
    dietaryTags: [],
    isSpecial: false
  },
  {
    category: 'Lunch',
    section: 'Salads & Soups',
    name: 'Grilled GULF SHRIMP',
    description: 'HOT & boozy cocktail sauce',
    price: 1690,
    allergens: ['shellfish'],
    dietaryTags: [],
    isSpecial: false
  },
  {
    category: 'Lunch',
    section: 'Salads & Soups',
    name: 'Grilled Delta ASPARAGUS',
    description: 'prosciutto di parma & lemon hollandaise',
    price: 3260,
    allergens: ['eggs', 'dairy'],
    dietaryTags: [],
    isSpecial: false
  },

  // LUNCH - Sandwiches
  {
    category: 'Lunch',
    section: 'Sandwiches',
    name: 'FAVA BEAN HUMMUS SANDWICH',
    description: 'toasted rosemary focaccia, garlic-chili broccolini, persian cucumber, pea sprouts & oregano vinaigrette',
    price: 1690,
    allergens: ['gluten'],
    dietaryTags: ['vegan'],
    isSpecial: false
  },
  {
    category: 'Lunch',
    section: 'Sandwiches',
    name: 'ROAST BEEF SANDWICH',
    description: 'warm beef, caramelized onions, aged cheddar & horseradish mayo',
    price: 2240,
    allergens: ['gluten', 'dairy'],
    dietaryTags: [],
    isSpecial: false
  },

  // DINNER - Starters
  {
    category: 'Dinner',
    section: 'Starters',
    name: 'Seared FOIE GRAS',
    description: 'toasted brioche, fig jam, fleur de sel',
    price: 3500,
    allergens: ['gluten'],
    dietaryTags: [],
    isSpecial: true,
    specialBadge: 'Seasonal'
  },
  {
    category: 'Dinner',
    section: 'Starters',
    name: 'OYSTERS (3pc)',
    description: 'fresh mignonette, cocktail sauce',
    price: 2400,
    allergens: ['shellfish'],
    dietaryTags: [],
    isSpecial: false
  },
  {
    category: 'Dinner',
    section: 'Starters',
    name: 'Burrata & BURRATA',
    description: 'heirloom tomatoes, micro basil, aged balsamic',
    price: 2100,
    allergens: ['dairy'],
    dietaryTags: ['vegetarian'],
    isSpecial: false
  },

  // DINNER - Mains
  {
    category: 'Dinner',
    section: 'Mains',
    name: 'Pan-seared HALIBUT',
    description: 'charred broccolini, brown butter emulsion, lemon',
    price: 4200,
    allergens: ['fish', 'dairy'],
    dietaryTags: [],
    isSpecial: false
  },
  {
    category: 'Dinner',
    section: 'Mains',
    name: 'Herb-crusted LAMB RIBS',
    description: 'fresno chili salsa verde, mint yogurt',
    price: 3800,
    allergens: ['dairy'],
    dietaryTags: [],
    isSpecial: true,
    specialBadge: 'Chef\'s Special'
  },
  {
    category: 'Dinner',
    section: 'Mains',
    name: 'Truffle RISOTTO',
    description: 'wild mushrooms, aged parmesan, black truffle oil',
    price: 3200,
    allergens: ['dairy', 'gluten'],
    dietaryTags: ['vegetarian'],
    isSpecial: false
  },

  // DINNER - Desserts
  {
    category: 'Dinner',
    section: 'Desserts',
    name: 'CHOCOLATE SOUFFLÉ',
    description: 'warm chocolate center, raspberry coulis, vanilla bean ice cream',
    price: 1450,
    allergens: ['eggs', 'dairy', 'gluten'],
    dietaryTags: [],
    isSpecial: false
  },
  {
    category: 'Dinner',
    section: 'Desserts',
    name: 'CRÈME BRÛLÉE',
    description: 'madagascar vanilla, caramelized sugar top',
    price: 1200,
    allergens: ['eggs', 'dairy'],
    dietaryTags: [],
    isSpecial: false
  },
  {
    category: 'Dinner',
    section: 'Desserts',
    name: 'LEMON TART',
    description: 'shortbread crust, lemon curd, meringue',
    price: 1100,
    allergens: ['eggs', 'dairy', 'gluten'],
    dietaryTags: [],
    isSpecial: false
  },

  // BEVERAGES - Wines
  {
    category: 'Beverages',
    section: 'Wines',
    name: 'CABERNET SAUVIGNON',
    description: 'Napa Valley, 2019 - bold & structured',
    price: 2800,
    allergens: [],
    dietaryTags: ['vegan'],
    isSpecial: false
  },
  {
    category: 'Beverages',
    section: 'Wines',
    name: 'PINOT NOIR',
    description: 'Willamette Valley, 2020 - elegant & fruity',
    price: 2400,
    allergens: [],
    dietaryTags: ['vegan'],
    isSpecial: false
  },
  {
    category: 'Beverages',
    section: 'Wines',
    name: 'SAUVIGNON BLANC',
    description: 'Loire Valley, 2021 - crisp & refreshing',
    price: 2100,
    allergens: [],
    dietaryTags: ['vegan'],
    isSpecial: false
  },
  {
    category: 'Beverages',
    section: 'Wines',
    name: 'CHARDONNAY',
    description: 'Burgundy, 2020 - buttery & complex',
    price: 2600,
    allergens: [],
    dietaryTags: ['vegan'],
    isSpecial: false
  },
  {
    category: 'Beverages',
    section: 'Wines',
    name: 'CHAMPAGNE BRUT',
    description: 'Épernay, NV - elegant & celebratory',
    price: 3500,
    allergens: [],
    dietaryTags: ['vegan'],
    isSpecial: true,
    specialBadge: 'Premium'
  },

  // BEVERAGES - Cocktails
  {
    category: 'Beverages',
    section: 'Cocktails',
    name: 'MARGARITA',
    description: 'tequila, lime juice, triple sec, salt rim',
    price: 850,
    allergens: [],
    dietaryTags: ['vegan'],
    isSpecial: false
  },
  {
    category: 'Beverages',
    section: 'Cocktails',
    name: 'OLD FASHIONED',
    description: 'whiskey, bitters, sugar, orange twist',
    price: 950,
    allergens: [],
    dietaryTags: ['vegan'],
    isSpecial: false
  },
  {
    category: 'Beverages',
    section: 'Cocktails',
    name: 'MOJITO',
    description: 'rum, mint, lime, soda water, sugar',
    price: 780,
    allergens: [],
    dietaryTags: ['vegan'],
    isSpecial: false
  },
  {
    category: 'Beverages',
    section: 'Cocktails',
    name: 'PISCO SOUR',
    description: 'Peruvian pisco, lime, egg white, bitters',
    price: 920,
    allergens: ['eggs'],
    dietaryTags: [],
    isSpecial: false
  },
  {
    category: 'Beverages',
    section: 'Cocktails',
    name: 'NEGRONI',
    description: 'gin, Campari, sweet vermouth, orange twist',
    price: 890,
    allergens: [],
    dietaryTags: ['vegan'],
    isSpecial: true,
    specialBadge: 'Classic'
  },
  {
    category: 'Beverages',
    section: 'Cocktails',
    name: 'DAIQUIRI ÉLÉGANT',
    description: 'aged rum, fresh lime, organic cane sugar',
    price: 1100,
    allergens: [],
    dietaryTags: ['vegan'],
    isSpecial: true,
    specialBadge: 'Chef\'s Pick'
  },
  {
    category: 'Beverages',
    section: 'Cocktails',
    name: 'ESPRESSO MARTINI',
    description: 'vodka, coffee liqueur, fresh espresso, foam',
    price: 950,
    allergens: [],
    dietaryTags: ['vegan'],
    isSpecial: false
  },

  // LUNCH - Additional Desserts
  {
    category: 'Lunch',
    section: 'Desserts',
    name: 'PISTACHIO PANNA COTTA',
    description: 'roasted pistachios, raspberry coulis, edible flowers',
    price: 1350,
    allergens: ['dairy'],
    dietaryTags: ['vegetarian'],
    isSpecial: true,
    specialBadge: 'Seasonal'
  },
  {
    category: 'Lunch',
    section: 'Desserts',
    name: 'DARK CHOCOLATE TORTE',
    description: 'flourless, valrhona chocolate, sea salt caramel',
    price: 1280,
    allergens: ['eggs', 'dairy'],
    dietaryTags: [],
    isSpecial: false
  },
];

async function seedDatabase() {
  try {
    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('✓ Cleared existing menu items');

    // Insert new items
    const result = await MenuItem.insertMany(menuItems);
    console.log(`✓ Successfully added ${result.length} menu items to database`);

    // Show filter options
    const allergens = await MenuItem.distinct('allergens');
    const dietaryTags = await MenuItem.distinct('dietaryTags');
    const categories = await MenuItem.distinct('category');

    console.log('\n📋 Available Filters:');
    console.log('  Allergens:', allergens.filter(a => a).join(', '));
    console.log('  Dietary Tags:', dietaryTags.filter(d => d).join(', '));
    console.log('  Categories:', categories.join(', '));

    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
