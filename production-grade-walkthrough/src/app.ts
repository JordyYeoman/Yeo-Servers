import { config } from "./utils/config";
import { createServer } from "./utils/createServer";
import { connectToDb } from "./utils/db";
import logger from "./utils/logger";

async function startServer() {
    const server = await createServer();
    server.listen({
        port: config.PORT,
        host: config.HOST,
    })

    await connectToDb();

    logger.info('App is online and ready');
}

startServer();