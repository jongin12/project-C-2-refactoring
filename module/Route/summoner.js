import API from "../../LOL_API.js";
import fs from "fs";
import ejs from "ejs";

let summonerPage = async function (name, res) {
  let list = {};
  list.summoner = await API.summoners(name);
  if (list.summoner.status) {
    if (list.summoner.status.status_code === 403) {
      res.end("Riot Key error");
    } else if (list.summoner.status.status_code === 404) {
      res.end("없는 소환사명입니다");
    }
  } else {
    list.league = await API.summonersLeague(list.summoner.id);
    list.matchList = await API.matchList(list.summoner.puuid);
    for (let i = 0; i < list.matchList.length; i++) {
      list.matchData[i] = await API.matchInfo(list.matchList[i]);
    }
    fs.readFile("html/summoner.ejs", "utf8", function (err, data) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        ejs.render(data, {
          summoner: list.summoner,
          league: list.league,
          matchList: list.matchList,
          matchData: list.matchData,
        })
      );
    });
  }
};

export default summonerPage;
