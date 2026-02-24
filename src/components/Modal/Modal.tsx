import { useMapStore } from "../../store/store";

export default function Modal() {
  const { mapState, dispatch } = useMapStore();

  const selected = mapState.selected;

  if (!selected) return null;

  const region = mapState.regionDict[selected];

  return (
    <div
      onClick={() => dispatch({ type: "DESELECT" })}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          padding: "20px 24px",
          borderRadius: 10,
          minWidth: 260,
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
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