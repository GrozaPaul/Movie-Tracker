import { initializeDatabase } from "../../typeorm-config.js";
import { seeding } from "./seeding-service.js";

const runSeeding = async () => {
  try {
    await initializeDatabase();
    console.log("Database connected\n");

    // 1 page = 20 movies
    // !!! no arg = defaults to 500 in seeding !!!
    await seeding(500);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

runSeeding();
