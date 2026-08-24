import "./Folder.css";

const Folder = ({
  color = "#7c3aed",
  size = 1,
  onClick,
}) => {
  return (
    <div
      className="folder-wrapper"
      style={{
        "--folder-color": color,
        "--folder-size": size,
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
    >
      {/* Animated particles inside folder */}
      <div className="folder-particles">
        <span className="particle particle-1">✦</span>
        <span className="particle particle-2">·</span>
        <span className="particle particle-3">✧</span>
        <span className="particle particle-4">·</span>
        <span className="particle particle-5">✦</span>
        <span className="particle particle-6">·</span>
        <span className="particle particle-7">✧</span>
        <span className="particle particle-8">·</span>
      </div>

      <div className="folder">
        <div className="folder-back">
          <div className="folder-tab" />

          <div className="folder-paper paper-one" />
          <div className="folder-paper paper-two" />
          <div className="folder-paper paper-three" />

          <div className="folder-front" />
        </div>
      </div>
    </div>
  );
};

export default Folder;