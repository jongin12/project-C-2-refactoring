import key from "./module/RiotApiKey.js";
import fetch from "node-fetch";

const LOL_API = {
  summoners: (name) => {
    let url = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${key}`;
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => resolve(data));
    });
  },
  summonersLeague: (id) => {
    let url = `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${key}`;
    return new Promise((resolve, reject) => {
      let league = {};
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (!data.status) {
            data.forEach(function (value) {
              if (value.queueType === "RANKED_SOLO_5x5") {
                league.solo = value;
              } else if (value.queueType === "RANKED_FLEX_SR") {
                league.flex = value;
              }
            });
          }
          if (!league.solo) {
            league.solo = {
              queueType: "RANKED_SOLO_5x5",
              tier: "UNRANK",
              rank: "",
              leaguePoints: "",
              wins: 0,
              losses: 0,
            };
          }
          if (!league.flex) {
            league.flex = {
              queueType: "RANKED_FLEX_5x5",
              tier: "UNRANK",
              rank: "",
              leaguePoints: "",
              wins: 0,
              losses: 0,
            };
          }
        })
        .then(() => resolve(league));
    });
  },
  matchList: (puuid) => {
    let url = `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10&api_key=${key}`;
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => resolve(data));
    });
  },
  matchInfo: (matchid) => {
    let url = `https://asia.api.riotgames.com/lol/match/v5/matches/${matchid}?api_key=${key}`;
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => resolve(data));
    });
  },
  activeGame: (id) => {
    let url = `https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${id}?api_key=${key}`;
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => resolve(data));
    });
  },
};

export default LOL_API;
