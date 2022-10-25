import http from "http";
import fs from "fs";
import summonerPage from "./module/Route/summoner.js";
// ejs.render(경로, 데이터, 옵션);

const server = http.createServer((req, res) => {
  const main = fs.readFileSync("./html/index.html", (err) => {
    if (err) throw err;
  });

  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset= utf-8" });
    res.end(main);
  }

  if (req.url.startsWith("/summoner/")) {
    const name = req.url.split("/")[2];
    summonerPage(name, res);
  }
});

server.listen(5050, () => {
  console.log("server start..");
});
