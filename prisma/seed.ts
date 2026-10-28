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
  const adminPwdHash = "$2b$10$6n2sI5FGHimEHwy25yaAE.SJrE6/RdiPWk1yqBW7vWE0MVq4bXskq"; // bcrypt for 'admin123'
  const demoPwdHash = "$2b$10$XbxYIRf/hOrULM9QPwEge.nsKPSZPLCFzYys5BWwVVzCOyDYj3KB.";  // bcrypt for 'demo123'

  const admin = await prisma.user.upsert({
    where: { email: "admin@homefeast.in" },
    update: { name: "Jeet Dodiya (Admin)", passwordHash: adminPwdHash },
    create: {
      name: "Jeet Dodiya (Admin)",
      email: "admin@homefeast.in",
      phone: "9999999999",
      passwordHash: adminPwdHash,
      role: Role.ADMIN,
      cityId: rajkot.id,
      isVerified: true,
    },
  });

  // 4. Seed Customers (including demo@customer.com)
  const demoCustomer = await prisma.user.upsert({
    where: { email: "demo@customer.com" },
    update: { name: "Pooja Patel", passwordHash: demoPwdHash },
    create: {
      name: "Pooja Patel",
      email: "demo@customer.com",
      phone: "9876543210",
      passwordHash: demoPwdHash,
      role: Role.CUSTOMER,
      cityId: rajkot.id,
      address: "Flat 402, Radhika Residency, Kalavad Road, Rajkot",
      pincode: "360005",
      isVerified: true,
    },
  });

  const customer1 = await prisma.user.upsert({
    where: { email: "arjun.verma@example.com" },
    update: { name: "Bhavin Vaghani" },
    create: {
      name: "Bhavin Vaghani",
      email: "arjun.verma@example.com",
      phone: "9825123456",
      passwordHash: "$2b$10$1V5UqC1l6fGfT8fO3c1F9O5W/e/yY7P6A9vG.X/T0H0W0V0V0V0V0",
      role: Role.CUSTOMER,
      cityId: rajkot.id,
      address: "B-202, Radhika Heights, Kalavad Road, Rajkot",
      pincode: "360005",
      isVerified: true,
    },
  });

  console.log("✓ Seeded demo customer & admin");

  // 5. Seed Home Cooks & Kitchens (including demo@cook.com and Jeet's Kitchen)
  const cooksData = [
    {
      name: "Jeet Dodiya",
      kitchen: "Jeet's Kitchen",
      email: "jeet@homefeast.in",
      phone: "9876500000",
      city: rajkot.id,
      area: "Kalavad Road",
      pincode: "360005",
      isVeg: true,
      cuisines: ["Gujarati", "Kathiyawadi"],
      fssai: "10020042007891",
      rating: 4.9,
      reviews: 184,
      coverImage: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&q=80",
      photos: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&q=80"],
    },
    {
      name: "Meenaben Patel",
      kitchen: "Meenaben's Kitchen",
      email: "demo@cook.com",
      phone: "9825012345",
      city: rajkot.id,
      area: "Race Course",
      pincode: "360001",
      isVeg: true,
      cuisines: ["Gujarati", "Jain"],
      fssai: "10020042003854",
      rating: 4.9,
      reviews: 142,
      coverImage: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
      photos: ["https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80"],
    },
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
      coverImage: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
      photos: ["https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&q=80"],
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
      coverImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80",
      photos: ["https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80"],
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
      coverImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
      photos: ["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80"],
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
      coverImage: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
      photos: ["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80"],
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
      coverImage: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80",
      photos: ["https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80"],
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
      coverImage: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&q=80",
      photos: ["https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&q=80"],
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
      coverImage: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&q=80",
      photos: ["https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&q=80"],
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
      coverImage: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80",
      photos: ["https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80"],
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
      coverImage: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
      photos: ["https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80"],
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
      coverImage: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80",
      photos: ["https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80"],
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
      coverImage: "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&q=80",
      photos: ["https://images.unsplash.com/photo-1543353071-873f17a7a088?w=600&q=80"],
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
      coverImage: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
      photos: ["https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80"],
    },
  ];

  for (const c of cooksData) {
    const cookUser = await prisma.user.upsert({
      where: { email: c.email },
      update: { passwordHash: demoPwdHash },
      create: {
        name: c.name,
        email: c.email,
        phone: c.phone,
        passwordHash: demoPwdHash,
        role: Role.COOK,
        cityId: c.city,
        address: `${c.area}, Pincode: ${c.pincode}`,
        pincode: c.pincode,
        isVerified: true,
      },
    });

    const cook = await prisma.cook.upsert({
      where: { userId: cookUser.id },
      update: {
        coverImage: c.coverImage,
        photos: c.photos,
      },
      create: {
        userId: cookUser.id,
        kitchenName: c.kitchen,
        bio: `Fresh homemade meals prepared with love by ${c.name}. FSSAI certified kitchen.`,
        coverImage: c.coverImage,
        photos: c.photos,
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

    // Plans for each cook (deterministic IDs to prevent duplication)
    const seedPlans = [
      {
        id: `p_${cook.id}_daily`,
        name: "Daily Plan",
        type: PlanDuration.DAILY,
        price: 120,
        perMeal: 120,
        description: "Fresh homemade tiffin every day. Cancel anytime.",
        includes: ["1 Dal", "2 Sabzi", "4 Phulkas", "Rice", "Salad & Papad"],
        popular: false,
      },
      {
        id: `p_${cook.id}_weekly`,
        name: "Weekly Plan",
        type: PlanDuration.WEEKLY,
        price: 749,
        perMeal: 107,
        description: "7-day subscription plan. Save 11%.",
        includes: ["Full Thali", "Weekend Special", "Free Delivery"],
        popular: true,
      },
      {
        id: `p_${cook.id}_monthly`,
        name: "Monthly Plan",
        type: PlanDuration.MONTHLY,
        price: 2799,
        perMeal: 93,
        description: "30-day value plan with up to 5 paused delivery days.",
        includes: ["Daily Thali", "Special Sundays", "5 Pause Days Allowed"],
        popular: false,
      },
    ];

    for (const p of seedPlans) {
      await prisma.plan.upsert({
        where: { id: p.id },
        update: {
          name: p.name,
          price: p.price,
          perMeal: p.perMeal,
          description: p.description,
          includes: p.includes,
          popular: p.popular,
        },
        create: {
          id: p.id,
          cookId: cook.id,
          name: p.name,
          type: p.type,
          price: p.price,
          perMeal: p.perMeal,
          description: p.description,
          includes: p.includes,
          popular: p.popular,
        },
      });
    }
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
