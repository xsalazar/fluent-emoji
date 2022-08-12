import {
  Box,
  Button,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  Modal,
  Typography,
} from "@mui/material";
import React from "react";
import { EmojiData, FluentEmoji } from "./emoji-grid";
import CloseIcon from "@mui/icons-material/Close";
import { DownloadIcon } from "@primer/octicons-react";
import axios from "axios";
const emojiMetadata: EmojiData = require("./metadata.json");

interface EmojiProps {
  name: string;
}

interface EmojiState {
  emojiData: EmojiData;
  modalState: { isOpen: boolean; selectedSkintone: string };
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

export default class Emoji extends React.Component<EmojiProps, EmojiState> {
  constructor(props: EmojiProps) {
    super(props);

    this.state = {
      emojiData: emojiMetadata,
      modalState: {
        isOpen: false,
        selectedSkintone: "Default",
      },
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleVariationClick = this.handleVariationClick.bind(this);
    this.handleDownloadClick = this.handleDownloadClick.bind(this);
  }

  render() {
    const { name: emojiName } = this.props;
    var entry = this.state.emojiData[emojiName];

    return (
      <div>
        <ImageListItem
          onClick={this.openModal}
          key={entry.cldr}
          sx={{
            maxWidth: 64,
            borderRadius: 2,
            padding: 0.5,
            "&:hover": {
              backgroundColor: () => this.getRandomBackgroundColor(),
            },
          }}
        >
          <img
            src={`${this.getEmojiImageUrl(emojiName, entry)}`}
            alt={entry.cldr}
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

              {/* Image */}
              <Grid
                item
                xs={12}
                sx={{ p: 1, pb: 2, display: "flex", justifyContent: "center" }}
              >
                <img
                  src={`${this.getEmojiImageUrl(
                    emojiName,
                    entry,
                    this.state.modalState.selectedSkintone
                  )}`}
                  alt={entry.cldr}
                />
              </Grid>

              {/* Variations */}
              {entry.unicodeSkintones && entry.unicodeSkintones.length > 1 ? (
                <Grid item xs={12}>
                  <ImageList cols={6}>
                    {orderedSkintones.map((skintone: string) => {
                      return (
                        <ImageListItem
                          onClick={(event) =>
                            this.handleVariationClick(skintone, event)
                          }
                          key={`${entry.cldr}_${skintone}`}
                          sx={{
                            textAlign: "center",
                            borderRadius: 2,
                            padding: 0.5,
                            backgroundColor: (theme) =>
                              skintone ===
                              this.state.modalState.selectedSkintone
                                ? theme.palette.action.selected
                                : "",
                            "&:hover": {
                              backgroundColor: (theme) =>
                                theme.palette.action.hover,
                            },
                          }}
                        >
                          <img
                            src={`${this.getEmojiImageUrl(
                              emojiName,
                              entry,
                              skintone
                            )}`}
                            alt={entry.cldr}
                          />
                        </ImageListItem>
                      );
                    })}
                  </ImageList>
                </Grid>
              ) : (
                <div></div>
              )}

              {/* Download Button */}
              <Grid item container xs={12} justifyContent="center">
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
        selectedSkintone: skintone,
      },
    });
  }

  async handleDownloadClick() {
    var response = await axios.get(
      this.getEmojiImageUrl(
        this.props.name,
        this.state.emojiData[this.props.name],
        this.state.modalState.selectedSkintone
      ),
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${this.props.name.replaceAll(" ", "-").toLowerCase()}.png`
    );
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

  getEmojiImageUrl(
    emojiName: string,
    fluentEmoji: FluentEmoji,
    skintone?: string
  ): string {
    var imageName = emojiName.replaceAll(" ", "_").toLowerCase();
    var imageSrc = "";
    if (
      fluentEmoji.unicodeSkintones &&
      fluentEmoji.unicodeSkintones.length > 0
    ) {
      imageSrc = `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/${emojiName}/${
        skintone ?? "Default"
      }/3D/${imageName}_3d_${skintone?.toLowerCase() ?? "default"}.png`;
    } else {
      imageSrc = `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/${emojiName}/3D/${imageName}_3d.png`;
    }

    return imageSrc;
  }
}

const orderedSkintones = [
  "Default",
  "Light",
  "Medium-Light",
  "Medium",
  "Medium-Dark",
  "Dark",
];
