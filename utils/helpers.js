import { randomBytes } from "crypto";

export const cryptoToken = () => randomBytes(32).toString("hex");
