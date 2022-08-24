import * as fs from "fs";
import * as path from "path";
// @ts-expect-error
import svgstore from "svgstore";

const sprites = svgstore();

fs.readdirSync("./sprites").forEach(function (file) {
  if (file.endsWith(".svg")) {
    sprites.add(
      file.replace(".svg", ""),
      fs.readFileSync(path.join("sprites", file), "utf8")
    );
  }
  console.log(file);
});

fs.writeFileSync("app/sprites.svg", sprites);
