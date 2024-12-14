import request from "supertest";
import { app } from "../app";

const email = `test-${Date.now()}@example.com`;

describe("POST /api/signup", () => {
  it("should create user", async () => {
    await request(app)
      .post("/api/signup")
      .send({
        email,
        username: "example",
        password: "example",
      })
      .set("Accept", "application/json")
      //.expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        console.log(res.body);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  it("should throw already exists error", async () => {
    await request(app)
      .post("/api/signup")
      .send({
        email,
        username: "example",
        password: "example",
      })
      .set("Accept", "application/json")
      //.expect('Content-Type', /json/)
      .expect(409)
      .then((res) => {
        console.log(res.body);
      })
      .catch((err) => {
        console.error(err);
      });
  });
});

describe("POST /api/login", () => {
  it("should login user", async () => {
    await request(app)
      .post("/api/login")
      .send({
        email,
        password: "example",
      })
      .set("Accept", "application/json")
      //.expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        console.log(res.body);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  it("should throw invalid credentials error", async () => {
    await request(app)
      .post("/api/login")
      .send({
        email,
        password: "invalid",
      })
      .set("Accept", "application/json")
      //.expect('Content-Type', /json/)
      .expect(401)
      .then((res) => {
        console.log(res.body);
      })
      .catch((err) => {
        console.error(err);
      });
  });
});
