import dotenv from "dotenv";
dotenv.config();

process.env.ENV = "test";
process.env.PORT = "5001";
process.env.MATCH_URL = "http://localhost:5000";
process.env.LOCAL_URL = "http://localhost:5001";
process.env.MATCH_AUTH_TOKEN = "example";
