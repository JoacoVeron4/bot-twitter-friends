const config = require("./config.js");
const Twit = require("twit");

const T = new Twit(config);

const stream = T.stream("statuses/filter", { track: "#FriendsRandomEpisode" });
const jsonfile = require("jsonfile");

stream.on("tweet", response);

function response(tweet) {
  const id = tweet.id_str;
  const name = tweet.user.screen_name;
  const episode = randomEpisode();
  const replyText = `@${name} Gracias por usarme! Ahora te toca viciar ${episode.title}. Es el numero ${episode.episode_in_season} de la temporada ${episode.season}. Disfrutalo!`;

  T.post(
    "statuses/update",
    { status: replyText, in_reply_to_status_id: id },
    gameOver
  );

  function gameOver(err, reply) {
    if (err) {
      console.log(err.message);
      console.log("Game Over");
    } else {
      console.log("Tweeted: " + reply.text);
    }
  }
}

function randomEpisode() {
  const database = jsonfile.readFileSync("episodes.json");
  const randomNumber = Math.floor(Math.random() * 236);
  const episode = database[randomNumber - 1];
  return {
    episode_number: episode.episode_number,
    season: episode.season,
    episode_in_season: episode.episode_in_season,
    title: episode.title,
  };
}
