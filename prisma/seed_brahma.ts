import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Universal Lineage structure for Brahma...');

  // 1. Ensure Vishnu exists or create Him
  let vishnu = await prisma.person.findFirst({ where: { name: 'Vishnu', type: 'GOD' } });
  if (!vishnu) {
    vishnu = await prisma.person.create({
      data: {
        name: 'Vishnu',
        type: 'GOD',
        gender: 'MALE',
        description: 'The Preserver and protector of the universe.',
      }
    });
  }

  // 2. Ensure Brahma exists or create Him
  let brahma = await prisma.person.findFirst({ where: { name: 'Brahma', type: 'GOD' } });
  if (!brahma) {
    brahma = await prisma.person.create({
      data: {
        name: 'Brahma',
        type: 'GOD',
        gender: 'MALE',
        description: 'The Creator Deity, emerging from a Lotus rooted in Vishnu.',
      }
    });
  }

  // Define Origin / Symbolic Relationship (Vishnu -> Lotus -> Brahma)
  const emergenceExists = await prisma.relationship.findUnique({
    where: {
      subjectId_objectId_type: {
        subjectId: vishnu.id,
        objectId: brahma.id,
        type: 'PARENT_OF'
      }
    }
  });

  if (!emergenceExists) {
    await prisma.relationship.create({
      data: {
        subjectId: vishnu.id,   // Parent
        objectId: brahma.id,    // Child
        type: 'PARENT_OF',
        label: 'Lotus Origin',  // Displayed on the connector edge
        isBiological: false,    // Renders dashed!
      }
    });
    console.log('Created Lotus Origin relationship between Vishnu and Brahma.');
  }

  // 3. Ensure Consort (Saraswati)
  let saraswati = await prisma.person.findFirst({ where: { name: 'Saraswati', type: 'GOD' } });
  if (!saraswati) {
    saraswati = await prisma.person.create({
      data: {
        name: 'Saraswati',
        type: 'GOD',
        gender: 'FEMALE',
        description: 'Goddess of Knowledge, Music, Art, Speech, Wisdom, and Learning.',
      }
    });
  }

  const consortExists = await prisma.relationship.findUnique({
    where: {
      subjectId_objectId_type: {
        subjectId: brahma.id,
        objectId: saraswati.id,
        type: 'SPOUSE_OF'
      }
    }
  });

  if (!consortExists) {
    await prisma.relationship.create({
      data: {
        subjectId: brahma.id,
        objectId: saraswati.id,
        type: 'SPOUSE_OF',
        label: 'Consort'
      }
    });
    console.log('Created Consort relationship between Brahma and Saraswati.');
  }

  // 4. Create Mind-Born Sons (Manasaputras)
  const sons = [
    { name: 'Marichi', role: 'Sage / Prajapati' },
    { name: 'Atri', role: 'Seer' },
    { name: 'Angiras', role: 'Sage' },
    { name: 'Pulastya', role: 'Sage' },
    { name: 'Pulaha', role: 'Sage' },
    { name: 'Kratu', role: 'Sage' },
    { name: 'Vashistha', role: 'Sage' },
    { name: 'Bhrigu', role: 'Sage' },
    { name: 'Narada', role: 'Divine Sage / Messenger' }
  ];

  for (const son of sons) {
    let sonEntity = await prisma.person.findFirst({ where: { name: son.name, type: 'SAINT' } });
    if (!sonEntity) {
      sonEntity = await prisma.person.create({
        data: {
          name: son.name,
          type: 'SAINT',
          gender: 'MALE',
          description: `One of the Manasaputras (mind-born sons) of Brahma. Known as a ${son.role}.`,
        }
      });
    }

    const sonRelExists = await prisma.relationship.findUnique({
      where: {
        subjectId_objectId_type: {
          subjectId: brahma.id,
          objectId: sonEntity.id,
          type: 'PARENT_OF'
        }
      }
    });

    if (!sonRelExists) {
      await prisma.relationship.create({
        data: {
          subjectId: brahma.id,
          objectId: sonEntity.id,
          type: 'PARENT_OF',
          label: 'Mind-born Son',
          isBiological: false, // Symbolic/Spiritual creation
        }
      });
      console.log(`Created Mind-Born son relationship for ${son.name}`);
    }
  }

  console.log('Brahma Lineage Seed Complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
