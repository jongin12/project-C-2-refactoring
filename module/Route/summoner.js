import fs from "fs";
import ejs from "ejs";
import API from "../../LOL_API.js";
import queueId from "../queueId.js";
import runeJson from "../rune.js";
import spell from "../spell.js";

const stringCheck = (string1, string2) => {
  let small_1 = string1.toLowerCase();
  let noSpace_1 = small_1.split(" ").join("");
  let small_2 = string2.toLowerCase();
  let noSpace_2 = small_2.split(" ").join("");
  return noSpace_1 === noSpace_2;
};

const runeFind = (number) => {
  for (let i = 0; i < runeJson.length; i++) {
    if (number === runeJson[i].id) {
      let value = {
        id: runeJson[i].id,
        name: runeJson[i].name,
        icon: "https://ddragon.leagueoflegends.com/cdn/img/" + runeJson[i].icon,
      };
      return value;
    }
    for (let j = 0; j < runeJson[i].slots.length; j++) {
      for (let k = 0; k < runeJson[i].slots[j].runes.length; k++) {
        let arr = runeJson[i].slots[j].runes[k];
        if (number === arr.id) {
          let value = {
            id: arr.id,
            name: arr.name,
            icon: "https://ddragon.leagueoflegends.com/cdn/img/" + arr.icon,
          };
          return value;
        }
      }
    }
  }
};

let summonerPage = async function (name, res) {
  let list = { matchData: [] };
  list.summoner = await API.summoners(name);
  if (list.summoner.status) {
    if (list.summoner.status.status_code === 403) {
      res.end("Riot Key error");
    } else if (list.summoner.status.status_code === 404) {
      res.end("없는 소환사명입니다");
    }
  } else {
    list.activeGame = await API.activeGame(list.summoner.id);
    list.league = await API.summonersLeague(list.summoner.id);
    list.matchList = await API.matchList(list.summoner.puuid);
    for (let i = 0; i < list.matchList.length; i++) {
      list.matchData[i] = await API.matchInfo(list.matchList[i]);
      for (let j = 0; j < 10; j++) {
        let summonerName = list.matchData[i].info.participants[j].summonerName;
        if (stringCheck(summonerName, list.summoner.name)) {
          list.matchData[i].myNum = j;
        }
      }
      let myNum = list.matchData[i].myNum;
      let myData = list.matchData[i].info.participants[myNum];
      //내 번호 찾기

      let now = new Date();
      let endtime = list.matchData[i].info.gameEndTimestamp;
      let value = now - endtime;
      let hour = value / 1000 / 60 / 60;
      let time = "";
      if (hour >= 24) {
        time = Math.floor(hour / 24);
        time = time + "일 전";
      } else if (24 > hour && hour >= 1) {
        time = Math.floor(hour);
        time = time + "시간 전";
      } else if (1 > hour) {
        time = Math.floor(hour * 60);
        time = time + "분 전";
      }
      list.matchData[i].myTime = time;
      // 몇시간전 경기인지 ~

      let playtime = list.matchData[i].info.gameDuration;
      let min = Math.floor(playtime / 60);
      let sec = playtime % 60;
      list.matchData[i].myGameDuration = `${min}분 ${sec}초`;
      // 플레이시간

      let queueNum = list.matchData[i].info.queueId;
      let queueId_KR = queueId[queueNum];
      list.matchData[i].queueId_KR = queueId_KR;
      // 게임 모드

      if (myData.deaths === 0) {
        list.matchData[i].kdaText = "perfect";
      } else {
        let kda = (myData.kills + myData.assists) / myData.deaths;
        list.matchData[i].kdaText = kda.toFixed(2);
      }
      // KDA

      let runeNum = myData.perks.styles[0].selections[0].perk;
      let rune_KR = runeFind(runeNum);
      list.matchData[i].rune_KR = rune_KR;
      // 메인 룬

      let multikill = myData.largestMultiKill;
      if (multikill === 5) {
        list.matchData[i].multikillText = "펜타킬";
      } else if (multikill === 4) {
        list.matchData[i].multikillText = "쿼드라킬";
      } else if (multikill === 3) {
        list.matchData[i].multikillText = "트리플킬";
      } else if (multikill === 2) {
        list.matchData[i].multikillText = "더블킬";
      } else if (multikill <= 1) {
        list.matchData[i].multikillText = "";
      }
      // 멀티킬

      list.matchData[i].spell_1 = spell[myData.summoner1Id];
      list.matchData[i].spell_2 = spell[myData.summoner2Id];
      // 스펠

      list.matchData[i].item_arr = [
        myData.item0,
        myData.item1,
        myData.item2,
        myData.item3,
        myData.item4,
        myData.item5,
        myData.item6,
      ];
      // 아이템

      list.matchData[i].totalDamage = myData.totalDamageDealtToChampions;
      list.matchData[i].Damage_min =
        (myData.totalDamageDealtToChampions / playtime) * 60;
      list.matchData[i].totalGold = myData.goldEarned;
      list.matchData[i].totalMinion = myData.totalMinionsKilled;
      list.matchData[i].Minion_min =
        (myData.totalMinionsKilled / playtime) * 60;
      // 딜량, cs, gold

      let teamDamage = 0;
      if (myNum < 5) {
        for (let j = 0; j < 5; j++) {
          teamDamage +=
            list.matchData[i].info.participants[j].totalDamageDealtToChampions;
        }
        let dmg = myData.totalDamageDealtToChampions / teamDamage;
        list.matchData[i].teamDamage = (dmg * 100).toFixed(1);
      } else if (myNum > 4) {
        for (let j = 5; j < 10; j++) {
          teamDamage +=
            list.matchData[i].info.participants[j].totalDamageDealtToChampions;
        }
        let dmg = myData.totalDamageDealtToChampions / teamDamage;
        list.matchData[i].teamDamage = (dmg * 100).toFixed(1);
      }
      // 팀의 딜량 지분
    }

    // const json = JSON.stringify(list);
    // res.writeHead(200, { "Content-Type": "charset=utf-8" });
    // res.end(json);

    fs.readFile("html/summoner.ejs", "utf8", function (err, data) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        ejs.render(data, {
          summoner: list.summoner,
          league: list.league,
          matchList: list.matchList,
          matchData: list.matchData,
          activeGame: list.activeGame,
        })
      );
    });
  }
};

export default summonerPage;
