import { createClient } from 'redis';
import dotenv from 'dotenv'
dotenv.config({quiet: true})

const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

client.on('error', err => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis Client connected successfully'));

await client.connect();

export default client
