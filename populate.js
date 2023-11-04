console.log("attempting to create collection");

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Artist = require("./models/artist");
const Genres = require("./models/genres");
const Album = require("./models/album");
const Song = require("./models/song");

const artists = [];
const genres = [];
const albums = [];
const songs = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];
async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createGenre();
  await createArtist();
  await createAlbum();
  await createSong();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

main().catch((err) => console.log(err));

async function genreCreate(index, name) {
  const genre = new Genres({ genreName: name });
  await genre.save();
  genres[index] = genre;
  console.log(`Added genre: ${name}`);
}
async function songCreate(index, songName, runtime, artist, featured, album) {
  const songDetail = {
    songName: songName,
    runtime: runtime,
    artist: artist,
  };
  if (album != false) songDetail.album = album;
  if (featured != false) songDetail.featured = featured;
  const song = new Song(songDetail);
  await song.save();
  songs[index] = song;
}
async function albumCreate(
  index,
  artist,
  albumName,
  description,
  genre,
  price,
  stock
) {
  const albumDetail = {
    albumName: albumName,
    genre: genre,
    price: price,
    stock: stock,
    artist: artist,
  };
  if (description != false) albumDetail.description = description;
  const album = new Album(albumDetail);
  await album.save();
  albums[index] = album;
  console.log(`we are saving record named ${albumName}`);
}
async function artistCreate(
  index,
  firstName,
  lastName,
  bandName,
  origin,
  age,
  genre
) {
  const artistDetail = {
    origin: origin,
    genre: genre,
  };
  if (firstName && lastName != false) {
    artistDetail.firstName = firstName;
    artistDetail.lastName = lastName;
  }
  if (bandName != false) artistDetail.bandName = bandName;
  if (age != false) artistDetail.age = age;
  const artist = new Artist(artistDetail);
  await artist.save();
  artists[index] = artist;

  console.log(
    `we are currently saving artist named ${
      firstName && lastName ? firstName + lastName : bandName
    }`
  );
}
async function createGenre() {
  console.log("creating genre");
  await genreCreate(0, "Multiple Genres ( used for singles )");
  //   await Promise.all([
  //     genreCreate(0, "Hip-Hop / Rap"),
  //     genreCreate(1, "R&B"),
  //     genreCreate(2, "Pop"),
  //     genreCreate(3, "Rock"),
  //     genreCreate(4, "Musica Mexicana"),
  //     genreCreate(5, "Metal"),
  //     genreCreate(6, "Country"),
  //     genreCreate(7, "Urban Latino"),
  //     genreCreate(8, "Alternative Rock"),
  //   ]);
}
async function createArtist() {
  console.log("creating artist");
  await artistCreate(
    0,
    false,
    false,
    "Multiple artist ( used for singles )",
    false,
    24,
    genres[0]
  );
  //   await Promise.all([
  //     artistCreate(
  //       0,
  //       "Kendrick",
  //       "Lamar",
  //       false,
  //       "Lamar was born to Kenny Duckworth and Paula Oliver in Compton, California on June 17, 1987. His parents named him after Eddie Kendricks, with the R&B music group, The Temptations.",
  //       36,
  //       genres[0]
  //     ),
  //     artistCreate(
  //       1,
  //       false,
  //       false,
  //       "Rihanna",
  //       "Robyn Rihanna Fenty was born on February 20, 1988, in Saint Michael, Barbados. She is the daughter of accountant Monica (née Braithwaite) and warehouse supervisor Ronald Fenty.",
  //       35,
  //       [genres[0], genres[1], genres[2]]
  //     ),
  //     artistCreate(
  //       2,
  //       false,
  //       false,
  //       "U2",
  //       "U2 are an Irish rock band from Dublin, formed in 1976. The group consists of Bono (lead vocals and rhythm guitar), the Edge (lead guitar, keyboards, and backing vocals), Adam Clayton (bass guitar), and Larry Mullen Jr. (drums and percussion).",
  //       46,
  //       genres[3]
  //     ),
  //   ]);

  //   await Promise.all([
  //     artistCreate(
  //       3,
  //       "Christian",
  //       "Nodal",
  //       false,
  //       "Christian Nodal was born and raised in Caborca, Sonora, Mexico to musicians Cristina Silvia Nodal and Jaime González.",
  //       24,
  //       genres[4]
  //     ),
  //     artistCreate(
  //       4,
  //       "David",
  //       "Bisbal",
  //       false,
  //       "David Bisbal was born on 5 June 1979 in Almería, Spain.",
  //       44,
  //       genres[4]
  //     ),
  //   ]);
  //   await artistCreate(
  //     5,
  //     false,
  //     false,
  //     "Gojira",
  //     "Gojira is a French heavy metal band from Ondres. Founded as Godzilla in 1996, the band's lineup—brothers Joe (lead vocals, rhythm guitar) and Mario Duplantier (drums), Christian Andreu (lead guitar), and Jean-Michel Labadie (bass)—has been the same since the band changed its name to Gojira in 2001.",
  //     22,
  //     genres[5]
  //   );
  //   await artistCreate(
  //     6,
  //     "Luke",
  //     "Combs",
  //     false,
  //     "Combs was born in Huntersville, North Carolina, the only child of Rhonda and Chester Combs. As a child he performed in chorus class, multiple school musicals, and joined his church choir, which performed once at Carnegie Hall.",
  //     33,
  //     genres[6]
  //   );
  //   await artistCreate(
  //     7,
  //     false,
  //     false,
  //     "Deftones",
  //     "Deftones is an American alternative metal band formed in Sacramento, California in 1988",
  //     34,
  //     genres[8]
  //   );
  //   await Promise.all([
  //     artistCreate(
  //       8,
  //       "Bad",
  //       "Bunny",
  //       false,
  //       "Bad Bunny, byname of Benito Antonio Martínez Ocasio, (born March 10, 1994, San Juan, Puerto Rico",
  //       29,
  //       genres[7]
  //     ),
  //     artistCreate(
  //       9,
  //       "Daddy",
  //       "Yankee",
  //       false,
  //       "Daddy Yankee was born Ramon Ayala on February 3, 1976, in Villa Kennedy, Santruce, Puerto Rico.",
  //       46,
  //       genres[7]
  //     ),
  //     artistCreate(
  //       10,
  //       false,
  //       false,
  //       "Yaviah",
  //       "Yaviah is a 36-year-old Puerto Rican reggaeton artist, producer and songwriter from Carolina, Puerto Rico.",
  //       36,
  //       genres[7]
  //     ),
  //     artistCreate(
  //       11,
  //       "Nengo",
  //       "Flow",
  //       false,
  //       "Flow Ñengo born on October 15, 1981 in the town of Rio Piedras. ",
  //       41,
  //       genres[7]
  //     ),
  //     artistCreate(
  //       12,
  //       false,
  //       false,
  //       "Sech",
  //       "Carlos Isaías Morales Williams (born December 3, 1993), better known as Sech",
  //       29,
  //       genres[7]
  //     ),
  //     artistCreate(
  //       13,
  //       false,
  //       false,
  //       "Mora",
  //       "Gabriel Mora Quintero was born in Bayamón, Puerto Rico, in 1992.",
  //       27,
  //       genres[7]
  //     ),
  //     artistCreate(
  //       14,
  //       "Myke",
  //       "Towers",
  //       false,
  //       "Michael Anthony Torres Monge (born January 15, 1994), known by his stage name Myke Towers, is a Puerto Rican",
  //       29,
  //       genres[7]
  //     ),
  //   ]);
}

async function createSong() {
  console.log("creating songs");
  //   await Promise.all([
  //     songCreate(0, "BLOOD", 2, artists[0], false, albums[0]),
  //     songCreate(1, "DNA", 3, artists[0], false, albums[0]),
  //     songCreate(2, "YAH", 3, artists[0], false, albums[0]),
  //     songCreate(3, "ELEMENT", 3, artists[0], false, albums[0]),
  //     songCreate(4, "FEEL", 3, artists[0], false, albums[0]),
  //     songCreate(5, "LOYALTY", 4, artists[0], [artists[1]], albums[0]),
  //     songCreate(6, "PRIDE", 4, artists[0], false, albums[0]),
  //     songCreate(7, "HUMBLE", 3, artists[0], false, albums[0]),
  //     songCreate(8, "LUST", 5, artists[0], false, albums[0]),
  //     songCreate(9, "LOVE", 3, artists[0], false, albums[0]),
  //     songCreate(10, "XXX", 4, artists[0], [artists[2]], albums[0]),
  //     songCreate(11, "FEAR", 8, artists[0], false, albums[0]),
  //     songCreate(12, "GOD", 4, artists[0], false, albums[0]),
  //     songCreate(13, "DUCKWORTH", 4, artists[0], false, albums[0]),
  //   ]);
  //   await Promise.all([
  //     songCreate(14, "Adios amor", 3, artists[3], false, albums[1]),
  //     songCreate(15, "Probablemente", 4, artists[3], false, albums[1]),
  //     songCreate(16, "Te voy a olvidar", 3, artists[3], false, albums[1]),
  //     songCreate(17, "Eres", 3, artists[0], false, albums[1]),
  //     songCreate(18, "Me deje llevar", 3, artists[3], false, albums[1]),
  //     songCreate(19, "Te falle", 4, artists[3], false, albums[1]),
  //     songCreate(20, "Vas a querer regresar", 3, artists[3], false, albums[1]),
  //     songCreate(21, "Ojala", 3, artists[3], false, albums[1]),
  //     songCreate(22, "Yo no se manana", 3, artists[3], false, albums[1]),
  //     songCreate(23, "Se me olvidaba", 3, artists[3], false, albums[1]),
  //     songCreate(24, "Es mentira", 3, artists[3], false, albums[1]),
  //     songCreate(25, "Probablemente", 4, artists[3], [artists[4]], albums[1]),
  //     songCreate(26, "La venia bendita", 3, artists[3], false, albums[1]),
  //   ]);
  //   await Promise.all([
  //     songCreate(27, "The Shooting Star", 6, artists[5], false, albums[2]),
  //     songCreate(28, "Silvera", 3, artists[5], false, albums[2]),
  //     songCreate(29, "The Cell", 3, artists[5], false, albums[2]),
  //     songCreate(30, "Stranded", 4, artists[5], false, albums[2]),
  //     songCreate(31, "Yellow Stone", 1, artists[5], false, albums[2]),
  //     songCreate(32, "Magma", 7, artists[5], false, albums[2]),
  //     songCreate(33, "Pray", 5, artists[5], false, albums[2]),
  //     songCreate(34, "Only Pain", 4, artists[5], false, albums[2]),
  //     songCreate(35, "Low Lands", 6, artists[5], false, albums[2]),
  //     songCreate(36, "Liberation", 3, artists[5], false, albums[2]),
  //   ]);
  //   await Promise.all([
  //     songCreate(37, "Out There", 3, artists[6], false, albums[3]),
  //     songCreate(38, "Memories are made of", 3, artists[6], false, albums[3]),
  //     songCreate(39, "Lonely one", 3, artists[6], false, albums[3]),
  //     songCreate(40, "Beer Can", 3, artists[6], false, albums[3]),
  //     songCreate(41, "Hurricane", 4, artists[6], false, albums[3]),
  //     songCreate(42, "One number away", 4, artists[6], false, albums[3]),
  //     songCreate(43, "Dont tempt me", 3, artists[6], false, albums[3]),
  //     songCreate(44, "When it rains it pours", 4, artists[6], false, albums[3]),
  //     songCreate(45, "This one is for you", 4, artists[6], false, albums[3]),
  //     songCreate(
  //       46,
  //       "Be careful what you wish for",
  //       3,
  //       artists[6],
  //       false,
  //       albums[3]
  //     ),
  //     songCreate(47, "I got away with you", 4, artists[6], false, albums[3]),
  //     songCreate(48, "Honky tonk highway", 3, artists[6], false, albums[3]),
  //   ]);
  //   await Promise.all([
  //     songCreate(49, "My Own Summer (Shove it)", 3, artists[7], false, albums[5]),
  //     songCreate(50, "Lhabia", 4, artists[7], false, albums[5]),
  //     songCreate(51, "Mascara", 4, artists[7], false, albums[5]),
  //     songCreate(52, "Around the Fur", 3, artists[7], false, albums[5]),
  //     songCreate(53, "Rickets", 2, artists[7], false, albums[5]),
  //     songCreate(
  //       54,
  //       "Be Quiet and Drive (Far Away)",
  //       5,
  //       artists[7],
  //       false,
  //       albums[5]
  //     ),
  //     songCreate(55, "Lotion", 4, artists[7], false, albums[5]),
  //     songCreate(56, "Dai the Flu", 4, artists[7], false, albums[5]),
  //     songCreate(57, "Headup", 5, artists[7], false, albums[5]),
  //     songCreate(58, "MX", 37, artists[7], false, albums[5]),
  //   ]);
  //   await Promise.all([
  //     songCreate(59, "Si Veo a Tu Mama", 3, artists[8], false, albums[4]),
  //     songCreate(60, "La Dificil", 3, artists[8], false, albums[4]),
  //     songCreate(61, "Pero Ya No", 3, artists[8], false, albums[4]),
  //     songCreate(62, "La Santa", 3, artists[8], [artists[9]], albums[4]),
  //     songCreate(63, "Yo Perreo Sola", 3, artists[8], false, albums[4]),
  //     songCreate(64, "Bichiyal", 3, artists[8], [artists[10]], albums[4]),
  //     songCreate(65, "Solia", 3, artists[8], false, albums[4]),
  //     songCreate(66, "La Zona", 3, artists[8], false, albums[4]),
  //     songCreate(67, "Que Malo", 3, artists[8], [artists[11]], albums[4]),
  //     songCreate(68, "Vete", 3, artists[8], false, albums[4]),
  //     songCreate(69, "Ignorantes", 4, artists[8], [artists[12]], albums[4]),
  //     songCreate(70, "A Tu Merced", 3, artists[8], false, albums[4]),
  //     songCreate(71, "Una Vez", 4, artists[8], [artists[13]], albums[4]),
  //     songCreate(72, "Safaera", 3, artists[8], [artists[11]], albums[4]),
  //     songCreate(73, "25/8", 4, artists[8], false, albums[4]),
  //     songCreate(
  //       74,
  //       "Puesto Pa Guerrial",
  //       3,
  //       artists[8],
  //       [artists[14]],
  //       albums[4]
  //     ),
  //     songCreate(75, "P FKN R", 4, artists[8], false, albums[4]),
  //     songCreate(76, "Hablamos Manana", 4, artists[8], false, albums[4]),
  //     songCreate(77, "<3", 2, artists[8], false, albums[4]),
  //   ]);
}
async function createAlbum() {
  console.log("creating album");
  await albumCreate(
    0,
    artists[0],
    "Singles ( All singles here )",
    "This album consist of many different artist and mant different genres.",
    genres[0],
    25,
    20
  );
  //   await albumCreate(
  //     0,
  //     artists[0],
  //     "DAMN",
  //     "At its core, DAMN. centers around struggle between good and evil.",
  //     genres[0],
  //     26,
  //     10
  //   );
  //   await albumCreate(
  //     1,
  //     artists[3],
  //     "Me Deje Llevar",
  //     "Christian Nodal specializes in románticas that gleam with a decidedly old-school glamour. With its opulent mariachi orchestrations, along with an atmosphere that's equal parts amorous and lovelorn.",
  //     genres[4],
  //     24,
  //     3
  //   );
  //   await albumCreate(
  //     2,
  //     artists[5],
  //     "Magma",
  //     "In honor of their late mother, brothers Joe and Mario Duplantier of French metallurgists Gojira respond to tragedy with some of the most emotional songs of their career.",
  //     genres[5],
  //     20,
  //     10
  //   );
  //   await albumCreate(
  //     3,
  //     artists[6],
  //     "This One is For You",
  //     "Though Luke Combs was only 27 upon the release of this debut album, his deep, burly pipes bear the vocal gravitas of someone with a lot more miles in their rearview mirror.",
  //     genres[6],
  //     23,
  //     11
  //   );
  //   await albumCreate(
  //     4,
  //     artists[8],
  //     "YHLQMDLG",
  //     "YHLQMDLG (acronym for Yo Hago Lo Que Me Da La Gana, Spanish for I Do Whatever I Want is the second solo studio album and third overall by Puerto Rican rapper and singer Bad Bunny.",
  //     genres[7],
  //     25,
  //     13
  //   );

  //   await albumCreate(5, artists[7], "Around the fur", false, genres[8], 13, 26);
}
