const fs = require("fs");
const emojiDatasource = require("emoji-datasource/emoji_pretty.json");

var output = {};
const basePath = "fluentui-emoji/assets/";

const skintoneBasedDir = [
  "Dark",
  "Default",
  "Light",
  "Medium",
  "Medium-Dark",
  "Medium-Light",
];

// Iterate over every top-level emoji folder from the repository
fs.readdirSync(basePath).forEach((folder) => {
  // Will be used to build out the data for each emoji from the repository
  var emojiEntry = {};

  // Load the top-level metadata file from the repository
  const repoMetadata = JSON.parse(
    fs.readFileSync(`${basePath}/${folder}/metadata.json`, "utf8")
  );
  emojiEntry = { ...emojiEntry, ...repoMetadata };

  // Find the proper sort order for this emoji
  const sortOrder = emojiDatasource.find(
    (x) => x.unified === repoMetadata.unicode.replaceAll(" ", "-").toUpperCase()
  ).sort_order;
  emojiEntry = { ...emojiEntry, sortOrder: sortOrder };

  // Analyze what sort of folders we have, either skintone-based or not
  const subfolders = fs
    .readdirSync(`${basePath}/${folder}`, {
      withFileTypes: true,
    })
    .filter((x) => x.isDirectory())
    .map((x) => x.name);

  if (JSON.stringify(subfolders) === JSON.stringify(skintoneBasedDir)) {
    emojiEntry = { ...emojiEntry, isSkintoneBased: true };
    var skintones = {};
    // Iterate over each skintone subdirectory
    subfolders.forEach((skintoneDir) => {
      var styleDirs = fs.readdirSync(`${basePath}/${folder}/${skintoneDir}`);
      var styles = {};

      // Iterate over each style subdirectory
      styleDirs.forEach((styleDir) => {
        // Add entry from style -> URL
        styles[styleDir.replace(" ", "")] = fs
          .readdirSync(`${basePath}/${folder}/${skintoneDir}/${styleDir}`)
          .map(
            (fileName) =>
              `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/${folder}/${skintoneDir}/${styleDir}/${fileName}`
          )[0];
      });

      // Add entry from skintone -> styles
      skintones = { ...skintones, [skintoneDir.replaceAll("-", "")]: styles };
    });

    // Pad non-Default skintones with HighContrast options (they're all identical, but it makes the UI nicer to assume they're not)
    Object.keys(skintones).forEach((skintone) => {
      if (skintone !== "Default") {
        skintones[skintone]["HighContrast"] =
          skintones["Default"]["HighContrast"];
      }
    });

    // Add entry for supported skintones
    emojiEntry = { ...emojiEntry, skintones: skintones };
  } else {
    emojiEntry = { ...emojiEntry, isSkintoneBased: false };

    // Iterate over each style subdirectory
    var styles = {};
    subfolders.forEach((styleDir) => {
      styles[styleDir.replace(" ", "")] = fs
        .readdirSync(`${basePath}/${folder}/${styleDir}`)
        .map(
          (fileName) =>
            `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/${folder}/${styleDir}/${fileName}`
        )[0];
    });

    // Add entry for supported styles
    emojiEntry = { ...emojiEntry, styles: styles };
  }

  output[folder] = emojiEntry;
});

const ret = Object.fromEntries(
  Object.entries(output).sort((a, b) =>
    a[1].sortOrder > b[1].sortOrder ? 1 : -1
  )
);

fs.writeFileSync("metadata.json", JSON.stringify(ret));
