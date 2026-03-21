import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Lakshmi...');

  // 1. Ensure Vishnu exists
  let vishnu = await prisma.person.findFirst({ where: { name: 'Vishnu', type: 'GOD' } });
  if (!vishnu) {
    vishnu = await prisma.person.create({
      data: { name: 'Vishnu', type: 'GOD', gender: 'MALE', description: 'The Supreme Deity, Preserver of the Trimurti.' }
    });
    console.log('Created Vishnu');
  }

  // 2. Lakshmi
  let lakshmi = await prisma.person.findFirst({ where: { name: 'Lakshmi', type: 'GOD' } });
  if (!lakshmi) {
    lakshmi = await prisma.person.create({
      data: { name: 'Lakshmi', type: 'GOD', gender: 'FEMALE', description: 'Goddess of Wealth, Prosperity, Fortune, and Beauty. Emerged from the Kshira Sagara (Churning of the Ocean of Milk).' }
    });
    console.log('Created Lakshmi');
  }

  // 3. Consort: Vishnu ↔ Lakshmi
  const consortExists = await prisma.relationship.findUnique({
    where: { subjectId_objectId_type: { subjectId: vishnu.id, objectId: lakshmi.id, type: 'SPOUSE_OF' } }
  });
  if (!consortExists) {
    await prisma.relationship.create({
      data: { subjectId: vishnu.id, objectId: lakshmi.id, type: 'SPOUSE_OF', label: 'Consort', isBiological: true }
    });
    console.log('Created Vishnu ↔ Lakshmi (Consort)');
  }

  // 4. Kshira Sagara (Cosmic Origin)
  let ocean = await prisma.person.findFirst({ where: { name: 'Kshira Sagara' } });
  if (!ocean) {
    ocean = await prisma.person.create({
      data: { name: 'Kshira Sagara', type: 'GOD', gender: 'MALE', description: 'The Ocean of Milk — cosmic source from which Lakshmi emerged during Samudra Manthan.' }
    });
    console.log('Created Kshira Sagara');
  }

  // 5. Emergence: Kshira Sagara → Lakshmi (symbolic, not biological)
  const emergenceExists = await prisma.relationship.findUnique({
    where: { subjectId_objectId_type: { subjectId: ocean.id, objectId: lakshmi.id, type: 'PARENT_OF' } }
  });
  if (!emergenceExists) {
    await prisma.relationship.create({
      data: { subjectId: ocean.id, objectId: lakshmi.id, type: 'PARENT_OF', label: 'Samudra Manthan', isBiological: false }
    });
    console.log('Created Kshira Sagara → Lakshmi (Emergence)');
  }

  // 6. Avatar manifestations: Lakshmi → Sita, Lakshmi → Rukmini
  const sita = await prisma.person.findFirst({ where: { name: 'Sita', type: 'GOD' } });
  if (sita) {
    const sitaRel = await prisma.relationship.findUnique({
      where: { subjectId_objectId_type: { subjectId: lakshmi.id, objectId: sita.id, type: 'PAST_LIFE_OF' } }
    });
    if (!sitaRel) {
      await prisma.relationship.create({
        data: { subjectId: lakshmi.id, objectId: sita.id, type: 'PAST_LIFE_OF', label: 'Avatar', isBiological: false }
      });
      console.log('Created Lakshmi → Sita (Avatar)');
    }
  }

  let rukmini = await prisma.person.findFirst({ where: { name: 'Rukmini' } });
  if (!rukmini) {
    rukmini = await prisma.person.create({
      data: { name: 'Rukmini', type: 'GOD', gender: 'FEMALE', description: 'Princess of Vidarbha, chief queen of Krishna. Avatar of Goddess Lakshmi.' }
    });
    console.log('Created Rukmini');
  }
  const rukminiRel = await prisma.relationship.findUnique({
    where: { subjectId_objectId_type: { subjectId: lakshmi.id, objectId: rukmini.id, type: 'PAST_LIFE_OF' } }
  });
  if (!rukminiRel) {
    await prisma.relationship.create({
      data: { subjectId: lakshmi.id, objectId: rukmini.id, type: 'PAST_LIFE_OF', label: 'Avatar', isBiological: false }
    });
    console.log('Created Lakshmi → Rukmini (Avatar)');
  }

  console.log('\nLakshmi seed complete!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
