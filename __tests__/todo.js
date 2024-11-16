const req = require("supertest");
const app = require("../app");
const db = require("../models/index");

let server, agent;

describe("Todo Application", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = req.agent(server);
  });
    afterAll( async () => {
        try{
        await db.sequelize.close();
        await server.close();
    }catch ( error ) {
        console.log(error);
    }
  });
  test("Resonds with json at /todos", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy Milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8",
    );
    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.id).toBeDefined();
  });

  test("Mark A Todo As Complete", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy Milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const parsedResponse = JSON.parse(response.text);
    const todoId = parsedResponse.id;
    expect(parsedResponse.completed).toBe(false);

    const markAsCompleteResponse = await agent
      .put(`/todos/${todoId}/markAsCompleted`)
      .send();
    const parsedUpdateResponse = JSON.parse(markAsCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  } );
    
    test("Delete A Todo", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy Milk",
      dueDate: new Date().toISOString(),
      completed: false,
    } );
        
    const parsedResponse = JSON.parse(response.text);
    const todoId = parsedResponse.id;

    const deleteResponse = await agent.delete(`/todos/${todoId}`).send();
    expect(deleteResponse.statusCode).toBe(200);
  });
});
