const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const ejs = require("ejs")
const express = require("express")

const app = express()

app.set("view-engine", "ejs")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB")

const articleSchema = {
  title: String,
  content: String,
}

const Article = mongoose.model("Article", articleSchema)

////////////REQUESTS TARGETING ALL ARTICLES///////////////////

app
  .route("/articles")
  .get((req, res) => {
    Article.find({})
      .then((foundArticles) => {
        res.send(foundArticles)
      })
      .catch((err) => {
        res.send(err)
      })
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    })

    newArticle
      .save()
      .then(() => {
        res.send("Successfully added a new article")
      })
      .catch((err) => {
        res.send(err)
      })
  })
  .delete((req, res) => {
    Article.deleteMany({})
      .then(() => {
        res.send("Successfully deleted all articles")
      })
      .catch((err) => {
        res.send(err)
      })
  })

//////////////////REQUESTS TARGETING A SPECIFIC ARTICLES///////////////////

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle })
      .then((foundArticle) => {
        res.send(foundArticle)
      })
      .catch((err) => {
        res.send(err)
      })
  }) ///i have no idea how to format this code nicely below
  .put((req, res) => {
    Article.replaceOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true }
    )
      .then(() => {
        res.send("Successfully updated article.")
      })
      .catch((err) => {
        res.send(err)
      })
  }) 
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      //set is what we use to specify which part of the data we want to change, by sending in the entire req.body that we received, it will UPDATE (not remove and then repopulate what we were sent over like PUT does) all the fields that have been sent in 
      {$set: req.body },
    )
      .then(() => {
        res.send("Successfully updated article.")
      })
      .catch((err) => {
        res.send(err)
      })
  })
  .delete((req,res) => {
    Article.deleteOne({ title: req.params.articleTitle })
      .then(() => {
        res.send("Successfully deleted article.")
      })
      .catch((err) => {
        res.send(err)
      })
  })

app.listen("3000", () => {
  console.log("Successfully started server on port 3000")
})
