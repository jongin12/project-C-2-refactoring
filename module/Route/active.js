import API from "../../LOL_API.js";
import fs from "fs";
import ejs from "ejs";

let activePage = async function (name, res) {
  let list = { userInfo: [] };
  list.summoner = await API.summoners(name);
  if (list.summoner.status) {
    if (list.summoner.status.status_code === 403) {
      res.end("Riot Key error");
    } else if (list.summoner.status.status_code === 404) {
      res.end("없는 소환사명입니다");
    }
  } else {
    list.activeGame = await API.activeGame(list.summoner.id);
    if (list.activeGame.status) {
      res.end("진행중인 게임이 없습니다.");
    } else {
      for (let i = 0; i < 10; i++) {
        let userId = list.activeGame.participants[i].summonerId;
        list.userInfo[i] = await API.summonersLeague(userId);
      }
      fs.readFile("html/active.ejs", "utf8", function (err, data) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          ejs.render(data, {
            summoner: list.summoner,
            activeGame: list.activeGame,
            userInfo: list.userInfo,
          })
        );
      });
    }
  }
};

export default activePage;
