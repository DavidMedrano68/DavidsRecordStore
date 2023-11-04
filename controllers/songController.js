const { default: mongoose, Mongoose } = require("mongoose");
const Album = require("../models/album");
const Artist = require("../models/artist");

const Song = require("../models/song");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.songList = asyncHandler(async (req, res, next) => {
  const songList = await Song.find().sort("album").populate("album").exec();
  res.render("songList", {
    title: "Song List",
    songList: songList,
  });
});
exports.songDetail = asyncHandler(async (req, res, next) => {
  if (Mongoose.prototype.isValidObjectId(req.params.id)) {
    const song = await Song.findById(req.params.id)
      .populate("artist")
      .populate("album")
      .populate("featured")
      .exec();
    res.render("songDetail", {
      title: "Song Detail",
      song: song,
    });
  } else {
    const err = new Error("Song not found");
    err.status = 404;
    return next(err);
  }
});
exports.songForm = asyncHandler(async (req, res, next) => {
  const [albums, artistList] = await Promise.all([
    Album.find().exec(),
    Artist.find().exec(),
  ]);
  res.render("songForm", {
    title: "Song Form",
    artistList: artistList,
    albums: albums,
  });
});
exports.songCreatePost = [
  (req, res, next) => {
    if (!(req.body.featured instanceof Array)) {
      if (typeof req.body.featured === "undefined") req.body.featured = [];
      else req.body.featured = new Array(req.body.featured);
    }
    next();
  },

  body("songName", "invalid song name")
    .trim()
    .escape()
    .isLength({ min: 2, max: 40 }),

  body("artist", "Artist must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("album", "Album must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("runtime", "Invalid runtime").isInt().toInt(),

  body("featured.*").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const song = new Song({
      songName: req.body.songName,
      artist: req.body.artist,
      album: req.body.album,
      runtime: req.body.runtime,
      featured: req.body.featured,
    });

    if (!errors.isEmpty()) {
      const artists = await Artist.find().exec();
      for (const artist of artists) {
        if (song.featured.includes(artist._id)) {
          artist.checked = "true";
        }
      }
      const [albums, artistList] = await Promise.all([
        Album.find().exec(),
        Artist.find().exec(),
      ]);
      res.render("songForm", {
        title: "Song Form",
        artistList: artistList,
        albums: albums,
        errors: errors.array(),
      });
    } else {
      await song.save();
      res.redirect(song.url);
    }
  }),
];
exports.songUpdate = asyncHandler(async (req, res, next) => {
  if (Mongoose.prototype.isValidObjectId(req.params.id)) {
    const [albums, artistList, song] = await Promise.all([
      Album.find().exec(),
      Artist.find().exec(),
      Song.findById(req.params.id).populate("artist").populate("album").exec(),
    ]);

    if (song === null) {
      const err = new Error("Song not found");
      err.status = 404;
      return next(err);
    }
    if (song.featured) {
      for (const artist of artistList) {
        for (const featured of song.featured) {
          if (artist._id.toString() === featured._id.toString()) {
            artist.checked = "true";
          }
        }
      }
    }

    res.render("songForm", {
      title: "Update Song",
      song: song,
      artistList: artistList,
      albums: albums,
    });
  } else {
    const err = new Error("Song not found");
    err.status = 404;
    return next(err);
  }
});

exports.songUpdatePost = [
  (req, res, next) => {
    if (!(req.body.featured instanceof Array)) {
      if (typeof req.body.featured === "undefined") req.body.featured = [];
      else req.body.featured = new Array(req.body.featured);
    }
    next();
  },

  body("songName", "invalid song name")
    .trim()
    .escape()
    .isLength({ min: 2, max: 40 }),

  body("artist", "Artist must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("album", "Album must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("runtime", "Invalid runtime").isInt().toInt(),

  body("featured.*").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const song = new Song({
      songName: req.body.songName,
      artist: req.body.artist,
      album: req.body.album,
      runtime: req.body.runtime,
      featured: req.body.featured,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const artists = await Artist.find().exec();
      for (const artist of artists) {
        if (song.featured.includes(artist._id)) {
          artist.checked = "true";
        }
      }
      const [albums, artistList] = await Promise.all([
        Album.find().exec(),
        Artist.find().exec(),
      ]);
      res.render("songForm", {
        title: "Song Form",
        artistList: artistList,
        albums: albums,
        errors: errors.array(),
      });
    } else {
      const updatedSong = await Song.findByIdAndUpdate(req.params.id, song, {});
      res.redirect(updatedSong.url);
    }
  }),
];
exports.songDelete = asyncHandler(async (req, res, next) => {
  const song = await Song.findById(req.params.id)
    .populate("album")
    .populate("artist")
    .exec();
  if (song === null) {
    res.redirect("/catalog/songs");
  }
  if (song.album.albumName !== "Singles ( All singles here )") {
    res.render("songDelete", {
      title: "Delete Song",
      message:
        "This Song is part of an album are you sure you'd like to delete it? ",
      song: song,
    });
  } else {
    res.render("songDelete", {
      title: "Delete Song",
      song: song,
    });
  }
});
exports.songDeletePost = asyncHandler(async (req, res, next) => {
  const song = await Song.findById(req.params.id)
    .populate("album")
    .populate("artist")
    .exec();
  if (song === null) {
    res.redirect("/catalog/songs");
  }
  if (song.album.albumName !== "Singles ( All singles here )") {
    res.render("songDelete", {
      title: "Delete Song",
      message:
        "This Song is part of an album are you sure you'd like to delete it? ",
      song: song,
    });
  } else {
    await Song.findByIdAndRemove(req.body.songId);
    res.redirect("/catalog/songs");
  }
});
