import pino from "pino";

const isServerless = process.env.VERCEL === "1";

const logger = pino(
  isServerless
    ? { level: "info" }
    : {
        level: "info",
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }
);

export default logger;
