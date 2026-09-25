import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!email || !password) {
    console.log(
      "ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin bootstrap. " +
        "Set them in .env to auto-create the first account."
    );
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (existing) {
    console.log(`Admin user ${email} already exists — nothing to do.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email: email.toLowerCase().trim(), name, passwordHash },
  });
  console.log(`Created admin user ${email}. Sign in and use "Add teammate" to add the rest of the team.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
