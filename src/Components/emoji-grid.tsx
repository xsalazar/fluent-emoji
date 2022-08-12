import React from "react";
import {
  Box,
  Container,
  ImageList,
  ImageListItem,
  Tab,
  Tabs,
} from "@mui/material";
const emojiMetadata: EmojiData = require("./metadata.json");

interface EmojiProps {}

interface EmojiState {
  currentEmoji: Array<string>;
  emojiData: EmojiData;
  emojiCategories: Array<string>;
  selectedTab: number;
}

export default class EmojiGrid extends React.Component<EmojiProps, EmojiState> {
  constructor(props: EmojiProps) {
    super(props);

    const defaultSelectedTab = 0;

    const emojiCategories = Object.keys(emojiMetadata)
      .map((x) => emojiMetadata[x].group)
      .filter((category: string, index: number, self: Array<string>) => {
        return self.indexOf(category) === index;
      });

    const currentEmoji = Object.entries(emojiMetadata)
      .filter(
        ([key, value]) => value.group === emojiCategories[defaultSelectedTab]
      )
      .map((x) => x[0]);

    this.state = {
      currentEmoji: currentEmoji,
      emojiData: emojiMetadata,
      emojiCategories: emojiCategories,
      selectedTab: defaultSelectedTab,
    };

    this.handleSelectedTabChanged = this.handleSelectedTabChanged.bind(this);
  }

  render(): React.ReactNode {
    return (
      <div style={{ height: "calc(100vh - 200px)" }}>
        <Container maxWidth="sm">
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={this.state.selectedTab}
              onChange={this.handleSelectedTabChanged}
              variant="scrollable"
              textColor="secondary"
              indicatorColor="secondary"
              scrollButtons
              allowScrollButtonsMobile
            >
              {this.state.emojiCategories.map((category: string) => {
                return <Tab label={category} key={category}></Tab>;
              })}
            </Tabs>
          </Box>

          {/* Emoji List */}
          <Box
            sx={{
              mx: 3,
              height: "calc(100vh - 250px)",
              overflowY: "auto",
              justifyItems: "center",
            }}
          >
            <ImageList cols={8} gap={4}>
              {this.state.currentEmoji.map((item) => {
                var entry = this.state.emojiData[item];

                var imageName = item.replaceAll(" ", "_").toLowerCase();
                if (
                  entry.group === "People & Body" &&
                  entry.unicodeSkintones &&
                  entry.unicodeSkintones.length > 0
                ) {
                  var imageSrc = `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/${item}/Default/3D/${imageName}_3d_default.png`;
                } else {
                  var imageSrc = `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/${item}/3D/${imageName}_3d.png`;
                }

                return (
                  <ImageListItem key={imageName}>
                    <img
                      src={`${imageSrc}`}
                      srcSet={`${imageSrc}`}
                      alt={imageName}
                      loading="lazy"
                    />
                  </ImageListItem>
                );
              })}
            </ImageList>
          </Box>
        </Container>
      </div>
    );
  }

  handleSelectedTabChanged(event: React.SyntheticEvent, selectedTab: number) {
    const currentEmoji = Object.entries(emojiMetadata)
      .filter(
        ([key, value]) =>
          value.group === this.state.emojiCategories[selectedTab]
      )
      .map((x) => x[0]);

    this.setState({
      currentEmoji,
      selectedTab,
    });
  }
}

interface EmojiData {
  [emojiName: string]: FluentEmoji;
}

interface FluentEmoji {
  cldr: string;
  fromVersion: string;
  glyph: string;
  glyphAsUtfInEmoticons?: string[];
  group: string;
  keywords: string[];
  mappedToEmoticons?: string[];
  sortOrder: number;
  tts: string;
  unicode: string;
  unicodeSkintones?: string[];
}
