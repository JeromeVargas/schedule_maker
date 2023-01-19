import supertest from "supertest";

import { server, connection } from "../server";
import * as MongoServices from "../services/mongoServices";

describe("Schedule maker API", () => {
  describe("RESOURCE => School", () => {
    // inputs
    const newSchool = {
      _id: "63c5dcac78b868f800355853",
      name: "school 182",
    };
    const newSchoolMissingName = {
      _id: "63c5dcac78b868f800355853",
      nam: "school 182",
    };
    const newSchoolEmptyValue = {
      _id: "63c5dcac78b868f800355853",
      name: "",
    };
    const newSchoolNotAString = {
      _id: "63c5dcac78b868f800355853",
      name: 98761234431789,
    };
    const newSchoolNameTooLong = {
      _id: "63c5dcac78b868f800355853",
      name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
    };
    // payloads
    const schoolPayload = {
      _id: "63c5dcac78b868f800355853",
      name: "school 182",
    };
    const updatedSchoolPayload = {
      _id: "63c5dcac78b868f800355853",
      name: "school 039",
    };
    const deletedSchoolPayload = {
      schoolDeleted: {
        _id: "63c5dcac78b868f800355853",
        name: "School 001",
      },
    };
    // hooks
    afterAll(() => {
      connection.close();
    });
    describe("POST /school ", () => {
      it("should create a school", async () => {
        jest
          .spyOn(MongoServices, "findResourceByProperty")
          // @ts-ignore
          .mockReturnValueOnce(null);
        jest
          .spyOn(MongoServices, "insertResource")
          // @ts-ignore
          .mockReturnValueOnce(schoolPayload);
        const { statusCode, body } = await supertest(server)
          .post("/api/v1/school")
          .send(newSchool);
        expect(statusCode).toBe(201);
        expect(body).toEqual(
          expect.objectContaining({
            _id: expect.any(String),
            name: "school 182",
          })
        );
      });
      it("should return a duplicated school error", async () => {
        jest
          .spyOn(MongoServices, "findResourceByProperty")
          // @ts-ignore
          .mockReturnValueOnce(newSchool);
        jest
          .spyOn(MongoServices, "insertResource")
          // @ts-ignore
          .mockReturnValueOnce(schoolPayload);
        const { statusCode, body } = await supertest(server)
          .post("/api/v1/school")
          .send(newSchool);
        expect(statusCode).toBe(409);
        expect(body).toEqual(
          expect.objectContaining({
            msg: "This school already exists",
          })
        );
      });
      it("should return a name needed error", async () => {
        jest
          .spyOn(MongoServices, "findResourceByProperty")
          // @ts-ignore
          .mockReturnValueOnce(newSchool);
        jest
          .spyOn(MongoServices, "insertResource")
          // @ts-ignore
          .mockReturnValueOnce(schoolPayload);
        const { statusCode, body } = await supertest(server)
          .post("/api/v1/school")
          .send(newSchoolMissingName);
        expect(statusCode).toBe(400);
        expect(body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              msg: "Please add a name",
            }),
          ])
        );
      });
      it("should return a empty field error", async () => {
        jest
          .spyOn(MongoServices, "findResourceByProperty")
          // @ts-ignore
          .mockReturnValueOnce(newSchool);
        jest
          .spyOn(MongoServices, "insertResource")
          // @ts-ignore
          .mockReturnValueOnce(schoolPayload);
        const { statusCode, body } = await supertest(server)
          .post("/api/v1/school")
          .send(newSchoolEmptyValue);
        expect(statusCode).toBe(400);
        expect(body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              msg: "The name field is empty",
            }),
          ])
        );
      });
      it("should return a not valid name error", async () => {
        jest
          .spyOn(MongoServices, "findResourceByProperty")
          // @ts-ignore
          .mockReturnValueOnce(newSchool);
        jest
          .spyOn(MongoServices, "insertResource")
          // @ts-ignore
          .mockReturnValueOnce(schoolPayload);
        const { statusCode, body } = await supertest(server)
          .post("/api/v1/school")
          .send(newSchoolNotAString);
        expect(statusCode).toBe(400);
        expect(body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              msg: "The name is not valid",
            }),
          ])
        );
      });
      it("should return a name too long error", async () => {
        jest
          .spyOn(MongoServices, "findResourceByProperty")
          // @ts-ignore
          .mockReturnValueOnce(newSchool);
        jest
          .spyOn(MongoServices, "insertResource")
          // @ts-ignore
          .mockReturnValueOnce(schoolPayload);
        const { statusCode, body } = await supertest(server)
          .post("/api/v1/school")
          .send(newSchoolNameTooLong);
        expect(statusCode).toBe(400);
        expect(body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              msg: "The name must not exceed 100 characters",
            }),
          ])
        );
      });
    });

    describe("GET /school ", () => {
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
      it("should get a school", async () => {
        jest
          .spyOn(MongoServices, "findResourceById")
          // @ts-ignore
          .mockReturnValueOnce(schoolPayload);
        const { statusCode, body } = await supertest(server)
          .get(`/api/v1/school/${newSchool._id}`)
          .send();
        expect(statusCode).toBe(200);
        expect(body).toEqual(
          expect.objectContaining({
            _id: expect.any(String),
            name: "school 182",
          })
        );
      });
    });

    describe("PUT /school ", () => {
      it("should update a school", async () => {
        jest
          .spyOn(MongoServices, "updateResource")
          // @ts-ignore
          .mockReturnValueOnce(updatedSchoolPayload);
        const { statusCode, body } = await supertest(server)
          .put(`/api/v1/school/${newSchool._id}`)
          .send();
        expect(statusCode).toBe(200);
        expect(body).toEqual(
          expect.objectContaining({
            _id: expect.any(String),
            name: "school 039",
          })
        );
      });
    });

    describe("DELETE /school ", () => {
      it("should delete a school", async () => {
        jest
          .spyOn(MongoServices, "deleteResource")
          // @ts-ignore
          .mockReturnValueOnce(deletedSchoolPayload);
        const { statusCode, body } = await supertest(server)
          .delete(`/api/v1/school/${newSchool._id}`)
          .send();
        expect(statusCode).toBe(200);
        expect(body).toEqual(
          expect.objectContaining({
            schoolDeleted: {
              _id: newSchool._id,
              name: "School 001",
            },
          })
        );
      });
    });
  });
});
