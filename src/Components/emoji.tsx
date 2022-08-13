import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import React from "react";
import { EmojiMetadata } from "./emoji-grid";
import CloseIcon from "@mui/icons-material/Close";
import { DownloadIcon } from "@primer/octicons-react";
import axios from "axios";
const emojiMetadata: EmojiMetadata = require("./metadata.json");

interface EmojiProps {
  name: string;
}

interface EmojiState {
  emojiMetadata: EmojiMetadata;
  modalState: {
    isOpen: boolean;
    selectedSkintone: Skintones;
    selectedStyle: Styles;
  };
}

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

export default class Emoji extends React.Component<EmojiProps, EmojiState> {
  constructor(props: EmojiProps) {
    super(props);

    this.state = {
      emojiMetadata: emojiMetadata,
      modalState: {
        isOpen: false,
        selectedSkintone: Skintones.Default,
        selectedStyle: Styles["3D"],
      },
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleVariationClick = this.handleVariationClick.bind(this);
    this.handleStyleChanged = this.handleStyleChanged.bind(this);
    this.handleDownloadClick = this.handleDownloadClick.bind(this);
  }

  render() {
    const { name: emojiName } = this.props;
    const { emojiMetadata, modalState } = this.state;
    const emoji = emojiMetadata[emojiName];

    var emojiImageUrl: string;
    var modalEmojiImageUrl: string;
    var possibleEmojiStyles: Array<Styles>;
    if (emoji.isSkintoneBased && emoji.skintones) {
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

    return (
      <div>
        {/* Base Page Image */}
        <ImageListItem
          onClick={this.openModal}
          key={emoji.cldr}
          sx={{
            borderRadius: 2,
            padding: 0.25,
            "&:hover": {
              backgroundColor: () => this.getRandomBackgroundColor(),
            },
          }}
        >
          <img
            width="32px"
            height="32px"
            src={emojiImageUrl}
            alt={emoji.cldr}
            loading="lazy"
          />
        </ImageListItem>

        {/* Modal */}
        <Modal open={this.state.modalState.isOpen} onClose={this.closeModal}>
          <Box sx={modalStyle}>
            <Grid container>
              {/* Close Icon */}
              <Grid item container xs={12} sx={{ pb: 1 }}>
                <Grid item xs={10} sx={{ pl: 1 }} alignSelf="center">
                  <Typography>{this.props.name}</Typography>
                </Grid>
                <Grid
                  item
                  container
                  xs={2}
                  justifyContent="flex-end"
                  alignSelf="center"
                >
                  <IconButton onClick={this.closeModal}>
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </Grid>

              {/* Modal Image */}
              <Grid
                item
                container
                xs={12}
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
                <Grid item xs={12}>
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
                            onClick={(event) =>
                              this.handleVariationClick(skintone, event)
                            }
                            key={`${emoji.cldr}_${skintone}`}
                            sx={{
                              textAlign: "center",
                              borderRadius: 2,
                              padding: 0.5,
                              backgroundColor: (theme) =>
                                Skintones[
                                  skintone as keyof typeof Skintones
                                ] === this.state.modalState.selectedSkintone
                                  ? theme.palette.action.selected
                                  : "",
                              "&:hover": {
                                backgroundColor: (theme) =>
                                  theme.palette.action.hover,
                              },
                            }}
                          >
                            <img
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
              <Grid item container xs={12} justifyContent="center">
                {/* Emoji Style */}
                <Grid item xs={6} sx={{ pr: 1 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>style</InputLabel>
                    <Select
                      label="format"
                      value={this.state.modalState.selectedStyle}
                      onChange={this.handleStyleChanged}
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
                <Grid item xs={6} sx={{ pr: 1 }}>
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={this.handleDownloadClick}
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

  openModal() {
    this.setState({ modalState: { ...this.state.modalState, isOpen: true } });
  }

  // Reset modal state when closing
  closeModal() {
    this.setState({
      modalState: {
        ...this.state.modalState,
        isOpen: false,
      },
    });
  }

  handleVariationClick(skintone: string, event: React.SyntheticEvent) {
    this.setState({
      modalState: {
        ...this.state.modalState,
        selectedSkintone: Skintones[skintone as keyof typeof Skintones],
      },
    });
  }

  handleStyleChanged(
    event: SelectChangeEvent<string>,
    child: React.ReactNode
  ): void {
    this.setState({
      modalState: {
        ...this.state.modalState,
        selectedStyle: Styles[event.target.value as keyof typeof Styles],
      },
    });
  }

  async handleDownloadClick() {
    const { name } = this.props;
    const { emojiMetadata, modalState } = this.state;

    var downloadUrl: string;
    if (emojiMetadata[name].isSkintoneBased && emojiMetadata[name].skintones) {
      downloadUrl =
        emojiMetadata[name].skintones![modalState.selectedSkintone][
          modalState.selectedStyle
        ];
    } else {
      downloadUrl = emojiMetadata[name].styles![modalState.selectedStyle];
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
  }

  getRandomBackgroundColor(): string {
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
  }
}
