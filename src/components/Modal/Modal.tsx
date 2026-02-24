import { useMapStore } from "../../store/store";

export default function Modal() {
  const { mapState, dispatch } = useMapStore();

  const selected = mapState.selected;
  if (!selected) return null;

  const region = mapState.regionDict[selected];
  console.log(region);
  

  return (
    <div
      style={{
        position: "fixed",
        top: 40,
        right: 40,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          position: "relative",
          background: "#fff",
          padding: "20px 24px",
          borderRadius: 10,
          minWidth: 260,
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={() => dispatch({ type: "DESELECT" })}
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            background: "transparent",
            border: "none",
            fontSize: 18,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ×
        </button>

        <h2 style={{ marginTop: 0 }}>{selected}</h2>

        <p><strong>Status:</strong> {region.status}</p>
        <p><strong>Garrison:</strong> {region.garrison}</p>
        <p><strong>Faction:</strong> {region.fraction}</p>

        <button
          onClick={() =>
            dispatch({ type: "ATTACK_REGION", region: selected })
          }
        >
          Attack
        </button>
      </div>
    </div>
  );
}