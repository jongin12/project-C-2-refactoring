import http from "http";
import fs from "fs";
import path from "path";
import summonerPage from "./module/Route/summoner.js";
import matchPage from "./module/Route/match.js";
import activePage from "./module/Route/active.js";

const __dirname = path.resolve();

const server = http.createServer((req, res) => {
  const main = fs.readFileSync("./html/index.html", (err) => {
    if (err) throw err;
  });

  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset= utf-8" });
    res.end(main);
  } // main page
  else if (req.url.startsWith("/summoner/")) {
    const name = req.url.split("/")[2];
    summonerPage(name, res);
  } // user page
  else if (req.url.startsWith("/match/")) {
    const matchId = req.url.split("/")[2];
    matchPage(matchId, res);
  } // match page
  else if (req.url.startsWith("/active/")) {
    const name = req.url.split("/")[2];
    activePage(name, res);
  } // activegame page
  else if (req.url.endsWith(".css")) {
    let cssPath = path.join(__dirname, "html", req.url);
    let fileStream = fs.createReadStream(cssPath, "utf-8");
    res.writeHead(200, { "Content-Type": "text/css" });
    fileStream.pipe(res);
  } // css file
  else if (req.url.endsWith(".png")) {
    let imagePath = path.join(__dirname, "html", req.url);
    let fileStream = fs.createReadStream(imagePath);
    res.writeHead(200, { "Content-Type": "image/png" });
    fileStream.pipe(res);
  } // png file
  else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("404 Not Found");
  } // 404 err page
});

server.listen(5050, () => {
  console.log("server start..");
});
