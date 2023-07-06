import { randomBytes } from "crypto";

export const cryptoToken = () => randomBytes(64).toString("hex");
