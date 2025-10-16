const sampleMenuItems: MenuItem[] = [
  // Indian Flavour Pizzas
  {
    id: "1",
    name: "Paneer Tikka Pizza",
    description: "Marinated paneer tikka with onions, capsicum, and Indian spices on pizza base",
    price: 499,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 20,
    category: "indian-pizzas",
    sizes: [
      { name: "Small", price: 499, diameter: "9\"", servings: 2 },
      { name: "Medium", price: 699, diameter: "12\"", servings: 3 },
      { name: "Large", price: 899, diameter: "15\"", servings: 4 }
    ]
  },
  {
    id: "2",
    name: "Tandoori Chicken Pizza",
    description: "Tandoori chicken pieces with mint chutney and cheese",
    price: 599,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 22,
    category: "indian-pizzas",
    sizes: [
      { name: "Small", price: 599, diameter: "9\"", servings: 2 },
      { name: "Medium", price: 799, diameter: "12\"", servings: 3 },
      { name: "Large", price: 999, diameter: "15\"", servings: 4 }
    ]
  },
  {
    id: "3",
    name: "Butter Chicken Pizza",
    description: "Creamy butter chicken sauce with mozzarella cheese",
    price: 649,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 25,
    category: "indian-pizzas",
    sizes: [
      { name: "Small", price: 649, diameter: "9\"", servings: 2 },
      { name: "Medium", price: 849, diameter: "12\"", servings: 3 },
      { name: "Large", price: 1049, diameter: "15\"", servings: 4 }
    ]
  },
  {
    id: "4",
    name: "Achari Paneer Pizza",
    description: "Paneer with pickling spices and tangy achari flavor",
    price: 549,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 20,
    category: "indian-pizzas",
    sizes: [
      { name: "Small", price: 549, diameter: "9\"", servings: 2 },
      { name: "Medium", price: 749, diameter: "12\"", servings: 3 },
      { name: "Large", price: 949, diameter: "15\"", servings: 4 }
    ]
  },
  {
    id: "5",
    name: "Masala Corn Pizza",
    description: "Sweet corn with Indian masala spices and cheese",
    price: 449,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 18,
    category: "indian-pizzas",
    sizes: [
      { name: "Small", price: 449, diameter: "9\"", servings: 2 },
      { name: "Medium", price: 649, diameter: "12\"", servings: 3 },
      { name: "Large", price: 849, diameter: "15\"", servings: 4 }
    ]
  },
  {
    id: "6",
    name: "Keema Masala Pizza",
    description: "Minced meat with aromatic Indian spices",
    price: 699,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 25,
    category: "indian-pizzas",
    sizes: [
      { name: "Small", price: 699, diameter: "9\"", servings: 2 },
      { name: "Medium", price: 899, diameter: "12\"", servings: 3 },
      { name: "Large", price: 1099, diameter: "15\"", servings: 4 }
    ]
  },
  {
    id: "7",
    name: "Amritsari Fish Pizza",
    description: "Premium Amritsari fish with Indian herbs and spices",
    price: 849,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 28,
    category: "indian-pizzas",
    sizes: [
      { name: "Small", price: 849, diameter: "9\"", servings: 2 },
      { name: "Medium", price: 1049, diameter: "12\"", servings: 3 },
      { name: "Large", price: 1249, diameter: "15\"", servings: 4 }
    ]
  },

  // Indian Starters & Sides
  {
    id: "8",
    name: "Veg Samosa (2 pcs)",
    description: "Crispy pastry filled with spiced potatoes and peas",
    price: 199,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 10,
    category: "starters",
    portionSizes: [
      { name: "2 pcs", price: 199, weight: "120g", description: "Perfect for one person" },
      { name: "4 pcs", price: 349, weight: "240g", description: "Good for sharing" },
      { name: "6 pcs", price: 499, weight: "360g", description: "Party size" }
    ]
  },
  {
    id: "9",
    name: "Paneer Pakora",
    description: "Crispy fried paneer with gram flour batter",
    price: 299,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 12,
    category: "starters",
    portionSizes: [
      { name: "Regular", price: 299, weight: "200g", description: "6 pieces" },
      { name: "Large", price: 449, weight: "300g", description: "10 pieces" }
    ]
  },
  {
    id: "10",
    name: "Chicken Pakora",
    description: "Tender chicken pieces fried in spiced gram flour",
    price: 349,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 15,
    category: "starters",
    portionSizes: [
      { name: "Regular", price: 349, weight: "200g", description: "6 pieces" },
      { name: "Large", price: 499, weight: "300g", description: "10 pieces" }
    ]
  },
  {
    id: "11",
    name: "Fish Fingers",
    description: "Crispy fish fingers with tartar sauce",
    price: 449,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 12,
    category: "starters",
    portionSizes: [
      { name: "4 pcs", price: 449, weight: "150g", description: "Regular portion" },
      { name: "8 pcs", price: 799, weight: "300g", description: "Large portion" }
    ]
  },
  {
    id: "12",
    name: "Onion Rings with Masala Dip",
    description: "Crispy onion rings with special masala dip",
    price: 249,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 8,
    category: "starters",
    portionSizes: [
      { name: "Regular", price: 249, weight: "120g", description: "8 rings" },
      { name: "Large", price: 399, weight: "200g", description: "12 rings" }
    ]
  },
  {
    id: "13",
    name: "Garlic Naan Sticks",
    description: "Soft naan sticks with garlic butter and cheese dip",
    price: 299,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 10,
    category: "starters",
    portionSizes: [
      { name: "4 pcs", price: 299, weight: "200g", description: "Regular portion" },
      { name: "8 pcs", price: 499, weight: "400g", description: "Sharing portion" }
    ]
  },
  {
    id: "14",
    name: "Hara Bhara Kabab",
    description: "Spinach and green peas kababs with mint chutney",
    price: 349,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 15,
    category: "starters",
    portionSizes: [
      { name: "4 pcs", price: 349, weight: "200g", description: "Regular portion" },
      { name: "6 pcs", price: 499, weight: "300g", description: "Large portion" }
    ]
  },
  {
    id: "15",
    name: "Veg Cutlet",
    description: "Mixed vegetable cutlets with spicy ketchup",
    price: 249,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 12,
    category: "starters",
    portionSizes: [
      { name: "2 pcs", price: 249, weight: "150g", description: "Regular portion" },
      { name: "4 pcs", price: 399, weight: "300g", description: "Large portion" }
    ]
  },

  // Indian Burgers / Wraps
  {
    id: "16",
    name: "Aloo Tikki Burger",
    description: "Spiced potato patty with Indian spices in burger bun",
    price: 349,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 12,
    category: "burgers-wraps"
  },
  {
    id: "17",
    name: "Paneer Tikka Burger",
    description: "Grilled paneer tikka with Indian spices in burger",
    price: 449,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 15,
    category: "burgers-wraps"
  },
  {
    id: "18",
    name: "Chicken Seekh Burger",
    description: "Minced chicken seekh kebab in burger bun",
    price: 499,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 15,
    category: "burgers-wraps"
  },
  {
    id: "19",
    name: "Paneer Kathi Roll",
    description: "Paneer tikka wrapped in Indian flatbread with chutney",
    price: 399,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 12,
    category: "burgers-wraps"
  },
  {
    id: "20",
    name: "Chicken Kathi Roll",
    description: "Grilled chicken wrapped in Indian flatbread",
    price: 449,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 12,
    category: "burgers-wraps"
  },
  {
    id: "21",
    name: "Egg Roll",
    description: "Spiced egg wrapped in Indian flatbread with vegetables",
    price: 299,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 10,
    category: "burgers-wraps"
  },

  // Indian Main Course Combos
  {
    id: "22",
    name: "Butter Chicken + Naan/Paratha",
    description: "Creamy butter chicken with 2 butter naans or parathas",
    price: 599,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 25,
    category: "main-course"
  },
  {
    id: "23",
    name: "Dal Makhani + Jeera Rice",
    description: "Creamy black lentils with cumin rice",
    price: 549,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 20,
    category: "main-course"
  },
  {
    id: "24",
    name: "Paneer Butter Masala + Naan",
    description: "Cottage cheese in creamy tomato gravy with butter naan",
    price: 579,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 20,
    category: "main-course"
  },
  {
    id: "25",
    name: "Rajma Chawal",
    description: "Red kidney beans curry with steamed rice",
    price: 499,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 15,
    category: "main-course"
  },
  {
    id: "26",
    name: "Chole Chawal",
    description: "Chickpea curry with steamed rice",
    price: 499,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 15,
    category: "main-course"
  },
  {
    id: "27",
    name: "Chicken Curry + Rice Combo",
    description: "Spicy chicken curry with steamed basmati rice",
    price: 649,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 25,
    category: "main-course"
  },
  {
    id: "28",
    name: "Veg Thali (Mini)",
    description: "Mini thali with roti, sabzi, dal, rice, and pickle",
    price: 549,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 20,
    category: "main-course"
  },
  {
    id: "29",
    name: "Chicken Thali (Mini)",
    description: "Mini thali with roti, chicken curry, dal, rice, and pickle",
    price: 699,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 25,
    category: "main-course"
  },

  // Indian Street Food
  {
    id: "30",
    name: "Pav Bhaji",
    description: "Spiced mashed vegetables with buttered pav bread",
    price: 399,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 15,
    category: "street-food",
    portionSizes: [
      { name: "Single", price: 399, weight: "400g", description: "2 pav with bhaji" },
      { name: "Double", price: 599, weight: "600g", description: "4 pav with extra bhaji" }
    ]
  },
  {
    id: "31",
    name: "Vada Pav",
    description: "Spiced potato fritter in bun with chutneys",
    price: 299,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 10,
    category: "street-food",
    portionSizes: [
      { name: "1 pc", price: 299, weight: "150g", description: "Single vada pav" },
      { name: "2 pcs", price: 499, weight: "300g", description: "Two vada pav" }
    ]
  },
  {
    id: "32",
    name: "Misal Pav",
    description: "Spicy sprouted curry with pav bread",
    price: 349,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 15,
    category: "street-food",
    portionSizes: [
      { name: "Regular", price: 349, weight: "350g", description: "2 pav with misal" },
      { name: "Large", price: 499, weight: "500g", description: "4 pav with extra misal" }
    ]
  },
  {
    id: "33",
    name: "Bhel Puri",
    description: "Puffed rice with vegetables, chutneys, and sev",
    price: 249,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 5,
    category: "street-food",
    portionSizes: [
      { name: "Regular", price: 249, weight: "200g", description: "Single serving" },
      { name: "Large", price: 399, weight: "350g", description: "Sharing size" }
    ]
  },
  {
    id: "34",
    name: "Dahi Puri",
    description: "Crispy puris filled with yogurt and chutneys",
    price: 299,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 8,
    category: "street-food",
    portionSizes: [
      { name: "6 pcs", price: 299, weight: "250g", description: "Regular portion" },
      { name: "12 pcs", price: 499, weight: "450g", description: "Large portion" }
    ]
  },
  {
    id: "35",
    name: "Sev Puri",
    description: "Crispy puris with potatoes, chutneys, and sev",
    price: 249,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 5,
    category: "street-food",
    portionSizes: [
      { name: "6 pcs", price: 249, weight: "200g", description: "Regular portion" },
      { name: "12 pcs", price: 399, weight: "350g", description: "Large portion" }
    ]
  },
  {
    id: "36",
    name: "Pani Puri (6 pcs)",
    description: "Hollow puris with spicy water and fillings",
    price: 199,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 8,
    category: "street-food",
    portionSizes: [
      { name: "6 pcs", price: 199, weight: "180g", description: "Regular portion" },
      { name: "12 pcs", price: 349, weight: "350g", description: "Large portion" }
    ]
  },
  {
    id: "37",
    name: "Aloo Tikki Chaat",
    description: "Spiced potato patties with chutneys and yogurt",
    price: 299,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: true,
    preparationTime: 10,
    category: "street-food",
    portionSizes: [
      { name: "2 pcs", price: 299, weight: "200g", description: "Regular portion" },
      { name: "4 pcs", price: 499, weight: "350g", description: "Large portion" }
    ]
  },

  // Indian Snacks & Finger Food
  {
    id: "38",
    name: "Veg Momos (6 pcs)",
    description: "Steamed vegetable dumplings with spicy chutney",
    price: 349,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 12,
    category: "snacks",
    portionSizes: [
      { name: "6 pcs", price: 349, weight: "200g", description: "Regular portion" },
      { name: "12 pcs", price: 599, weight: "400g", description: "Large portion" }
    ]
  },
  {
    id: "39",
    name: "Chicken Momos (6 pcs)",
    description: "Steamed chicken dumplings with spicy chutney",
    price: 449,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 12,
    category: "snacks",
    portionSizes: [
      { name: "6 pcs", price: 449, weight: "250g", description: "Regular portion" },
      { name: "12 pcs", price: 799, weight: "500g", description: "Large portion" }
    ]
  },
  {
    id: "40",
    name: "Tandoori Veg Momos (6 pcs)",
    description: "Tandoori roasted vegetable momos with mint chutney",
    price: 449,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 15,
    category: "snacks",
    portionSizes: [
      { name: "6 pcs", price: 449, weight: "220g", description: "Regular portion" },
      { name: "12 pcs", price: 799, weight: "440g", description: "Large portion" }
    ]
  },
  {
    id: "41",
    name: "Paneer Malai Tikka",
    description: "Creamy paneer tikka with aromatic spices",
    price: 499,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 18,
    category: "snacks",
    portionSizes: [
      { name: "6 pcs", price: 499, weight: "300g", description: "Regular portion" },
      { name: "10 pcs", price: 799, weight: "500g", description: "Large portion" }
    ]
  },
  {
    id: "42",
    name: "Chicken Malai Tikka",
    description: "Creamy chicken tikka with aromatic spices",
    price: 549,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 18,
    category: "snacks",
    portionSizes: [
      { name: "6 pcs", price: 549, weight: "350g", description: "Regular portion" },
      { name: "10 pcs", price: 899, weight: "550g", description: "Large portion" }
    ]
  },
  {
    id: "43",
    name: "Veg Seekh Kabab",
    description: "Mixed vegetable seekh kababs with mint chutney",
    price: 399,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 15,
    category: "snacks",
    portionSizes: [
      { name: "4 pcs", price: 399, weight: "250g", description: "Regular portion" },
      { name: "8 pcs", price: 699, weight: "500g", description: "Large portion" }
    ]
  },
  {
    id: "44",
    name: "Chicken Seekh Kabab",
    description: "Minced chicken seekh kababs with mint chutney",
    price: 449,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 15,
    category: "snacks",
    portionSizes: [
      { name: "4 pcs", price: 449, weight: "300g", description: "Regular portion" },
      { name: "8 pcs", price: 799, weight: "600g", description: "Large portion" }
    ]
  },
  {
    id: "45",
    name: "Mini Samosa (6 pcs)",
    description: "Small crispy samosas with spiced potatoes",
    price: 299,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 10,
    category: "snacks",
    portionSizes: [
      { name: "6 pcs", price: 299, weight: "150g", description: "Regular portion" },
      { name: "12 pcs", price: 499, weight: "300g", description: "Large portion" }
    ]
  },
  {
    id: "46",
    name: "Kachori (4 pcs)",
    description: "Crispy lentil-filled pastries with chutney",
    price: 249,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 8,
    category: "snacks",
    portionSizes: [
      { name: "4 pcs", price: 249, weight: "160g", description: "Regular portion" },
      { name: "8 pcs", price: 399, weight: "320g", description: "Large portion" }
    ]
  },

  // Indian Biryani & Rice
  {
    id: "47",
    name: "Veg Dum Biryani",
    description: "Aromatic vegetable biryani cooked in dum style",
    price: 549,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    preparationTime: 25,
    category: "biryani-rice",
    portionSizes: [
      { name: "Half", price: 549, weight: "400g", description: "Serves 1-2" },
      { name: "Full", price: 899, weight: "800g", description: "Serves 3-4" }
    ]
  },
  {
    id: "48",
    name: "Chicken Dum Biryani",
    description: "Aromatic chicken biryani cooked in dum style",
    price: 649,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 30,
    category: "biryani-rice",
    portionSizes: [
      { name: "Half", price: 649, weight: "450g", description: "Serves 1-2" },
      { name: "Full", price: 999, weight: "900g", description: "Serves 3-4" }
    ]
  },
  {
    id: "49",
    name: "Egg Biryani",
    description: "Aromatic biryani with boiled eggs and spices",
    price: 599,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 25,
    category: "biryani-rice",
    portionSizes: [
      { name: "Half", price: 599, weight: "400g", description: "Serves 1-2" },
      { name: "Full", price: 899, weight: "800g", description: "Serves 3-4" }
    ]
  },
  {
    id: "50",
    name: "Hyderabadi Mutton Biryani",
    description: "Authentic Hyderabadi mutton biryani with aromatic spices",
    price: 849,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: true,
    preparationTime: 35,
    category: "biryani-rice",
    portionSizes: [
      { name: "Half", price: 849, weight: "500g", description: "Serves 1-2" },
      { name: "Full", price: 1299, weight: "1000g", description: "Serves 3-4" }
    ]
  },
  {
    id: "51",
    name: "Veg Pulao",
    description: "Mild vegetable pulao with aromatic spices",
    price: 499,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 20,
    category: "biryani-rice",
    portionSizes: [
      { name: "Half", price: 499, weight: "350g", description: "Serves 1-2" },
      { name: "Full", price: 799, weight: "700g", description: "Serves 3-4" }
    ]
  },

  // Beverages
  {
    id: "52",
    name: "Masala Chai",
    description: "Traditional Indian spiced tea",
    price: 99,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 5,
    category: "beverages",
    weights: [
      { name: "Regular", price: 99, weight: "200ml", description: "Standard cup" },
      { name: "Large", price: 149, weight: "300ml", description: "Big cup" }
    ]
  },
  {
    id: "53",
    name: "Cold Coffee",
    description: "Refreshing cold coffee with ice cream",
    price: 149,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 3,
    category: "beverages",
    weights: [
      { name: "Regular", price: 149, weight: "250ml", description: "Standard glass" },
      { name: "Large", price: 199, weight: "400ml", description: "Big glass" }
    ]
  },
  {
    id: "54",
    name: "Fresh Lime Soda",
    description: "Fresh lime with soda and spices",
    price: 119,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 2,
    category: "beverages",
    weights: [
      { name: "Regular", price: 119, weight: "250ml", description: "Standard glass" },
      { name: "Large", price: 169, weight: "400ml", description: "Big glass" }
    ]
  },
  {
    id: "55",
    name: "Mango Lassi",
    description: "Sweet mango yogurt drink",
    price: 179,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 3,
    category: "beverages",
    weights: [
      { name: "Regular", price: 179, weight: "300ml", description: "Standard glass" },
      { name: "Large", price: 249, weight: "450ml", description: "Big glass" }
    ]
  },
  {
    id: "56",
    name: "Salted Lassi",
    description: "Traditional salty yogurt drink",
    price: 149,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 3,
    category: "beverages",
    weights: [
      { name: "Regular", price: 149, weight: "300ml", description: "Standard glass" },
      { name: "Large", price: 199, weight: "450ml", description: "Big glass" }
    ]
  },
  {
    id: "57",
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice",
    price: 199,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 2,
    category: "beverages",
    weights: [
      { name: "Regular", price: 199, weight: "250ml", description: "Standard glass" },
      { name: "Large", price: 299, weight: "400ml", description: "Big glass" }
    ]
  },
  {
    id: "58",
    name: "Mineral Water",
    description: "Chilled mineral water",
    price: 49,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: true,
    isSpicy: false,
    preparationTime: 1,
    category: "beverages",
    weights: [
      { name: "500ml", price: 49, weight: "500ml", description: "Standard bottle" },
      { name: "1L", price: 79, weight: "1L", description: "Large bottle" }
    ]
  },

  // Desserts
  {
    id: "59",
    name: "Gulab Jamun (2 pcs)",
    description: "Soft milk dumplings in sugar syrup",
    price: 149,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 5,
    category: "desserts",
    portionSizes: [
      { name: "2 pcs", price: 149, weight: "100g", description: "Regular portion" },
      { name: "4 pcs", price: 249, weight: "200g", description: "Large portion" }
    ]
  },
  {
    id: "60",
    name: "Rasgulla (2 pcs)",
    description: "Soft cottage cheese balls in sugar syrup",
    price: 129,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 5,
    category: "desserts",
    portionSizes: [
      { name: "2 pcs", price: 129, weight: "120g", description: "Regular portion" },
      { name: "4 pcs", price: 229, weight: "240g", description: "Large portion" }
    ]
  },
  {
    id: "61",
    name: "Kaju Katli",
    description: "Traditional cashew sweet",
    price: 299,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 2,
    category: "desserts",
    weights: [
      { name: "250g", price: 299, weight: "250g", description: "Standard pack" },
      { name: "500g", price: 549, weight: "500g", description: "Large pack" }
    ]
  },
  {
    id: "62",
    name: "Ice Cream Scoop",
    description: "Vanilla/Chocolate/Strawberry",
    price: 149,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 2,
    category: "desserts",
    weights: [
      { name: "1 Scoop", price: 149, weight: "100g", description: "Single scoop" },
      { name: "2 Scoops", price: 249, weight: "200g", description: "Double scoop" },
      { name: "3 Scoops", price: 349, weight: "300g", description: "Triple scoop" }
    ]
  },
  {
    id: "63",
    name: "Kulfi",
    description: "Traditional Indian ice cream",
    price: 199,
    image: "/api/placeholder/300/200",
    isVegetarian: true,
    isVegan: false,
    isSpicy: false,
    preparationTime: 3,
    category: "desserts",
    weights: [
      { name: "Regular", price: 199, weight: "100ml", description: "Single stick" },
      { name: "Large", price: 299, weight: "150ml", description: "Large stick" }
    ]
  },

  // Combos & Special Offers
  {
    id: "64",
    name: "Family Meal Deal",
    description: "2 Large Pizzas + 4 Starters + 4 Beverages",
    price: 1299,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 45,
    category: "combos"
  },
  {
    id: "65",
    name: "Couple Special",
    description: "1 Medium Pizza + 2 Starters + 2 Beverages",
    price: 899,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 30,
    category: "combos"
  },
  {
    id: "66",
    name: "Lunch Express",
    description: "1 Main Course + 1 Starter + 1 Beverage",
    price: 449,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 20,
    category: "combos"
  },
  {
    id: "67",
    name: "Midnight Cravings",
    description: "1 Medium Pizza + 1 Dessert + 1 Beverage",
    price: 599,
    image: "/api/placeholder/300/200",
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    preparationTime: 25,
    category: "combos"
  }
]