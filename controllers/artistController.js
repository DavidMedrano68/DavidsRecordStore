const { default: mongoose, Mongoose } = require("mongoose");
const Album = require("../models/album");
const Artist = require("../models/artist");
const Genre = require("../models/genres");
const Song = require("../models/song");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.artistList = asyncHandler(async (req, res, next) => {
  const artistList = await Artist.find().sort("age").populate("genre").exec();
  res.render("artistList", {
    title: "Artist List",
    artistList: artistList,
  });
});
exports.artistDetail = asyncHandler(async (req, res, next) => {
  if (Mongoose.prototype.isValidObjectId(req.params.id)) {
    const [artistDetail, artistSongs, artistAlbums] = await Promise.all([
      Artist.findById(req.params.id).populate("genre").exec(),
      Song.find({ artist: req.params.id }).exec(),
      Album.find({ artist: req.params.id }).exec(),
    ]);
    if (artistDetail === null) {
      const err = new Error("Artist not found");
      err.status = 404;
      return next(err);
    }
    res.render("artistDetail", {
      title: "Artist Records",
      artist: artistDetail,
      songList: artistSongs,
      albums: artistAlbums,
    });
  } else {
    const err = new Error("Artist not found");
    err.status = 404;
    return next(err);
  }
});
exports.artistCreate = asyncHandler(async (req, res, next) => {
  const genres = await Genre.find().exec();
  res.render("artistForm", {
    title: "Create Artist",
    genres: genres,
  });
});
exports.artistCreatePost = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  body("firstName", "invalid first name")
    .trim()
    .escape()
    .custom((value, { req }) => {
      if (req.body.bandName) {
        if (!req.body.firstName && !req.body.lastName) {
          return true;
        } else {
          return false;
        }
      } else if (req.body.firstName && req.body.lastName) {
        if (req.body.firstName.length && req.body.lastName.length > 2) {
          return true;
        } else {
          throw new Error(
            "first name or last name has to be at least 3 characters"
          );
        }
      }
    }),

  body("lastName", "invalid last name")
    .trim()
    .escape()
    .custom((value, { req }) => {
      if (req.body.bandName) {
        if (!req.body.firstName && !req.body.lastName) {
          return true;
        } else {
          return false;
        }
      } else if (req.body.firstName && req.body.lastName) {
        if (req.body.firstName.length && req.body.lastName.length > 2) {
          return true;
        } else {
          throw new Error(
            "first name or last name has to be at least 3 characters"
          );
        }
      }
    }),
  body("bandName", "invalid band name")
    .trim()
    .escape()
    .custom((value, { req }) => {
      if (!value) {
        if (!req.body.firstName && !req.body.lastName) {
          return false;
        } else {
          return true;
        }
      } else if (req.body.bandName) {
        if (req.body.bandName.length > 1) {
          return true;
        } else {
          return false;
        }
      }
    })
    .optional(),
  body("origin", "too many characters")
    .trim()
    .optional()
    .isLength({ max: 249 })
    .escape(),
  body("genre", "Genre can not be empty")
    .escape()
    .custom((value, { req }) => {
      if (req.body.genre.length > 0) {
        return true;
      } else {
        return false;
      }
    }),
  body("age", "this age is invalid").isInt().toInt(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const artist = new Artist({
      firstName: req.body.firstName ? req.body.firstName : undefined,
      lastName: req.body.lastName ? req.body.lastName : undefined,
      bandName: req.body.bandName ? req.body.bandName : undefined,
      origin: req.body.origin ? req.body.origin : undefined,
      age: req.body.age,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      const genres = await Genre.find().exec();
      res.render("artistForm", {
        title: "Error",
        genres: genres,
        errors: errors.array(),
      });
    } else {
      await artist.save();
      res.redirect(artist.url);
    }
  }),
];
exports.artistUpdate = asyncHandler(async (req, res, next) => {
  const [artist, genreList] = await Promise.all([
    Artist.findById(req.params.id).populate("genre").exec(),
    Genre.find().exec(),
  ]);

  if (artist === null) {
    // No results.
    const err = new Error("Artist not found");
    err.status = 404;
    return next(err);
  }

  for (const genre of genreList) {
    for (const artistG of artist.genre) {
      if (genre._id.toString() === artistG._id.toString()) {
        genre.checked = "true";
      }
    }
  }

  res.render("artistForm", {
    title: "Update Artist",
    genres: genreList,
    artist: artist,
  });
});
exports.artistUpdatePost = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  body("firstName", "invalid first name")
    .trim()
    .escape()
    .custom((value, { req }) => {
      if (req.body.bandName) {
        if (!req.body.firstName && !req.body.lastName) {
          return true;
        } else {
          return false;
        }
      } else if (req.body.firstName && req.body.lastName) {
        if (req.body.firstName.length && req.body.lastName.length > 2) {
          return true;
        } else {
          throw new Error(
            "first name or last name has to be at least 3 characters"
          );
        }
      }
    }),

  body("lastName", "invalid last name")
    .trim()
    .escape()
    .custom((value, { req }) => {
      if (req.body.bandName) {
        if (!req.body.firstName && !req.body.lastName) {
          return true;
        } else {
          return false;
        }
      } else if (req.body.firstName && req.body.lastName) {
        if (req.body.firstName.length && req.body.lastName.length > 2) {
          return true;
        } else {
          throw new Error(
            "first name or last name has to be at least 3 characters"
          );
        }
      }
    }),
  body("bandName", "invalid band name")
    .trim()
    .escape()
    .custom((value, { req }) => {
      if (!value) {
        if (!req.body.firstName && !req.body.lastName) {
          return false;
        } else {
          return true;
        }
      } else if (req.body.bandName) {
        if (req.body.bandName.length > 1) {
          return true;
        } else {
          return false;
        }
      }
    })
    .optional(),
  body("origin", "too many characters")
    .trim()
    .optional()
    .isLength({ max: 249 })
    .escape(),
  body("genre", "Genre can not be empty")
    .escape()
    .custom((value, { req }) => {
      if (req.body.genre.length > 0) {
        return true;
      } else {
        return false;
      }
    }),
  body("age", "this age is invalid").isInt().toInt(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const artist = new Artist({
      firstName: req.body.firstName ? req.body.firstName : undefined,
      lastName: req.body.lastName ? req.body.lastName : undefined,
      bandName: req.body.bandName ? req.body.bandName : undefined,
      origin: req.body.origin ? req.body.origin : undefined,
      age: req.body.age,
      genre: req.body.genre,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const genres = await Genre.find().exec();
      res.render("artistForm", {
        title: "Error",
        genres: genres,
        errors: errors.array(),
      });
    } else {
      const updatedArtist = await Artist.findByIdAndUpdate(
        req.params.id,
        artist,
        {}
      );
      res.redirect(updatedArtist.url);
    }
  }),
];

exports.artistDelete = asyncHandler(async (req, res, next) => {
  const [artist, albums, songs, allSongs] = await Promise.all([
    Artist.findById(req.params.id).populate("genre").exec(),
    Album.find({ artist: req.params.id }).exec(),
    Song.find({ artist: req.params.id }).exec(),
    Song.find().exec(),
  ]);

  if (artist === null) {
    const err = new Error("Artist not found");
    err.status = 404;
    return next(err);
  }
  if (artist._id.toString() === "653dae6ac9ebbb816976bf9f") {
    res.render("artistDelete", {
      title: "Can not delete this artist.",
      message: "Unfortunately this artist isn't deletable any other artist is.",
      artist: artist,
    });
  }
  const artistSongs = allSongs.filter((song) => {
    for (let artist of song.featured) {
      if (artist._id.toString() === req.params.id) {
        return artist;
      } else {
        return;
      }
    }
  });
  if (albums.length || songs.length || artistSongs.length) {
    res.render("artistDelete", {
      title: "Delete Artist",
      artist: artist,
      albums: albums.length ? albums : undefined,
      songs: songs.length ? songs : undefined,
      artistSongs: artistSongs.length ? artistSongs : undefined,
      message:
        "Before trying to delete this artist you will have to delete or change the following :",
    });
  }

  res.render("artistDelete", {
    title: "Delete Artist",
    artist: artist,
  });
});
exports.artistDeletePost = asyncHandler(async (req, res, next) => {
  const [artist, albums, songs, allSongs] = await Promise.all([
    Artist.findById(req.params.id).populate("genre").exec(),
    Album.find({ artist: req.params.id }).exec(),
    Song.find({ artist: req.params.id }).exec(),
    Song.find().exec(),
  ]);

  if (artist === null) {
    const err = new Error("Artist not found");
    err.status = 404;
    return next(err);
  }
  if (artist._id.toString() === "653dae6ac9ebbb816976bf9f") {
    res.render("artistDelete", {
      title: "Can not delete this artist.",
      message: "Unfortunately this artist isn't deletable any other artist is.",
      artist: artist,
    });
  }
  const artistSongs = allSongs.filter((song) => {
    for (let artist of song.featured) {
      if (artist._id.toString() === req.params.id) {
        return artist;
      } else {
        return;
      }
    }
  });
  if (albums.length || songs.length || artistSongs.length) {
    res.render("artistDelete", {
      title: "Delete Artist",
      artist: artist,
      albums: albums.length ? albums : undefined,
      songs: songs.length ? songs : undefined,
      artistSongs: artistSongs.length ? artistSongs : undefined,
      message:
        "Before trying to delete this artist you will have to delete or change the following :",
    });
  } else {
    await Artist.findByIdAndRemove(req.body.artistId);
    res.redirect("/catalog/artists");
  }
});
