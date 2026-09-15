// Grants a user the "admin" role by username, so they can access
// permission-gated routes like /users and /roles.
//
// There's no in-app way to become the first admin — someone has to be
// promoted this way at least once. Run: npm run promote:admin -- <username>

import "dotenv/config";
import mongoose from "mongoose";
import { Role } from "../src/models/roles";
import { User } from "../src/models/users";

async function promoteToAdmin(): Promise<void> {
  const username = process.argv[2];

  if (!username) {
    console.error("Usage: npm run promote:admin -- <username>");
    process.exit(1);
  }

  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error("MONGO_URI is not defined in the environment variables");
    process.exit(1);
  }

  await mongoose.connect(mongoURI);

  const adminRole = await Role.findOne({ name: "admin" });

  if (!adminRole) {
    console.error('No "admin" role found. Run "npm run seed:roles" first.');
    process.exit(1);
  }

  const user = await User.findOneAndUpdate(
    { username },
    { $addToSet: { role: adminRole.id } },
    { new: true },
  );

  if (!user) {
    console.error(`No user found with username "${username}"`);
    process.exit(1);
  }

  console.log(`"${username}" is now an admin.`);

  await mongoose.disconnect();
}

promoteToAdmin().catch((err) => {
  console.error("Failed to promote user:", err);
  process.exit(1);
});
