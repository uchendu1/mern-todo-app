const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const todoRoutes = express.Router();
const PORT = 4000;
let Todo = require("./todo.model");

//app.use() is used along side middlewares
app.use(cors());
app.use(bodyParser.json());
app.use("/todos", todoRoutes);
mongoose.connect("mongodb://127.0.0.1:27017/todos", { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

todoRoutes.route("/").get((req, res) => {
  Todo.find((err, todos) => {
    if (err) {
      console.log(err);
    } else {
      res.json(todos);
    }
  });
});

todoRoutes.route("/:id").get((req, res) => {
  let id = req.params.id;
  Todo.findById(id, (err, todo) => {
    res.json(todo);
  });
});

todoRoutes.route("/add").post((req, res) => {
  let todo = new Todo(req.body);
  todo
    .save()
    .then((todo) => {
      res.status(200).json({ todo: "todo added successfully" });
    })
    .catch((err) => {
      res.status(400).send("adding new todo failed");
    });
});

todoRoutes.route("/update/:id").post((req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (!todo) res.status(404).send("data is not found");
    else 
    todo.todo_description = req.body.todo_description;
    todo.todo_responsible = req.body.todo_responsible;
    todo.todo_priority = req.body.todo_priority;
    todo.todo_completed = req.body.todo_completed;

    todo.save().then((todo) => {
      res.json("Todo updated");
    }) 
    .catch(err =>{
      res.status(400).send('updated not possible');
    })
  });
});

todoRoutes.route('/delete/:id').delete((req,res)=>{
  Todo.findByIdAndRemove(req.params.id, (err, todo) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send("Todo successfully deleted")
});
})



app.listen(PORT, () => {
  console.log(`server is running on ${PORT} port`);
});



