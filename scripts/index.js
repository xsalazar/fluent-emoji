const fs = require("fs");
const emojiDatasource = require("emoji-datasource/emoji_pretty.json");

var output = {};
const basePath = "fluentui-emoji/assets/";
fs.readdirSync(basePath).forEach((folder) => {
  const contents = JSON.parse(
    fs.readFileSync(`${basePath}/${folder}/metadata.json`, "utf8")
  );

  const sortOrder = emojiDatasource.find(
    (x) => x.unified === contents.unicode.replaceAll(" ", "-").toUpperCase()
  ).sort_order;

  const entry = { [folder]: { ...contents, sortOrder: sortOrder } };
  Object.assign(output, entry);
});

const ret = Object.fromEntries(
  Object.entries(output).sort((a, b) =>
    a[1].sortOrder > b[1].sortOrder ? 1 : -1
  )
);

fs.writeFileSync("output.json", JSON.stringify(ret));
