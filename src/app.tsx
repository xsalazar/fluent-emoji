import EmojiGrid from "./Components/emoji-grid.js";
import Footer from "./Components/footer.js";

export default function App() {
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
