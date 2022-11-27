import { ApolloServer } from "apollo-server-express/dist/ApolloServer.js"
import { makeSchema } from 'nexus/dist/makeSchema.js'
import { createServer } from "http"
import { WebSocketServer } from 'ws'
import { useServer } from "graphql-ws/lib/use/ws"
import { expressjwt } from 'express-jwt'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { join } from 'path'
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs'
import authorization from 'nexus';
const { fieldAuthorizePlugin, declarativeWrappingPlugin } = authorization;
import express from 'express'
import cookieParser from "cookie-parser"
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { PubSub } from "graphql-subscriptions/dist/pubsub.js"
export const prisma = new PrismaClient()
export const pubsub = new PubSub()
dotenv.config()

import * as Information from './api/schema/compile.js'

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
        types: [ Information ],
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
        debug: true,
        cache: "bounded",
        context: ({ req, res }) => ({ req, res }),
        introspection: true,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose()
                        }
                    }
                }
            }
        ]
    })

    await server.start()

    await server.applyMiddleware({
        app, path: "/graphql",
        cors: {
            credentials: true,
            origin: [ "https://studio.apollographql.com", "http://localhost:3000" ]
        }
    })

    await new Promise(() => {
        httpServer.listen({ port: process.env.PORT || 4000 })
        console.log(`Relaunching Server... Listening on port 4000`)
    })
}

startApolloServer()
