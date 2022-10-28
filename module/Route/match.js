import API from "../../LOL_API.js";
import fs from "fs";
import ejs from "ejs";

let matchPage = async function (matchId, res) {
  let list = {};
  list.match = await API.matchInfo(matchId);
  if (list.match.status) {
    if (list.match.status.status_code === 403) {
      res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
      res.end("Riot Key error");
    } else if (list.match.status.status_code === 404) {
      res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
      res.end("없는 match ID입니다");
    }
  } else {
    fs.readFile("html/match.ejs", "utf8", function (err, data) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        ejs.render(data, {
          match: list.match,
        })
      );
    });
  }
};

export default matchPage;
