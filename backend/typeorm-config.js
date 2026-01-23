import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { User } from "./features/user/user-entity.js";
import { Person } from "./features/person/person-entity.js";
import { MovieDirector } from "./features/person/movie-director-entity.js";
import { MovieActor } from "./features/person/movie-actor-entity.js";
import { StudioMovies } from "./features/movie/studio-movies-entity.js";
import { MovieGenre } from "./features/movie/movie-genre-entity.js";
import { Movie } from "./features/movie/movie-entity.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  entities: [
    User,
    Movie,
    Person,
    MovieActor,
    MovieDirector,
    StudioMovies,
    MovieGenre,
  ],
  migrations: ["migrations/**/*.js"],
  migrationsTableName: "migrations",
  subscribers: [],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
};
