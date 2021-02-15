/*
Cheryl Kong A01227891
*/
const express = require("express");
const fs = require("fs")
const mv_lst = []

function add_movie(movies, mv_lst)//add all movies into a list
{
  var ary = mv_lst.map(v => v.toLowerCase());
  for (m_name of movies) {
    if (!ary.includes(m_name.toLowerCase())) {
      mv_lst.push(m_name)
    }
  }
}

let app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("pages/index", { movies: mv_lst }));

app.get("/myForm", (req, res) => res.render("pages/myForm"));

app.post("/myForm", (req, res) => {
  var movies = req.body.movies;
  movies = movies.split(',');
  setTimeout(() => {
    add_movie(movies, mv_lst)
  }, 5);

  res.render("pages/index", { movies: movies });
  res.redirect('/')
});

app.get("/myListQueryString", (req, res) => {
  let movie1 = req.query.movie1;
  let movie2 = req.query.movie2;
  var movies = new Array(movie1, movie2);
  setTimeout(() => {
    add_movie(movies, mv_lst)
  }, 5);
  res.render("pages/index", { movies: movies });
});

app.get("/search/:movieName", (req, res) => {
  var movieName = req.params.movieName;
  var movie = '';
  fs.readFile('movieDescriptions.txt', "utf8", function (err, data) {
    if (err) {
      console.log(err);
    }
    else {
      data = data.split('.')
      for (i in data) {
        if (data[i].toLowerCase().includes(movieName.toLowerCase())) {
          movie = movie.concat(data[i]);
        }
      }
    }
  });
  
  setTimeout(() => {
    if (movie.length > 0) {
      var search_movie = movie.split(':');
      res.send(`<h1>${search_movie[0]}</h1>
                <p>${search_movie[1]}</p>
                <a href='http://localhost:3000'>Back to home page</a>`);
    }
    else {
      res.send(`<p>Movie could not be found ${search_movie} ${movieName} ${movie}</p>
                <a href='http://localhost:3000'>Back to home page</a>`);
    }
  }, 10);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000 🚀");
});
