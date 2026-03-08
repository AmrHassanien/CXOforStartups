import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
    console.error("Usage: node gen_hash.js <password>");
    process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log("\n--- Generated Hash ---");
console.log(hash);
console.log("----------------------\n");
