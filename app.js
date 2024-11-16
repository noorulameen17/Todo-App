const bodyParser = require("body-parser");
const express = require("express");
const app = express();
app.use(bodyParser.json());

const { Todo } = require("./models");

app.get("/todos", (req, res) => {
  console.log("Todo List");
});

app.post("/todos", async (req, res) => {
  console.log("Creating a todo", req.body);
  try {
    const todo = await Todo.addTodo({
      title: req.body.title,
      dueDate: req.body.dueDate,
      completed: false,
    });
    return res.json(todo);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (req, res) => {
  console.log("Updating a todo with ID : ", req.params.id);
  const todo = await Todo.findByPk(req.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

app.delete("/todos/:id", (req, res) => {
  console.log("Deleting a todo with ID : ", req.params.id);
});

module.exports = app;
