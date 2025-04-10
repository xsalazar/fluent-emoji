import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { imageListItemClasses } from "@mui/material/ImageListItem";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";
import Emoji from "./emoji";
import emojiMetadata from "./metadata.json";

export default function EmojiGrid() {
  const defaultSelectedTab = 0;

  // Find and unique all possible emoji categories
  const emojiCategories = Object.values(emojiMetadata)
    .map((x) => x.group)
    .filter((category: string, index: number, self: Array<string>) => {
      return self.indexOf(category) === index;
    });

  // Filter the currently shown emoji to the default tabs (Smileys & Emotion)
  const defaultCurrentEmoji = Object.entries(emojiMetadata)
    .filter(
      ([key, value]) => value.group === emojiCategories[defaultSelectedTab]
    )
    .map((x) => x[0]);

  const [currentEmoji, setCurrentEmoji] = useState(defaultCurrentEmoji);
  const [selectedTab, setSelectedTab] = useState(defaultSelectedTab);

  const handleSelectedTabChanged = (
    _: React.SyntheticEvent,
    selectedTab: number
  ) => {
    const currentEmoji = Object.entries(emojiMetadata)
      .filter(([key, value]) => value.group === emojiCategories[selectedTab])
      .map((x) => x[0]);

    setCurrentEmoji(currentEmoji);
    setSelectedTab(selectedTab);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selectedTab}
          onChange={handleSelectedTabChanged}
          variant="scrollable"
          textColor="secondary"
          indicatorColor="secondary"
          scrollButtons
          allowScrollButtonsMobile
        >
          {emojiCategories.map((category: string) => {
            return <Tab label={category} key={category}></Tab>;
          })}
        </Tabs>
      </Box>

      {/* Emoji List */}
      <Box
        sx={{
          mx: 3,
          justifyItems: "center",
          flexGrow: "1",
          overflowY: "scroll",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(4, 1fr)",
              sm: "repeat(5, 1fr)",
              md: "repeat(7, 1fr)",
              lg: "repeat(7, 1fr)",
              xl: "repeat(8, 1fr)",
            },
            [`& .${imageListItemClasses.root}`]: {
              display: "flex",
            },
          }}
        >
          {currentEmoji.map((emojiName) => {
            return <Emoji name={emojiName} />;
          })}
        </Box>
      </Box>
    </Container>
  );
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
