

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
 mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

 const artilceSchema = {
    title:String,
    content:String
 }

 const Article = new mongoose.model("Article", artilceSchema);

///////////////////////////// HANDLE GENERAL ARTICLES//////////////////////////////////////
app.route("/articles")
 //chaining methods
.get(function(req, res){
  //    Article.find().then(function(results){
  //       console.log(results);
  //    })
   async function fetchData(){
      try{
          const results = await Article.find();
          res.send(results);
      }catch(err){
          res.send(err);
      }
   }fetchData();
  })
  
  .post(function(req, res){
  
    //create a new artilce document
      const newArticle = new Article({
        title:req.body.title,
        content:  req.body.content
      });
    
      async function saveData(){
          try {
            const output = await newArticle.save();
            res.send("successfully created document!")
          } catch (error) {
            res.send(error);
          }
      }saveData();
    
    })
    
    .delete(function(req, res){
      Article.deleteMany().then(function(err){
        if(!err){
          res.send("Successfully deleted all articles");
        }else{
          res.send(err);
        }
      });
      });
 /////////////////////////////////// HANDLE SPECIFIC ARTICLES///////////////////////
  app.route("/articles/:articleId")
  .get(
    function(req, res){

     Article.findOne({title:req.params.articleId}).then(function(err,foundArticle){
      if(!err){
        res.send(foundArticle);
      }else{
        res.send(err);
      }
     })
    })
    .put(
      function(req, res){
        Article.updateOne(
          { title: req.params.articleId },
          { title: req.body.title, content: req.body.content },
        
        ).then(function(err) {
          if (!err) {
            res.send("Successfully updated");
          } else {
            res.send(err);
          }
        });
        
      }
    )
    .patch(function(req, res){
      Article.updateOne(
        {title:req.params.articleId},
        {$set:req.body}
      ).then( function(err){
        if(!err){
          res.send("Document updated successfully!");
        }else{
          res.send(err);
        }
      });
    })
    .delete(function(req, res){
      Article.findOneAndDelete({ title: req.params.articleId })
    .then((deletedArticle) => {
    if (!deletedArticle) {
      res.status(404).send("Article not found.");
    } else {
      res.status(200).send("Successfully deleted the article: " + deletedArticle.title);
    }
    })
    .catch((error) => {
    console.error(error);
    res.status(500).send("An error occurred while deleting the article.");
    });

    }
    );

app.listen(3000, function() {
  console.log("Server started on port 3000");
});