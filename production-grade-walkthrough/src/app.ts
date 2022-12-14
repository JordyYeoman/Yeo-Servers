import { config } from "./utils/config";
import { createServer } from "./utils/createServer";
import { connectToDb } from "./utils/db";
import logger from "./utils/logger";

const signals = ["SIGINT", "SIGHUP", "SIGTERM"] as const;

async function gracefulShutdown({
  signal,
  server,
}: {
  signal: typeof signals[number];
  server: Awaited<ReturnType<typeof createServer>>;
}) {
  logger.info(`Got signal ${signal}, Good Bye!`);
  await server.close();
}

async function startServer() {
  const server = await createServer();
  server.listen({
    port: config.PORT,
    host: config.HOST,
  });

  await connectToDb();

  logger.info("App is online and ready");
  logger.info(`http://${config.HOST}:${config.PORT}`);

  for (let i = 0; i < signals.length; i++) {
    process.on(signals[i], () =>
      gracefulShutdown({ signal: signals[i], server })
    );
  }
}

startServer();
