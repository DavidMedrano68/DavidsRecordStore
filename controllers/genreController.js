const { default: mongoose, Mongoose } = require("mongoose");
const Album = require("../models/album");
const Artist = require("../models/artist");
const Genre = require("../models/genres");
const Song = require("../models/song");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.genreList = asyncHandler(async (req, res, next) => {
  const genreList = await Genre.find().sort("genreName").exec();
  res.render("genreList", {
    title: "Genre List",
    genreList: genreList,
  });
});
exports.genreDetail = asyncHandler(async (req, res, next) => {
  if (Mongoose.prototype.isValidObjectId(req.params.id)) {
    const [genre, genreAlbums] = await Promise.all([
      Genre.findById(req.params.id).exec(),
      Album.find({ genre: req.params.id }).exec(),
    ]);
    if (genre === null) {
      const err = new Error("Album not found");
      err.status = 404;
      return next(err);
    }
    res.render("genreDetail", {
      title: "Genre Detail",
      genre: genre,
      genreAlbums: genreAlbums,
    });
  } else {
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }
});
exports.genreCreate = asyncHandler(async (req, res, next) => {
  res.render("genreForm", {
    title: "Genre Form",
  });
});
exports.genreCreatePost = [
  // Validate and sanitize fields.
  body("genreName", "invalid genre name too many characters")
    .trim()
    .escape()
    .isLength({ min: 2, max: 40 }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const [isGenre] = await Genre.find({
      genreName: req.body.genreName,
    }).exec();

    if (isGenre) {
      const genreError = new Error("This genre already exist");
      res.render("genreForm", {
        title: "Error",
        errors: [genreError],
      });
    }

    if (!errors.isEmpty()) {
      res.render("genreForm", {
        title: "Genre Form",
        errors: errors.array(),
      });
    } else {
      const genre = new Genre({
        genreName: req.body.genreName,
      });
      await genre.save();
      res.redirect(genre.url);
    }
  }),
];
exports.genreUpdate = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id).exec();
  if (genre === null) {
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }
  res.render("genreForm", {
    title: "Update Genre",
    genre: genre,
  });
});
exports.genreUpdatePost = [
  body("genreName", "invalid genre name too many characters")
    .trim()
    .escape()
    .isLength({ min: 2, max: 40 }),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    const [isGenre] = await Genre.find({
      genreName: req.body.genreName,
    }).exec();

    if (isGenre) {
      const genreError = new Error("This genre already exist");
      res.render("genreForm", {
        title: "Error",
        errors: [genreError],
      });
    }

    if (!errors.isEmpty()) {
      res.render("genreForm", {
        title: "Genre Form",
        errors: errors.array(),
      });
    } else {
      const genre = new Genre({
        genreName: req.body.genreName,
        _id: req.params.id,
      });
      const updatedGenre = await Genre.findByIdAndUpdate(
        req.params.id,
        genre,
        {}
      );
      res.redirect(updatedGenre.url);
    }
  }),
];
exports.genreDelete = asyncHandler(async (req, res, next) => {
  const [genre, artistList, albums] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Artist.find().populate("genre").exec(),
    Album.find().populate("genre").exec(),
  ]);
  if (genre === null) {
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  const artists = artistList.filter((art) => {
    for (let gen of art.genre) {
      if (gen._id.toString() === req.params.id) {
        return art;
      } else {
        return;
      }
    }
  });
  const albumGenre = albums.filter((album) => {
    for (let gen of album.genre) {
      if (gen._id.toString() === req.params.id) {
        return album;
      } else {
        return;
      }
    }
  });
  if (genre._id.toString() === "653dae6ac9ebbb816976bf9d") {
    res.render("genreDelete", {
      title: "Error",
      genre: genre,
      albums: albumGenre.length ? albumGenre : undefined,
      artistList: artists.length ? artists : undefined,
      message: "This Genre can not be deleted. ",
    });
  }

  res.render("genreDelete", {
    title: "Delete Genre",
    genre: genre,
    albums: albumGenre.length ? albumGenre : undefined,
    artistList: artists.length ? artists : undefined,
  });
});

exports.genreDeletePost = asyncHandler(async (req, res, next) => {
  const [genre, artistList, albums] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Artist.find().populate("genre").exec(),
    Album.find().populate("genre").exec(),
  ]);
  if (genre === null) {
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  const artists = artistList.filter((art) => {
    for (let gen of art.genre) {
      if (gen._id.toString() === req.params.id) {
        return art;
      } else {
        return;
      }
    }
  });
  const albumGenre = albums.filter((album) => {
    for (let gen of album.genre) {
      if (gen._id.toString() === req.params.id) {
        return album;
      } else {
        return;
      }
    }
  });
  if (genre._id.toString() === "653dae6ac9ebbb816976bf9d") {
    res.render("genreDelete", {
      title: "Error",
      genre: genre,
      albums: albumGenre.length ? albumGenre : undefined,
      artistList: artists.length ? artists : undefined,
      message: "This Genre can not be deleted. ",
    });
  }
  if (albumGenre.length || artists.length) {
    res.render("genreDelete", {
      title: "Delete Genre",
      genre: genre,
      albums: albumGenre.length ? albumGenre : undefined,
      artistList: artists.length ? artists : undefined,
    });
  } else {
    await Genre.findByIdAndRemove(req.body.genreId);
    res.redirect("/catalog/genres");
  }
});
