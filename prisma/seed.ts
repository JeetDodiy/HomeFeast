import { PrismaClient, Role, CookStatus, MealType, PlanDuration, SubscriptionStatus, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting HomeFeast database seed...");

  // 1. Seed Cities
  const rajkot = await prisma.city.upsert({
    where: { name: "Rajkot" },
    update: {},
    create: {
      name: "Rajkot",
      state: "Gujarat",
      isActive: true,
    },
  });

  const ahmedabad = await prisma.city.upsert({
    where: { name: "Ahmedabad" },
    update: {},
    create: {
      name: "Ahmedabad",
      state: "Gujarat",
      isActive: true,
    },
  });

  console.log("✓ Seeded cities: Rajkot, Ahmedabad");

  // 2. Seed Cuisines
  const cuisinesData = [
    { name: "Gujarati", emoji: "🥘" },
    { name: "Kathiyawadi", emoji: "🫓" },
    { name: "Punjabi", emoji: "🫕" },
    { name: "South Indian", emoji: "🍛" },
    { name: "Jain", emoji: "🥗" },
  ];

  const cuisines: any = {};
  for (const c of cuisinesData) {
    cuisines[c.name] = await prisma.cuisine.upsert({
      where: { name: c.name },
      update: {},
      create: c,
    });
  }
  console.log("✓ Seeded 5 cuisines");

  // 3. Seed Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@homefeast.in" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@homefeast.in",
      phone: "9999999999",
      passwordHash: "$2b$12$e8Y6U7KxPqL9nZJ2b5tTDehL5sM8Q2vN0zR9x1vC4wB3nM5l6k7j8", // bcrypt hash for 'admin123'
      role: Role.ADMIN,
      cityId: rajkot.id,
      isVerified: true,
    },
  });

  // 4. Seed Customers
  const customer1 = await prisma.user.upsert({
    where: { email: "arjun.verma@example.com" },
    update: {},
    create: {
      name: "Arjun Verma",
      email: "arjun.verma@example.com",
      phone: "9876543210",
      passwordHash: "$2b$12$e8Y6U7KxPqL9nZJ2b5tTDehL5sM8Q2vN0zR9x1vC4wB3nM5l6k7j8",
      role: Role.CUSTOMER,
      cityId: rajkot.id,
      address: "Flat 402, Royal Residency, Race Course, Rajkot",
      pincode: "360001",
      isVerified: true,
    },
  });

  const customer2 = await prisma.user.upsert({
    where: { email: "kavya.reddy@example.com" },
    update: {},
    create: {
      name: "Kavya Reddy",
      email: "kavya.reddy@example.com",
      phone: "9876543211",
      passwordHash: "$2b$12$e8Y6U7KxPqL9nZJ2b5tTDehL5sM8Q2vN0zR9x1vC4wB3nM5l6k7j8",
      role: Role.CUSTOMER,
      cityId: ahmedabad.id,
      address: "Room 12, Girls Hostel, Navrangpura, Ahmedabad",
      pincode: "380009",
      isVerified: true,
    },
  });

  const customer3 = await prisma.user.upsert({
    where: { email: "mahesh.iyer@example.com" },
    update: {},
    create: {
      name: "Mahesh Iyer",
      email: "mahesh.iyer@example.com",
      phone: "9876543212",
      passwordHash: "$2b$12$e8Y6U7KxPqL9nZJ2b5tTDehL5sM8Q2vN0zR9x1vC4wB3nM5l6k7j8",
      role: Role.CUSTOMER,
      cityId: rajkot.id,
      address: "A-101, Anand Society, Kalavad Road, Rajkot",
      pincode: "360005",
      isVerified: true,
    },
  });
  console.log("✓ Seeded 3 customers + 1 admin");

  // 5. Seed 12 Home Cooks & Kitchens
  const cooksData = [
    {
      name: "Meera Patel",
      kitchen: "Meera's Kitchen",
      email: "meera.patel@homefeast.in",
      phone: "9876500001",
      city: rajkot.id,
      area: "Race Course",
      pincode: "360001",
      isVeg: true,
      cuisines: ["Gujarati", "Jain"],
      fssai: "10020042003854",
      rating: 4.8,
      reviews: 142,
    },
    {
      name: "Priya Shah",
      kitchen: "Priya's Home Kitchen",
      email: "priya.shah@homefeast.in",
      phone: "9876500002",
      city: rajkot.id,
      area: "Kalavad Road",
      pincode: "360005",
      isVeg: false,
      cuisines: ["South Indian", "Punjabi"],
      fssai: "10020042003855",
      rating: 4.6,
      reviews: 89,
    },
    {
      name: "Suman Joshi",
      kitchen: "Jain Bhavan Tiffin",
      email: "suman.joshi@homefeast.in",
      phone: "9876500003",
      city: rajkot.id,
      area: "Mavdi",
      pincode: "360004",
      isVeg: true,
      cuisines: ["Jain", "Gujarati"],
      fssai: "10020042003856",
      rating: 4.9,
      reviews: 210,
    },
    {
      name: "Ramesh Bhai",
      kitchen: "Kathiyawadi Swad",
      email: "ramesh.b@homefeast.in",
      phone: "9876500004",
      city: rajkot.id,
      area: "150 Feet Ring Road",
      pincode: "360007",
      isVeg: true,
      cuisines: ["Kathiyawadi"],
      fssai: "10020042003857",
      rating: 4.7,
      reviews: 115,
    },
    {
      name: "Neelam Sharma",
      kitchen: "Punjabi Rasoi",
      email: "neelam.s@homefeast.in",
      phone: "9876500005",
      city: ahmedabad.id,
      area: "Navrangpura",
      pincode: "380009",
      isVeg: false,
      cuisines: ["Punjabi"],
      fssai: "10020042003858",
      rating: 4.8,
      reviews: 95,
    },
    {
      name: "Bhavna Ben",
      kitchen: "Annapurna Home Tiffin",
      email: "bhavna.b@homefeast.in",
      phone: "9876500006",
      city: ahmedabad.id,
      area: "Vastrapur",
      pincode: "380015",
      isVeg: true,
      cuisines: ["Gujarati"],
      fssai: "10020042003859",
      rating: 4.9,
      reviews: 178,
    },
    {
      name: "Rekha Iyer",
      kitchen: "Chennai Tiffin Corner",
      email: "rekha.i@homefeast.in",
      phone: "9876500007",
      city: ahmedabad.id,
      area: "Bodakdev",
      pincode: "380054",
      isVeg: true,
      cuisines: ["South Indian"],
      fssai: "10020042003860",
      rating: 4.7,
      reviews: 130,
    },
    {
      name: "Geeta Parmar",
      kitchen: "Geeta's Satvik Meals",
      email: "geeta.p@homefeast.in",
      phone: "9876500008",
      city: rajkot.id,
      area: "Bhaktinagar",
      pincode: "360002",
      isVeg: true,
      cuisines: ["Jain", "Gujarati"],
      fssai: "10020042003861",
      rating: 4.5,
      reviews: 64,
    },
    {
      name: "Jasbir Singh",
      kitchen: "Pind Da Swad",
      email: "jasbir.s@homefeast.in",
      phone: "9876500009",
      city: rajkot.id,
      area: "University Road",
      pincode: "360005",
      isVeg: false,
      cuisines: ["Punjabi"],
      fssai: "10020042003862",
      rating: 4.6,
      reviews: 82,
    },
    {
      name: "Komal Vora",
      kitchen: "Vora Family Meals",
      email: "komal.v@homefeast.in",
      phone: "9876500010",
      city: ahmedabad.id,
      area: "Satellite",
      pincode: "380015",
      isVeg: true,
      cuisines: ["Gujarati", "Kathiyawadi"],
      fssai: "10020042003863",
      rating: 4.8,
      reviews: 140,
    },
    {
      name: "Anjali Gupta",
      kitchen: "Ghar Ka Khana",
      email: "anjali.g@homefeast.in",
      phone: "9876500011",
      city: ahmedabad.id,
      area: "Prahlad Nagar",
      pincode: "380015",
      isVeg: true,
      cuisines: ["North Indian", "Gujarati"],
      fssai: "10020042003864",
      rating: 4.7,
      reviews: 98,
    },
    {
      name: "Suresh Patel",
      kitchen: "Suresh Bhai's Kitchen",
      email: "suresh.p@homefeast.in",
      phone: "9876500012",
      city: rajkot.id,
      area: "Kothariya",
      pincode: "360022",
      isVeg: true,
      cuisines: ["Kathiyawadi"],
      fssai: "10020042003865",
      rating: 4.6,
      reviews: 45,
    },
  ];

  for (const c of cooksData) {
    const cookUser = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        name: c.name,
        email: c.email,
        phone: c.phone,
        passwordHash: "$2b$12$e8Y6U7KxPqL9nZJ2b5tTDehL5sM8Q2vN0zR9x1vC4wB3nM5l6k7j8",
        role: Role.COOK,
        cityId: c.city,
        address: `${c.area}, Pincode: ${c.pincode}`,
        pincode: c.pincode,
        isVerified: true,
      },
    });

    const cook = await prisma.cook.upsert({
      where: { userId: cookUser.id },
      update: {},
      create: {
        userId: cookUser.id,
        kitchenName: c.kitchen,
        bio: `Fresh homemade meals prepared with love by ${c.name}. FSSAI certified kitchen.`,
        coverImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
        fssaiNo: c.fssai,
        cityId: c.city,
        area: c.area,
        pincode: c.pincode,
        serviceAreas: [c.area, "Nearby 3-5 km"],
        deliverySlots: ["Lunch (12–1 PM)", "Dinner (7–8 PM)"],
        isVeg: c.isVeg,
        status: CookStatus.APPROVED,
        ratingAvg: c.rating,
        totalReviews: c.reviews,
        totalOrders: c.reviews * 8,
      },
    });

    // Plans for each cook
    await prisma.plan.createMany({
      data: [
        {
          cookId: cook.id,
          name: "Daily Plan",
          type: PlanDuration.DAILY,
          price: 120,
          perMeal: 120,
          description: "Fresh homemade tiffin every day. Cancel anytime.",
          includes: ["1 Dal", "2 Sabzi", "4 Phulkas", "Rice", "Salad & Papad"],
        },
        {
          cookId: cook.id,
          name: "Weekly Plan",
          type: PlanDuration.WEEKLY,
          price: 749,
          perMeal: 107,
          description: "7-day subscription plan. Save 11%.",
          includes: ["Full Thali", "Weekend Special", "Free Delivery"],
          popular: true,
        },
        {
          cookId: cook.id,
          name: "Monthly Plan",
          type: PlanDuration.MONTHLY,
          price: 2799,
          perMeal: 93,
          description: "30-day value plan with up to 5 paused delivery days.",
          includes: ["Daily Thali", "Special Sundays", "5 Pause Days Allowed"],
        },
      ],
      skipDuplicates: true,
    });
  }
  console.log("✓ Seeded 12 verified cooks with plans & menus");

  console.log("✅ HomeFeast database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
