const express = require('express');
const app = express();
const ejs = require('ejs')
const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))

const userschema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }
})

const userModel = mongoose.model("user_todos", userschema)

let todoarray = []
let message = " ";
app.get("/", (req, res) => {
    res.redirect("/todo");
});

app.get("/todo", async (req, res) => {
    try {
        const todos = await userModel.find();
        res.render("todo", { todoarray: todos });
    } catch (error) {
        console.log("error fetching todo details", error);
        message = ``
    }


});

app.get("/todo/edit/:id", async (req, res) => {

    try {
        const todo = await userModel.findById(req.params.id);
        res.render("edit", { onetodo: todo });

    } catch (error) {
        console.log("Error fetching todo:", error);
    }

});


app.post("/todo/submit", async (req, res) => {

    try {
        const newTodo = new userModel({
            title: req.body.title,
            content: req.body.content
        });
        await newTodo.save();
        console.log("Todo saved", newTodo);

        // console.log(req.body);
        // todoarray.push(req.body)
        res.redirect("/todo");
    } catch (error) {
        console.log("Error saving todo:", error);
    }

});



app.post("/todo/delete/:id", async (req, res) => {

    try {
        await userModel.findByIdAndDelete(req.params.id);
        console.log("Todo deleted", req.params.id);
        res.redirect("/todo");
    } catch (error) {
        console.log("Error deleting todo:", error);
    }
});

app.post("/todo/update/:id", async (req, res) => {
    try {
        await userModel.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
                content: req.body.content
        });

console.log("Todo Updated:", req.params.id);
res.redirect("/todo");

} catch (error) {
    console.log("Error updating todo:", error);
}

});








const uri = "mongodb+srv://BadMan:Badmantin@cluster0.uashs.mongodb.net/LoginDatabase?retryWrites=true&w=majority&appName=Cluster0"

const connect = async () => {
    try {
        const connected = await mongoose.connect(uri);

        if (connected) {
            console.log("connected to database");
        }
    } catch (error) {
        console.log(error);
    }
};
connect();

// Start the server
const port = 4001;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
