
import request from 'supertest'
import express from 'express'
const app = express()

const queryData = {
    query: `query sayHello($name: String) {
      hello(name: $name)
    }`,
    variables: { name: 'world' },
};

describe('e2e demo', () => {

    test("Say hello", async () => {
        return await request(app).post("/graphql").send(queryData)
    })
})
