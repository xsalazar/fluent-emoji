import React from "react";
import EmojiGrid from "./Components/emoji-grid";
import Footer from "./Components/footer";

function App() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        maxHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <EmojiGrid />
      <Footer />
    </div>
  );
}

export default App;
