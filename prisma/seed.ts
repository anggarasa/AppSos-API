import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.save.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Cleared existing data");

  // Create users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = await prisma.user.createMany({
    data: [
      {
        email: "john.doe@example.com",
        username: "johndoe",
        name: "John Doe",
        bio: "Software developer passionate about technology and innovation. Love sharing knowledge and connecting with like-minded people!",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        password: hashedPassword,
      },
      {
        email: "jane.smith@example.com",
        username: "janesmith",
        name: "Jane Smith",
        bio: "UI/UX Designer | Coffee enthusiast ☕ | Always learning new things and sharing design inspiration",
        avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        password: hashedPassword,
      },
      {
        email: "mike.wilson@example.com",
        username: "mikewilson",
        name: "Mike Wilson",
        bio: "Full-stack developer | Tech blogger | Open source contributor | Building the future one commit at a time",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        password: hashedPassword,
      },
      {
        email: "sarah.johnson@example.com",
        username: "sarahjohnson",
        name: "Sarah Johnson",
        bio: "Digital marketer | Content creator | Travel lover 🌍 | Sharing insights about marketing and life",
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        password: hashedPassword,
      },
      {
        email: "alex.brown@example.com",
        username: "alexbrown",
        name: "Alex Brown",
        bio: "Data scientist | Machine learning enthusiast | Python lover 🐍 | Exploring the world through data",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        password: hashedPassword,
      },
      {
        email: "emma.davis@example.com",
        username: "emmadavis",
        name: "Emma Davis",
        bio: "Product manager | Startup enthusiast | Yoga instructor 🧘‍♀️ | Balancing work, life, and mindfulness",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        password: hashedPassword,
      },
      {
        email: "david.lee@example.com",
        username: "davidlee",
        name: "David Lee",
        bio: "DevOps engineer | Cloud architect | Kubernetes expert ☸️ | Automating everything possible",
        avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
        password: hashedPassword,
      },
      {
        email: "lisa.garcia@example.com",
        username: "lisagarcia",
        name: "Lisa Garcia",
        bio: "Frontend developer | React specialist | Accessibility advocate ♿ | Making the web more inclusive",
        avatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
        password: hashedPassword,
      },
    ],
  });

  console.log(`👥 Created ${users.count} users`);

  // Get created users for relationships
  const createdUsers = await prisma.user.findMany();
  const userIds = createdUsers.map(user => user.id);

  // Create posts
  const posts = await prisma.post.createMany({
    data: [
      {
        authorId: createdUsers[0].id, // John Doe
        content: "Just finished building a new feature for our app! The feeling of solving a complex problem after hours of debugging is unmatched. What's your favorite part of the development process? #coding #webdev #programming",
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
      },
      {
        authorId: createdUsers[1].id, // Jane Smith
        content: "Design tip of the day: Always consider accessibility in your designs. Small changes can make a huge difference for users with disabilities. Here's a quick guide I put together! 🎨",
        imageUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop",
      },
      {
        authorId: createdUsers[2].id, // Mike Wilson
        content: "Working on a new open source project! It's amazing how the community comes together to build something meaningful. Open source has taught me so much about collaboration and code quality. What's your favorite open source project?",
      },
      {
        authorId: createdUsers[3].id, // Sarah Johnson
        content: "Marketing in 2024: It's not just about selling products, it's about creating genuine connections with your audience. Authenticity beats perfection every time. What marketing trends are you most excited about? #marketing #digitalmarketing",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      },
      {
        authorId: createdUsers[4].id, // Alex Brown
        content: "Just completed a machine learning model that predicts customer behavior with 94% accuracy! The data preprocessing was the most challenging part. Sometimes the hardest problems have the simplest solutions. #machinelearning #datascience #python",
      },
      {
        authorId: createdUsers[5].id, // Emma Davis
        content: "Product management lesson learned: User feedback is gold, but not all feedback is created equal. Learning to distinguish between nice-to-have and must-have features is crucial for product success. What's your approach to prioritizing features?",
      },
      {
        authorId: createdUsers[6].id, // David Lee
        content: "Infrastructure as Code is a game changer! Just migrated our entire infrastructure to Terraform and the results are incredible. Deployments are faster, more reliable, and reproducible. #devops #terraform #cloud",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
      },
      {
        authorId: createdUsers[7].id, // Lisa Garcia
        content: "Accessibility isn't just about compliance, it's about creating inclusive experiences for everyone. Spent the day implementing ARIA labels and keyboard navigation - small changes, big impact! #accessibility #webdev #inclusion",
      },
      {
        authorId: createdUsers[0].id, // John Doe
        content: "Coffee and code - the perfect combination! ☕ What's your go-to development setup? I'm always curious about other developers' workflows and tools.",
      },
      {
        authorId: createdUsers[1].id, // Jane Smith
        content: "Color theory in UI design: Understanding how colors affect user emotions and behavior is crucial. This palette I created focuses on trust and professionalism. What colors do you associate with different emotions?",
        imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=600&fit=crop",
      },
    ],
  });

  console.log(`📝 Created ${posts.count} posts`);

  // Get created posts for relationships
  const createdPosts = await prisma.post.findMany();

  // Create comments
  const comments = await prisma.comment.createMany({
    data: [
      {
        postId: createdPosts[0].id,
        authorId: createdUsers[1].id, // Jane commenting on John's post
        content: "Great work John! I love the problem-solving aspect too. The debugging process, while frustrating, often leads to the best learning experiences.",
      },
      {
        postId: createdPosts[0].id,
        authorId: createdUsers[2].id, // Mike commenting on John's post
        content: "Absolutely agree! There's something satisfying about finally getting that complex feature working. What technology stack did you use?",
      },
      {
        postId: createdPosts[1].id,
        authorId: createdUsers[0].id, // John commenting on Jane's post
        content: "This is so important! Accessibility should be considered from the very beginning of the design process, not as an afterthought.",
      },
      {
        postId: createdPosts[1].id,
        authorId: createdUsers[7].id, // Lisa commenting on Jane's post
        content: "Thank you for sharing this! As a frontend developer, I really appreciate when designers think about accessibility. It makes implementation so much smoother.",
      },
      {
        postId: createdPosts[2].id,
        authorId: createdUsers[3].id, // Sarah commenting on Mike's post
        content: "Open source is amazing! I love how it brings people together from all over the world. What kind of project are you working on?",
      },
      {
        postId: createdPosts[3].id,
        authorId: createdUsers[4].id, // Alex commenting on Sarah's post
        content: "Great insights on marketing! I think data-driven marketing is becoming increasingly important. How do you measure the success of your campaigns?",
      },
      {
        postId: createdPosts[4].id,
        authorId: createdUsers[5].id, // Emma commenting on Alex's post
        content: "94% accuracy is impressive! Data preprocessing is indeed crucial. What kind of data were you working with?",
      },
      {
        postId: createdPosts[5].id,
        authorId: createdUsers[6].id, // David commenting on Emma's post
        content: "Product management is such a balancing act! I find that user interviews are incredibly valuable for understanding what users really need vs what they think they want.",
      },
      {
        postId: createdPosts[6].id,
        authorId: createdUsers[0].id, // John commenting on David's post
        content: "Terraform is a game changer indeed! Infrastructure as Code has made our deployments so much more reliable. What cloud provider are you using?",
      },
      {
        postId: createdPosts[7].id,
        authorId: createdUsers[1].id, // Jane commenting on Lisa's post
        content: "Accessibility is so important! I always try to include accessibility considerations in my design process. Do you have any favorite resources for learning more about it?",
      },
    ],
  });

  console.log(`💬 Created ${comments.count} comments`);

  // Get created comments for relationships
  const createdComments = await prisma.comment.findMany();

  // Create likes (users liking various posts)
  const likes = await prisma.like.createMany({
    data: [
      // John's posts getting likes
      { postId: createdPosts[0].id, userId: createdUsers[1].id },
      { postId: createdPosts[0].id, userId: createdUsers[2].id },
      { postId: createdPosts[0].id, userId: createdUsers[3].id },
      { postId: createdPosts[8].id, userId: createdUsers[1].id },
      { postId: createdPosts[8].id, userId: createdUsers[4].id },
      
      // Jane's posts getting likes
      { postId: createdPosts[1].id, userId: createdUsers[0].id },
      { postId: createdPosts[1].id, userId: createdUsers[7].id },
      { postId: createdPosts[9].id, userId: createdUsers[0].id },
      { postId: createdPosts[9].id, userId: createdUsers[2].id },
      { postId: createdPosts[9].id, userId: createdUsers[3].id },
      
      // Mike's posts getting likes
      { postId: createdPosts[2].id, userId: createdUsers[3].id },
      { postId: createdPosts[2].id, userId: createdUsers[4].id },
      { postId: createdPosts[2].id, userId: createdUsers[5].id },
      
      // Sarah's posts getting likes
      { postId: createdPosts[3].id, userId: createdUsers[4].id },
      { postId: createdPosts[3].id, userId: createdUsers[5].id },
      { postId: createdPosts[3].id, userId: createdUsers[6].id },
      
      // Alex's posts getting likes
      { postId: createdPosts[4].id, userId: createdUsers[5].id },
      { postId: createdPosts[4].id, userId: createdUsers[6].id },
      { postId: createdPosts[4].id, userId: createdUsers[7].id },
      
      // Emma's posts getting likes
      { postId: createdPosts[5].id, userId: createdUsers[6].id },
      { postId: createdPosts[5].id, userId: createdUsers[7].id },
      { postId: createdPosts[5].id, userId: createdUsers[0].id },
      
      // David's posts getting likes
      { postId: createdPosts[6].id, userId: createdUsers[0].id },
      { postId: createdPosts[6].id, userId: createdUsers[1].id },
      { postId: createdPosts[6].id, userId: createdUsers[2].id },
      
      // Lisa's posts getting likes
      { postId: createdPosts[7].id, userId: createdUsers[1].id },
      { postId: createdPosts[7].id, userId: createdUsers[2].id },
      { postId: createdPosts[7].id, userId: createdUsers[3].id },
    ],
  });

  console.log(`❤️  Created ${likes.count} likes`);

  // Create saves (users saving posts)
  const saves = await prisma.save.createMany({
    data: [
      // Users saving various posts
      { postId: createdPosts[1].id, userId: createdUsers[0].id }, // John saving Jane's design post
      { postId: createdPosts[1].id, userId: createdUsers[7].id }, // Lisa saving Jane's design post
      { postId: createdPosts[2].id, userId: createdUsers[3].id }, // Sarah saving Mike's open source post
      { postId: createdPosts[3].id, userId: createdUsers[4].id }, // Alex saving Sarah's marketing post
      { postId: createdPosts[4].id, userId: createdUsers[5].id }, // Emma saving Alex's ML post
      { postId: createdPosts[5].id, userId: createdUsers[6].id }, // David saving Emma's PM post
      { postId: createdPosts[6].id, userId: createdUsers[0].id }, // John saving David's DevOps post
      { postId: createdPosts[7].id, userId: createdUsers[1].id }, // Jane saving Lisa's accessibility post
      { postId: createdPosts[9].id, userId: createdUsers[2].id }, // Mike saving Jane's color theory post
    ],
  });

  console.log(`💾 Created ${saves.count} saves`);

  // Create follow relationships
  const follows = await prisma.follow.createMany({
    data: [
      // John follows others
      { followerId: createdUsers[0].id, followingId: createdUsers[1].id },
      { followerId: createdUsers[0].id, followingId: createdUsers[2].id },
      { followerId: createdUsers[0].id, followingId: createdUsers[6].id },
      
      // Jane follows others
      { followerId: createdUsers[1].id, followingId: createdUsers[0].id },
      { followerId: createdUsers[1].id, followingId: createdUsers[7].id },
      { followerId: createdUsers[1].id, followingId: createdUsers[3].id },
      
      // Mike follows others
      { followerId: createdUsers[2].id, followingId: createdUsers[0].id },
      { followerId: createdUsers[2].id, followingId: createdUsers[4].id },
      { followerId: createdUsers[2].id, followingId: createdUsers[5].id },
      
      // Sarah follows others
      { followerId: createdUsers[3].id, followingId: createdUsers[1].id },
      { followerId: createdUsers[3].id, followingId: createdUsers[4].id },
      { followerId: createdUsers[3].id, followingId: createdUsers[5].id },
      
      // Alex follows others
      { followerId: createdUsers[4].id, followingId: createdUsers[2].id },
      { followerId: createdUsers[4].id, followingId: createdUsers[5].id },
      { followerId: createdUsers[4].id, followingId: createdUsers[6].id },
      
      // Emma follows others
      { followerId: createdUsers[5].id, followingId: createdUsers[3].id },
      { followerId: createdUsers[5].id, followingId: createdUsers[4].id },
      { followerId: createdUsers[5].id, followingId: createdUsers[6].id },
      
      // David follows others
      { followerId: createdUsers[6].id, followingId: createdUsers[0].id },
      { followerId: createdUsers[6].id, followingId: createdUsers[2].id },
      { followerId: createdUsers[6].id, followingId: createdUsers[4].id },
      
      // Lisa follows others
      { followerId: createdUsers[7].id, followingId: createdUsers[1].id },
      { followerId: createdUsers[7].id, followingId: createdUsers[0].id },
      { followerId: createdUsers[7].id, followingId: createdUsers[2].id },
    ],
  });

  console.log(`👥 Created ${follows.count} follow relationships`);

  // Create notifications
  const notifications = await prisma.notification.createMany({
    data: [
      // Like notifications
      {
        type: "LIKE",
        message: "janesmith liked your post about building a new feature",
        receiverId: createdUsers[0].id, // John receives notification
        senderId: createdUsers[1].id, // Jane liked it
        postId: createdPosts[0].id,
      },
      {
        type: "LIKE",
        message: "mikewilson liked your post about building a new feature",
        receiverId: createdUsers[0].id, // John receives notification
        senderId: createdUsers[2].id, // Mike liked it
        postId: createdPosts[0].id,
      },
      {
        type: "LIKE",
        message: "johndoe liked your design tip post",
        receiverId: createdUsers[1].id, // Jane receives notification
        senderId: createdUsers[0].id, // John liked it
        postId: createdPosts[1].id,
      },
      
      // Comment notifications
      {
        type: "COMMENT",
        message: "janesmith commented on your post about building a new feature",
        receiverId: createdUsers[0].id, // John receives notification
        senderId: createdUsers[1].id, // Jane commented
        postId: createdPosts[0].id,
        commentId: createdComments[0].id,
      },
      {
        type: "COMMENT",
        message: "johndoe commented on your design tip post",
        receiverId: createdUsers[1].id, // Jane receives notification
        senderId: createdUsers[0].id, // John commented
        postId: createdPosts[1].id,
        commentId: createdComments[2].id,
      },
      
      // Follow notifications
      {
        type: "FOLLOW",
        message: "janesmith started following you",
        receiverId: createdUsers[0].id, // John receives notification
        senderId: createdUsers[1].id, // Jane followed him
      },
      {
        type: "FOLLOW",
        message: "johndoe started following you",
        receiverId: createdUsers[1].id, // Jane receives notification
        senderId: createdUsers[0].id, // John followed her
      },
      {
        type: "FOLLOW",
        message: "mikewilson started following you",
        receiverId: createdUsers[0].id, // John receives notification
        senderId: createdUsers[2].id, // Mike followed him
      },
    ],
  });

  console.log(`🔔 Created ${notifications.count} notifications`);

  console.log("✅ Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`- Users: ${createdUsers.length}`);
  console.log(`- Posts: ${createdPosts.length}`);
  console.log(`- Comments: ${createdComments.length}`);
  console.log(`- Likes: ${likes.count}`);
  console.log(`- Saves: ${saves.count}`);
  console.log(`- Follows: ${follows.count}`);
  console.log(`- Notifications: ${notifications.count}`);
  
  console.log("\n🔑 Test credentials:");
  console.log("All users have the password: password123");
  console.log("You can login with any of the created email addresses");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
