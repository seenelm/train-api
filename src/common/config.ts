import "dotenv/config";
import fs from "fs";
import * as YAML from "yaml";
import path from "path";

const NODE_ENV = process.env.NODE_ENV || "dev";
const configPath = path.resolve(__dirname, "../../config", `${NODE_ENV}.yaml`);

let config: any;

try {
    const file = fs.readFileSync(configPath, "utf8");

    // Replace ${VAR} with process.env.VAR
    const interpolated = file.replace(/\$\{(.*?)\}/g, (_, name) => {
        const value = process.env[name];
        if (!value) {
            console.warn(`⚠️ Environment variable ${name} is not defined`);
        }
        return value || "";
    });

    config = YAML.parse(interpolated);
} catch (err) {
    console.error(
        `❌ Could not load config for environment '${NODE_ENV}' from ${configPath}`,
    );
    process.exit(1);
}

export default config;
