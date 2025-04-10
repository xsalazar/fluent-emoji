import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { DownloadIcon } from "@primer/octicons-react";
import axios from "axios";
import { useState } from "react";
import emojiMetadata from "./metadata.json";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
};

enum Skintones {
  Default = "Default",
  Light = "Light",
  MediumLight = "MediumLight",
  Medium = "Medium",
  MediumDark = "MediumDark",
  Dark = "Dark",
}

const SortedSkintones = [
  "Default",
  "Light",
  "MediumLight",
  "Medium",
  "MediumDark",
  "Dark",
];

enum Styles {
  "3D" = "3D",
  Color = "Color",
  Flat = "Flat",
  HighContrast = "HighContrast",
}

export default function Emoji({ name }: { name: string }) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    selectedSkintone: Skintones;
    selectedStyle: Styles;
  }>({
    isOpen: false,
    selectedSkintone: Skintones.Default,
    selectedStyle: Styles["3D"],
  });

  const emoji = emojiMetadata[name as keyof typeof emojiMetadata] as {
    cldr: string;
    fromVersion: string;
    glyph: string;
    glyphAsUtfInEmoticons: string[];
    group: string;
    keywords: string[];
    mappedToEmoticons: string[];
    tts: string;
    unicode: string;
    sortOrder: number;
    isSkintoneBased: boolean;
    skintones?: { [key in Skintones]: { [key in Styles]: string } };
    styles: { [key in Styles]: string };
  };

  var emojiImageUrl: string;
  var modalEmojiImageUrl: string;
  var possibleEmojiStyles: Array<Styles>;
  if (emoji.isSkintoneBased && emoji.skintones!) {
    // The base page emoji will always show 3D with Default skintone
    emojiImageUrl = emoji.skintones[Skintones.Default][Styles["3D"]];

    // The modal can change based on the selected skintone within the modal
    modalEmojiImageUrl =
      emoji.skintones[modalState.selectedSkintone][modalState.selectedStyle];

    // Gather all the supported Styles for the selected modal skintone
    possibleEmojiStyles = Object.keys(
      emoji.skintones[modalState.selectedSkintone]
    ).map((style) => Styles[style as keyof typeof Styles]);
  } else {
    // The base page emoji will always show 3D with Default skintone
    emojiImageUrl = emoji.styles![Styles["3D"]];
    modalEmojiImageUrl = emoji.styles![modalState.selectedStyle];
    possibleEmojiStyles = Object.keys(emoji.styles!).map(
      (style) => Styles[style as keyof typeof Styles]
    );
  }

  const openModal = () => {
    setModalState({ ...modalState, isOpen: true });
  };

  // Reset modal state when closing
  const closeModal = () => {
    setModalState({
      ...modalState,
      isOpen: false,
      selectedSkintone: Skintones.Default,
      selectedStyle: Styles["3D"],
    });
  };

  const handleVariationClick = (skintone: string) => {
    setModalState({
      ...modalState,
      selectedSkintone: Skintones[skintone as keyof typeof Skintones],
    });
  };

  const handleStyleChanged = (event: SelectChangeEvent<string>) => {
    setModalState({
      ...modalState,
      selectedStyle: Styles[event.target.value as keyof typeof Styles],
    });
  };

  const handleDownloadClick = async () => {
    var downloadUrl: string;
    if (emoji.isSkintoneBased && emoji.skintones) {
      downloadUrl =
        emoji.skintones![modalState.selectedSkintone][modalState.selectedStyle];
    } else {
      downloadUrl = emoji.styles![modalState.selectedStyle];
    }

    const downloadFilename = downloadUrl.split("/").pop()!;

    var response = await axios.get(downloadUrl, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", downloadFilename);
    document.body.appendChild(link);
    link.click();
  };

  const getRandomBackgroundColor = (): string => {
    var partyColors = [
      "#FF6B6B",
      "#FF6BB5",
      "#FF81FF",
      "#D081FF",
      "#81ACFF",
      "#81FFFF",
      "#81FF81",
      "#FFD081",
      "#FF8181",
    ];
    return partyColors[Math.floor(Math.random() * partyColors.length)];
  };

  return (
    <div>
      {/* Base Page Image */}
      <ImageListItem
        onClick={openModal}
        key={emoji.cldr}
        sx={{
          borderRadius: 2,
          padding: 0.25,
          "&:hover": {
            backgroundColor: () => getRandomBackgroundColor(),
          },
        }}
      >
        <img
          loading="lazy"
          width="32px"
          height="32px"
          src={emojiImageUrl}
          alt={emoji.cldr}
        />
      </ImageListItem>

      {/* Modal */}
      <Modal open={modalState.isOpen} onClose={closeModal}>
        <Box sx={modalStyle}>
          <Grid container>
            {/* Close Icon */}
            <Grid container size={12} sx={{ pb: 1 }}>
              <Grid size={10} sx={{ pl: 1 }} alignSelf="center">
                <Typography>{name}</Typography>
              </Grid>
              <Grid
                container
                size={2}
                justifyContent="flex-end"
                alignSelf="center"
              >
                <IconButton onClick={closeModal}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>

            {/* Modal Image */}
            <Grid
              container
              size={12}
              sx={{ p: 1, pb: 2, display: "flex", justifyContent: "center" }}
            >
              <img
                style={{ width: "100%" }}
                src={modalEmojiImageUrl}
                alt={emoji.cldr}
              />
            </Grid>

            {/* Skintone Variations */}
            {emoji.isSkintoneBased && emoji.skintones ? (
              <Grid size={12}>
                <ImageList cols={6}>
                  {Object.entries(emoji.skintones)
                    .sort((a, b) => {
                      return (
                        SortedSkintones.indexOf(a[0]) -
                        SortedSkintones.indexOf(b[0])
                      );
                    })
                    .map(([skintone, style]) => {
                      return (
                        <ImageListItem
                          onClick={(_) => handleVariationClick(skintone)}
                          key={`${emoji.cldr}_${skintone}`}
                          sx={{
                            textAlign: "center",
                            borderRadius: 2,
                            padding: 0.5,
                            backgroundColor: (theme) =>
                              Skintones[skintone as keyof typeof Skintones] ===
                              modalState.selectedSkintone
                                ? theme.palette.action.selected
                                : "",
                            "&:hover": {
                              backgroundColor: (theme) =>
                                theme.palette.action.hover,
                            },
                          }}
                        >
                          <img
                            loading="lazy"
                            src={style[modalState.selectedStyle]}
                            alt={emoji.cldr}
                          />
                        </ImageListItem>
                      );
                    })}
                </ImageList>
              </Grid>
            ) : (
              <div></div>
            )}

            {/* Download Options */}
            <Grid container size={12} justifyContent="center">
              {/* Emoji Style */}
              <Grid size={6} sx={{ pr: 1 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>style</InputLabel>
                  <Select
                    label="format"
                    value={modalState.selectedStyle}
                    onChange={handleStyleChanged}
                  >
                    {possibleEmojiStyles.map((style) => {
                      return (
                        <MenuItem value={style} key={style}>
                          {style}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>

              {/* Download Button */}
              <Grid size={6} sx={{ pr: 1 }}>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={handleDownloadClick}
                  endIcon={<DownloadIcon />}
                >
                  Download
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
