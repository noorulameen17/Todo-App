const bodyParser = require("body-parser");
const express = require("express");
const app = express();
app.use( bodyParser.json() );
const path = require("path");

app.set("view engine", "ejs");


app.use( express.static(path.join(__dirname, "public" ) ));


const { Todo } = require( "./models" );

app.get("/", async (req, res) => {
  try {
    const allTodos = await Todo.getTodos();
    if (req.accepts("html")) {
      res.render("index", { allTodos });
    } else {
      res.json({ allTodos });
    }
  } catch (error) {
    res.status(500).send("An error occurred while fetching todos.");
  }
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.findAll(); 
    res.status(200).json(todos); 
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching todos." });
  }
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

app.delete( '/todos/:id/destroy', async ( req, res ) => {
  console.log("Deleting a todo with ID : ", req.params.id);
  try {
    const todoId = req.params.id;
    const result = await Todo.destroy({ where: { id: todoId } }); 
    res.status(200).json(result > 0);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the todo.' });
  }
});

module.exports = app;
