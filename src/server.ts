import { ApolloServer } from "@apollo/server"
import { makeSchema } from 'nexus/dist/makeSchema.js'
import { createServer } from "http"
import { WebSocketServer } from 'ws'
import { useServer } from "graphql-ws/lib/use/ws"
import { expressjwt } from 'express-jwt'
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import { join } from 'path'
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs'
import authorization from 'nexus';
const { fieldAuthorizePlugin, declarativeWrappingPlugin } = authorization;
import { PrismaClient } from '@prisma/client'
import { PubSub } from "graphql-subscriptions/dist/pubsub.js"
import { expressMiddleware } from "@apollo/server/express4"
import express from 'express'
import cookieParser from "cookie-parser"
import dotenv from 'dotenv'
export const prisma = new PrismaClient()
export const pubsub = new PubSub()
import cors from 'cors'
import pgk from 'body-parser'
const { json } = pgk
dotenv.config()

import * as CompileFile from './api/schema/compile.js'

export const startApolloServer = async () => {
    const app = express()
    const httpServer = createServer(app)

    app.use(cookieParser())
    app.use(expressjwt({
        algorithms: [ "HS512" ],
        secret: "HeadStart",
        credentialsRequired: false,
    }))

    app.use(graphqlUploadExpress())

    const schema = makeSchema({
        types: [ CompileFile ],
        outputs: {
            schema: join(process.cwd(), "/src/api/generated/system.graphql"),
            typegen: join(process.cwd(), "/src/api/generated/system.ts"),
        },
        plugins: [ fieldAuthorizePlugin(), declarativeWrappingPlugin() ]
    })

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql'
    })
    const serverCleanup = useServer({ schema }, wsServer)

    const server = new ApolloServer({
        schema,
        csrfPrevention: true,
        introspection: true,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        }
                    }
                }
            }
        ]
    })

    await server.start()

    app.use("/graphql", cors<cors.CorsRequest>({
        origin: [ "http://localhost:3000", "https://studio.apollographql.com" ],
        credentials: true,
    }), json(), expressMiddleware(server, {
        context: async ({ req, res }) => ({ req, res })
    }))

    await new Promise<void>((resolve) => {
        httpServer.listen({ port: process.env.PORT || 4000 }, resolve)
        console.log(`Relaunching Server... Listening on port 4000`)
    })
}

startApolloServer()
