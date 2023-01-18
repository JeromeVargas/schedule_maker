import supertest from "supertest";

import { server, connection } from "../server";
import * as MongoServices from "../services/mongoServices";

const schoolPayload = {
  _id: "63c5dcac78b868f800355853",
  name: "school 182",
};

describe("GET /school ", () => {
  afterAll(() => {
    connection.close();
  });
  it("should get all schools", async () => {
    jest
      .spyOn(MongoServices, "findAllResources")
      // @ts-ignore
      .mockReturnValueOnce([schoolPayload]);
    const { statusCode, body } = await supertest(server)
      .get("/api/v1/school")
      .send();
    expect(statusCode).toBe(200);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(String),
          name: "school 182",
        }),
      ])
    );
  });
});
