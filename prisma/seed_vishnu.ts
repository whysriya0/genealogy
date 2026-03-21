import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Vishnu Dashavatara...');

  // 1. Ensure Vishnu exists
  let vishnu = await prisma.person.findFirst({ where: { name: 'Vishnu', type: 'GOD' } });
  if (!vishnu) {
    vishnu = await prisma.person.create({
      data: { name: 'Vishnu', type: 'GOD', gender: 'MALE', description: 'The Supreme Deity, Preserver of the Trimurti.' }
    });
    console.log('Created Vishnu');
  }

  // 2. Dashavatara — ordered chronologically
  const avatars = [
    { name: 'Matsya',       desc: '1st Avatar — The Fish. Saved the Vedas during the great deluge (Satya Yuga).' },
    { name: 'Kurma',        desc: '2nd Avatar — The Tortoise. Supported Mount Mandara during the churning of the ocean (Satya Yuga).' },
    { name: 'Varaha',       desc: '3rd Avatar — The Boar. Rescued Earth (Bhudevi) from the demon Hiranyaksha (Satya Yuga).' },
    { name: 'Narasimha',    desc: '4th Avatar — Half-man, Half-lion. Destroyed the demon Hiranyakashipu to protect Prahlada (Satya Yuga).' },
    { name: 'Vamana',       desc: '5th Avatar — The Dwarf. Subdued King Bali with three cosmic strides (Treta Yuga).' },
    { name: 'Parashurama',  desc: '6th Avatar — The Warrior with the Axe. Annihilated corrupt Kshatriyas twenty-one times (Treta Yuga).' },
    { name: 'Rama',         desc: '7th Avatar — Prince of Ayodhya. Embodiment of Dharma, hero of the Ramayana (Treta Yuga).' },
    { name: 'Krishna',      desc: '8th Avatar — The Divine Statesman. Speaker of the Bhagavad Gita, hero of the Mahabharata (Dvapara Yuga).' },
    { name: 'Buddha',       desc: '9th Avatar — The Enlightened One. Preached compassion and non-violence (Kali Yuga, in many traditions).' },
    { name: 'Kalki',        desc: '10th Avatar — The Future Warrior. Prophesied to end Kali Yuga and restore Dharma.' },
  ];

  for (const av of avatars) {
    let avatarEntity = await prisma.person.findFirst({ where: { name: av.name, type: 'GOD' } });
    if (!avatarEntity) {
      avatarEntity = await prisma.person.create({
        data: { name: av.name, type: 'GOD', gender: 'MALE', description: av.desc }
      });
      console.log(`Created ${av.name}`);
    }

    // Vishnu → Avatar (PAST_LIFE_OF with label "Avatar")
    const relExists = await prisma.relationship.findUnique({
      where: { subjectId_objectId_type: { subjectId: vishnu.id, objectId: avatarEntity.id, type: 'PAST_LIFE_OF' } }
    });
    if (!relExists) {
      await prisma.relationship.create({
        data: {
          subjectId: vishnu.id,
          objectId: avatarEntity.id,
          type: 'PAST_LIFE_OF',
          label: 'Avatar',
          isBiological: false,
        }
      });
      console.log(`Created Vishnu → ${av.name} (Avatar)`);
    }
  }

  console.log('Vishnu Dashavatara seed complete!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
