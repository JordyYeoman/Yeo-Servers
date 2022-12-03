import envSchema from "env-schema";
import { Static, Type } from "@sinclair/typebox";
// Add typing to env variables - app will not start without variables being present

const schema = Type.Object({
  PORT: Type.Number({
    default: 4000,
  }),
  HOST: Type.String({
    default: "0.0.0.0",
  }),
  DATABASE_URL: Type.String(),
});

type env = Static<typeof schema>;

export const configSchema = envSchema<env>({ schema, dotenv: true });
