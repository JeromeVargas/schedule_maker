import supertest from "supertest";

import { server, connection } from "../src/server";

describe("GET /school ", () => {
  afterAll(() => {
    connection.close();
  });
  it("should start working", async () => {
    const { statusCode, body } = await supertest(server)
      .get("/api/v1/school")
      .send();
    expect(statusCode).toBe(200);
    expect(body.data).toBe("testing the school endpoint");
  });
});
