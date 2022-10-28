import champion from "./champion.js";
import runeJson from "./rune.js";
import queueId from "./queueId.js";
import spell from "./spell.js";

const calc = {
  stringCheck: (string1, string2) => {
    let small_1 = string1.toLowerCase();
    let noSpace_1 = small_1.split(" ").join("");
    let small_2 = string2.toLowerCase();
    let noSpace_2 = small_2.split(" ").join("");
    return noSpace_1 === noSpace_2;
  }, // 문자열 2개 대소문자, 공백 제외 같은 값인지 체크 후 bool 반환
  runeFind: (number) => {
    for (let i = 0; i < runeJson.length; i++) {
      if (number === runeJson[i].id) {
        let value = {
          id: runeJson[i].id,
          name: runeJson[i].name,
          icon:
            "https://ddragon.leagueoflegends.com/cdn/img/" + runeJson[i].icon,
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
  }, // 룬 번호(id) 입력시 그 번호의 id, name, icon 객체 반환
  queueId: (id) => {
    let queueId_KR = queueId[id];
    return queueId_KR;
  }, // 게임 모드 id 입력시 한글이름 반환
  multiKill: (number) => {
    if (number === 5) {
      return "펜타킬";
    } else if (number === 4) {
      return "쿼드라킬";
    } else if (number === 3) {
      return "트리플킬";
    } else if (number === 2) {
      return "더블킬";
    } else if (number <= 1) {
      return "";
    }
  }, // 멀티킬 number 입력시 text로 반환
};

export default calc;
