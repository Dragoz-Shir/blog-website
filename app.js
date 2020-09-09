//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/daylyJournal", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const dailySchema = new mongoose.Schema({
  titulo: {
    required: true,
    type: String,
  },
  contenido: {
    required: true,
    type: String,
  },
});
const Daily = mongoose.model("Daily", dailySchema);
/*const daylyPost = Daily.create(
  { titulo: "Prueba", contenido: "algo así a lo loco alv" },
  function (e, bien) {
    if (!e) {
      console.log("todo bien: " + bien);
    }
  }
);*/
//const posts = [];

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

app.get("/", function (req, res) {
  Daily.find({}, function (e, postFound) {
    if (!e) {
      res.render("home", { homeInfo: homeStartingContent, posts: postFound });
      //console.log(postFound);
    }
  });
});
app.get("/about", function (req, res) {
  res.render("about", { aboutInfo: aboutContent });
});
app.get("/contact", function (req, res) {
  res.render("contact", { contactInfo: contactContent });
});
app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const title = req.body.titulo;
  const content = req.body.contenido;

  const post = new Daily({
    titulo: title,
    contenido: content,
  });
  post.save();
  res.redirect("/");

  //  posts.push(post);
});

app.get("/posts/:topics", function (req, res) {
  /*let buscar = _.lowerCase(req.params.topics);

  posts.forEach(function (post) {x
    if (_.lowerCase(post.title) === buscar) {
      res.render("post", { title: post.title, info: post.contenido });
    }
  });*/
  const id = req.params.topics;
  Daily.find({ _id: id }, function (e, postByID) {
    if (!e && postByID != null) {
      console.log(
        "lo encontre este es el post: " +
          postByID +
          "Titulo" +
          postByID[0].titulo
      );

      res.render("post", {
        title: postByID[0].titulo,
        info: postByID[0].contenido,
      });
      // console.log("Titulo: " + postFound.titulo);
      // console.log("contenido: " + postFound.contenido);
    }
  });
});
