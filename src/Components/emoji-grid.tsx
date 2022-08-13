import React from "react";
import { Box, Container, ImageList, Tab, Tabs } from "@mui/material";
import Emoji from "./emoji";
const emojiMetadata: EmojiMetadata = require("./metadata.json");

interface EmojiGridProps {}

interface EmojiGridState {
  currentEmoji: Array<string>;
  emojiMetadata: EmojiMetadata;
  emojiCategories: Array<string>;
  selectedTab: number;
}

export default class EmojiGrid extends React.Component<
  EmojiGridProps,
  EmojiGridState
> {
  constructor(props: EmojiGridProps) {
    super(props);

    const defaultSelectedTab = 0;

    // Find and unique all possible emoji categories
    const emojiCategories = Object.values(emojiMetadata)
      .map((x) => x.group)
      .filter((category: string, index: number, self: Array<string>) => {
        return self.indexOf(category) === index;
      });

    // Filter the currently shown emoji to the default tabs (Smileys & Emotion)
    const currentEmoji = Object.entries(emojiMetadata)
      .filter(
        ([key, value]) => value.group === emojiCategories[defaultSelectedTab]
      )
      .map((x) => x[0]);

    this.state = {
      currentEmoji: currentEmoji,
      emojiMetadata: emojiMetadata,
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
            <ImageList cols={8} gap={1}>
              {this.state.currentEmoji.map((emojiName) => {
                return <Emoji name={emojiName} key={emojiName} />;
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

export interface EmojiMetadata {
  [emojiName: string]: FluentEmoji;
}

export interface FluentEmoji {
  cldr: string;
  fromVersion: string;
  glyph: string;
  glyphAsUtfInEmoticons?: string[];
  group: string;
  isSkintoneBased: boolean;
  styles?: FluentEmojiStyles;
  skintones?: FluentEmojiSkintones;
  keywords: string[];
  mappedToEmoticons?: string[];
  sortOrder: number;
  tts: string;
  unicode: string;
  unicodeSkintones?: string[];
}

export interface FluentEmojiStyles {
  [style: string]: string;
}

export interface FluentEmojiSkintones {
  [skintone: string]: FluentEmojiStyles;
}
