import { PrismaClient } from '@prisma/client';
import { scrypt } from 'crypto';
import { promisify } from 'util';

const prisma = new PrismaClient();
const scryptAsync = promisify(scrypt);

async function checkLogin() {
    try {
        const email = "alex@example.com";
        const password = "password123";

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            console.log("User not found");
            return;
        }

        console.log("Found User:", user.email);
        console.log("DB Hash Part:", user.password.split(".")[0]);
        console.log("DB Salt Part:", user.password.split(".")[1]);

        const [hashed, salt] = user.password.split(".");
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;
        const generatedHash = buf.toString("hex");

        console.log("Generated Hash:", generatedHash);
        console.log("Match:", generatedHash === hashed);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkLogin();
