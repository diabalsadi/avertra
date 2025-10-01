import { PrismaClient } from "../generated/prisma";

let client: PrismaClient | null = null;

// Ensure a single instance of PrismaClient is used throughout the application
const getPrismaClient = () => {
    if (!client) {
        client = new PrismaClient();
    }
    return client;
};

export default getPrismaClient();
