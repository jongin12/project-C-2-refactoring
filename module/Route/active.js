import API from "../../LOL_API.js";
import fs from "fs";
import ejs from "ejs";
import spell from "../spell.js";
import calc from "../calculator.js";

let activePage = async function (name, res) {
  let list = { userInfo: [], league: [] };
  list.summoner = await API.summoners(name);
  if (list.summoner.status) {
    if (list.summoner.status.status_code === 403) {
      res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
      res.end("Riot Key error");
    } else if (list.summoner.status.status_code === 404) {
      res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
      res.end("없는 소환사명입니다");
    }
  } else {
    list.activeGame = await API.activeGame(list.summoner.id);
    if (list.activeGame.status) {
      res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
      res.end("진행중인 게임이 없습니다.");
    } else {
      for (let i = 0; i < 10; i++) {
        let userId = list.activeGame.participants[i].summonerId;
        list.league[i] = await API.summonersLeague(userId);
      }

      list.activeGame.queueId_KR = calc.queueId(
        list.activeGame.gameQueueConfigId
      ); //게임 모드

      for (let i = 0; i < 10; i++) {
        let myLeague = list.league[i].solo;
        let win_lose =
          (myLeague.wins / (myLeague.wins + myLeague.losses)) * 100;
        let text = `${myLeague.wins}승 ${myLeague.losses}패`;
        if (myLeague.tier !== "UNRANK") {
          text += ` (${win_lose.toFixed(1)}%)`;
        }
        list.league[i].win_text = text;
      } //승률 text

      for (let i = 0; i < 10; i++) {
        let user = list.activeGame.participants[i];

        //챔피언 img

        user.main_rune = calc.runeFind(user.perks.perkIds[0]);
        user.sub_rune = calc.runeFind(user.perks.perkSubStyle);
        //룬 img

        user.spell1_KR = spell[user.spell1Id];
        user.spell2_KR = spell[user.spell2Id];
        //스펠 img
      }

      fs.readFile("html/active.ejs", "utf8", function (err, data) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          ejs.render(data, {
            summoner: list.summoner,
            activeGame: list.activeGame,
            league: list.league,
          })
        );
      });
    }
  }
};

export default activePage;
