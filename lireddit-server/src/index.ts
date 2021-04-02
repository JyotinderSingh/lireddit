import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cors from "cors";

import { COOKIE_NAME, __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/Post";
import { UserResolver } from "./resolvers/User";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import dotenv from "dotenv";
import { MyContext } from "./types";

const main = async () => {
  dotenv.config();

  const SESSION_SECRET = process.env.SESSION_SECRET;

  const orm = await MikroORM.init(microConfig);

  // This runs the migrations before doing anything else, so that we don't need to do that manually on the terminal
  orm.getMigrator().up();
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  const app = express();

  // we apply this cors policy to all routes, hence we dont pass any specific route here
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in HTTPS if true - we set it true only when we're running in prod (make sure prod env has HTTPS enabled)
      },
      saveUninitialized: false,
      secret: SESSION_SECRET || "",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    // remove the interface in case it gives trouble lol
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("Server started on localhost:4000");
  });
};

main().catch((err) => console.error(err));
