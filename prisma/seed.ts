import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Database...");

  // 1. Create Deities
  const vishnu = await prisma.person.create({
    data: {
      name: "Lord Vishnu",
      type: "GOD",
      gender: "MALE",
      description: "The Preserver of the Universe in the Hindu Trinity.",
    }
  });

  const lakshmi = await prisma.person.create({
    data: {
      name: "Goddess Lakshmi",
      type: "GOD",
      gender: "FEMALE",
      description: "The Goddess of Wealth, Fortune, and Prosperity.",
    }
  });

  // 2. Create Avatars (Past Lives) and Mortal Kings
  const rama = await prisma.person.create({
    data: {
      name: "Lord Sri Rama",
      type: "KING",
      gender: "MALE",
      caste: "Kshatriya",
      description: "The seventh avatar of the Hindu god Vishnu, and a king of Ayodhya.",
    }
  });

  const sita = await prisma.person.create({
    data: {
      name: "Goddess Sita",
      type: "GOD",
      gender: "FEMALE",
      description: "The consort of Lord Rama, considered an avatar of Goddess Lakshmi.",
    }
  });

  // Children
  const luv = await prisma.person.create({
    data: { name: "Luv", type: "KING", gender: "MALE", caste: "Kshatriya", description: "Son of Lord Rama and Goddess Sita" }
  });
  
  const kush = await prisma.person.create({
    data: { name: "Kush", type: "KING", gender: "MALE", caste: "Kshatriya", description: "Son of Lord Rama and Goddess Sita" }
  });

  // Guru
  const vashistha = await prisma.person.create({
    data: { name: "Guru Vashistha", type: "SAINT", gender: "MALE", caste: "Brahmin", description: "One of the Saptarishis and the Rajaguru of the Suryavansha dynasty." }
  });

  // 3. Establish Relationships
  await prisma.relationship.createMany({
    data: [
      // Divine Marriages
      { subjectId: vishnu.id, objectId: lakshmi.id, type: "SPOUSE_OF" },
      { subjectId: rama.id, objectId: sita.id, type: "SPOUSE_OF" },
      
      // Reincarnations / Avatars
      { subjectId: vishnu.id, objectId: rama.id, type: "PAST_LIFE_OF" },
      { subjectId: lakshmi.id, objectId: sita.id, type: "PAST_LIFE_OF" },
      
      // Parents -> Children
      { subjectId: rama.id, objectId: luv.id, type: "PARENT_OF" },
      { subjectId: sita.id, objectId: luv.id, type: "PARENT_OF" },
      { subjectId: rama.id, objectId: kush.id, type: "PARENT_OF" },
      { subjectId: sita.id, objectId: kush.id, type: "PARENT_OF" },

      // Guru -> Disciple
      { subjectId: vashistha.id, objectId: rama.id, type: "GURU_OF" }
    ]
  });

  console.log("Seeding Completed Successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
