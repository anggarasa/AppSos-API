"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
async function main() {
  console.log("Seeding database...");
  await prisma.notification.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.save.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  const passwordHash = await bcrypt_1.default.hash("password123", 10);
  // Create 10 users
  const users = await Promise.all(
    Array.from({ length: 10 }).map(async (_, i) => {
      const name = faker_1.faker.person.fullName();
      const username = faker_1.faker.internet.userName().toLowerCase() + i;
      const email = faker_1.faker.internet
        .email({ firstName: name.split(" ")[0] })
        .toLowerCase();
      return prisma.user.create({
        data: {
          email,
          username,
          name,
          bio: faker_1.faker.lorem.sentence(),
          avatarUrl: faker_1.faker.image.avatarGitHub(),
          passwordHash,
        },
      });
    })
  );
  // Create ~150 posts distributed across users
  const posts = await Promise.all(
    Array.from({ length: 150 }).map(async () => {
      const author = faker_1.faker.helpers.arrayElement(users);
      return prisma.post.create({
        data: {
          authorId: author.id,
          content: faker_1.faker.lorem.paragraph({ min: 1, max: 3 }),
          imageUrl: faker_1.faker.datatype.boolean()
            ? faker_1.faker.image.urlPicsumPhotos({ width: 800, height: 800 })
            : null,
        },
      });
    })
  );
  // Follows: each user follows 2-5 other users
  for (const u of users) {
    const count = faker_1.faker.number.int({ min: 2, max: 5 });
    const others = faker_1.faker.helpers
      .shuffle(users.filter((x) => x.id !== u.id))
      .slice(0, count);
    for (const o of others) {
      try {
        await prisma.follow.create({
          data: { followerId: u.id, followingId: o.id },
        });
      } catch {}
    }
  }
  // Likes: each post gets 0-10 likes from random users
  for (const p of posts) {
    const likeUsers = faker_1.faker.helpers
      .shuffle(users)
      .slice(0, faker_1.faker.number.int({ min: 0, max: 10 }));
    for (const u of likeUsers) {
      try {
        await prisma.like.create({ data: { postId: p.id, userId: u.id } });
        if (u.id !== p.authorId) {
          await prisma.notification.create({
            data: {
              userId: p.authorId,
              actorId: u.id,
              type: "like",
              message: "liked your post",
            },
          });
        }
      } catch {}
    }
  }
  // Comments: each post gets 0-5 comments
  for (const p of posts) {
    const n = faker_1.faker.number.int({ min: 0, max: 5 });
    const commentUsers = faker_1.faker.helpers.shuffle(users).slice(0, n);
    for (const u of commentUsers) {
      const c = await prisma.comment.create({
        data: {
          postId: p.id,
          authorId: u.id,
          content: faker_1.faker.lorem.sentence(),
        },
      });
      if (u.id !== p.authorId) {
        await prisma.notification.create({
          data: {
            userId: p.authorId,
            actorId: u.id,
            type: "comment",
            message: "commented on your post",
          },
        });
      }
    }
  }
  // Saves: random saves
  for (const u of users) {
    const savedPosts = faker_1.faker.helpers
      .shuffle(posts)
      .slice(0, faker_1.faker.number.int({ min: 0, max: 15 }));
    for (const p of savedPosts) {
      try {
        await prisma.save.create({ data: { postId: p.id, userId: u.id } });
      } catch {}
    }
  }
  console.log("Seed completed.");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
//# sourceMappingURL=seed.js.map
