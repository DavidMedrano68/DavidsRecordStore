const { default: mongoose, Mongoose } = require("mongoose");
const Album = require("../models/album");
const Artist = require("../models/artist");
const Genre = require("../models/genres");
const Song = require("../models/song");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  const [albumNum, artistNum, genreNum, songNum] = await Promise.all([
    Album.countDocuments({}).exec(),
    Artist.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
    Song.countDocuments({}).exec(),
  ]);
  res.render("index", {
    title: "David's Record Store counts",
    albumNum: albumNum,
    artistNum: artistNum,
    genreNum: genreNum,
    songNum: songNum,
  });
});
exports.albumList = asyncHandler(async (req, res, next) => {
  const [list] = await Promise.all([
    Album.find().sort({ albumName: 1 }).exec(),
  ]);
  res.render("albumList", {
    title: "Album List",
    albumList: list,
  });
});
exports.albumDetail = asyncHandler(async (req, res, next) => {
  if (Mongoose.prototype.isValidObjectId(req.params.id)) {
    const album = await Album.findById(req.params.id)
      .populate("genre")
      .populate("artist")
      .exec();
    if (album === null) {
      const err = new Error("Album not found");
      err.status = 404;
      return next(err);
    }
    const songs = await Song.find({ album: req.params.id }).exec();

    res.render("albumDetail", {
      title: album.albumName,
      album: album,
      songList: songs,
    });
  } else {
    const err = new Error("Album not found");
    err.status = 404;
    return next(err);
  }
});

exports.albumCreate = asyncHandler(async (req, res, next) => {
  const [artistList, genres] = await Promise.all([
    Artist.find().sort({ artistName: 1 }).exec(),
    Genre.find().sort({ genreName: 1 }).exec(),
  ]);
  res.render("albumForm", {
    title: "Create new album",
    artistList: artistList,
    genres: genres,
  });
});
exports.albumCreatePost = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  body("albumName", "Album name can not be empty")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("artist", "Artist must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description can not have more than 249 chars")
    .trim()
    .isLength({ max: 249 })
    .escape(),
  body("price", "This price isnt allowed").isInt().toInt(),
  body("stock", "This is not a number that is allowed").isInt().toInt(),
  body("genre", "Genre can not be empty")
    .escape()
    .custom((value, { req }) => {
      if (req.body.genre.length > 0) {
        return true;
      } else {
        return false;
      }
    }),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const album = new Album({
      albumName: req.body.albumName,
      artist: req.body.artist,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      const [artistList, genres] = await Promise.all([
        Artist.find().sort({ artistName: 1 }).exec(),
        Genre.find().sort({ genreName: 1 }).exec(),
      ]);
      for (const genre of genres) {
        if (album.genre.includes(genre._id)) {
          genre.checked = "true";
        }
      }
      res.render("albumForm", {
        title: "Error",
        artistList: artistList,
        genres: genres,
        album: album,
        errors: errors.array(),
      });
    } else {
      await album.save();
      res.redirect(album.url);
    }
  }),
];
exports.albumUpdate = asyncHandler(async (req, res, next) => {
  const [album, genreList, artistList] = await Promise.all([
    Album.findById(req.params.id).populate("artist").populate("genre").exec(),
    Genre.find().exec(),
    Artist.find().exec(),
  ]);

  if (album === null) {
    // No results.
    const err = new Error("Album not found");
    err.status = 404;
    return next(err);
  }

  for (const genre of genreList) {
    for (const albumG of album.genre) {
      if (genre._id.toString() === albumG._id.toString()) {
        genre.checked = "true";
      }
    }
  }

  res.render("albumForm", {
    title: "Update Album",
    artistList: artistList,
    genres: genreList,
    album: album,
  });
});
exports.albumUpdatePost = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  // Validate and sanitize fields.
  body("albumName", "Album name can not be empty")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("artist", "Artist must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description can not have more than 249 chars")
    .trim()
    .isLength({ max: 249 })
    .escape(),
  body("price", "This price isnt allowed").isInt().toInt(),
  body("stock", "This is not a number that is allowed").isInt().toInt(),
  body("genre", "Genre can not be empty")
    .escape()
    .custom((value, { req }) => {
      if (req.body.genre.length > 0) {
        return true;
      } else {
        return false;
      }
    }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const album = new Album({
      albumName: req.body.albumName,
      artist: req.body.artist,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      genre: req.body.genre,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const [artistList, genres] = await Promise.all([
        Artist.find().sort({ artistName: 1 }).exec(),
        Genre.find().sort({ genreName: 1 }).exec(),
      ]);
      for (const genre of genres) {
        if (album.genre.includes(genre._id)) {
          genre.checked = "true";
        }
      }
      res.render("albumForm", {
        title: "Error",
        artistList: artistList,
        genres: genres,
        album: album,
        errors: errors.array(),
      });
    } else {
      const updatedAlbum = await Album.findByIdAndUpdate(
        req.params.id,
        album,
        {}
      );
      res.redirect(updatedAlbum.url);
    }
  }),
];
exports.albumDelete = asyncHandler(async (req, res, next) => {
  const album = await Album.findById(req.params.id).populate("artist").exec();
  if (album === null) {
    res.redirect("/catalog/albums");
  }
  if (album._id.toString() === "653dae6ac9ebbb816976bfa1") {
    res.render("albumDelete", {
      title: "Error",
      album: album,
      message: "This Album can not be deleted Sadly. ",
    });
  }
  const songs = await Song.find({ album: album._id }).exec();
  if (songs.length) {
    res.render("albumDelete", {
      title: "Album Delete",
      album: album,
      songList: songs,
      message:
        "Before trying to delete album you have to change or delete these songs. ",
    });
  } else {
    res.render("albumDelete", {
      title: "Album Delete",
      album: album,
    });
  }
});
exports.albumDeletePost = asyncHandler(async (req, res, next) => {
  const album = await Album.findById(req.params.id).populate("artist").exec();
  if (album === null) {
    res.redirect("/catalog/albums");
  }

  const songs = await Song.find({ album: album._id }).exec();
  if (songs.length) {
    res.render("albumDelete", {
      title: "Album Delete",
      album: album,
      songList: songs,
      message:
        "Before trying to delete album you have to change or delete these songs. ",
    });
  } else {
    await Album.findByIdAndRemove(req.body.albumId);
    res.redirect("/catalog/albums");
  }
});
