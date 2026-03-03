import { RegionState } from "../types/types";

export type SelectionAction =
  | { type: "SELECT_REGION"; region: RegionState }
  | { type: "DESELECT"; region?: RegionState };

export function selectionReducer(
  selected: RegionState | null,
  action: SelectionAction
): RegionState | null {
  switch (action.type) {
    case "SELECT_REGION":
      return action.region;

    case "DESELECT":
      return null;

    default:
      return selected;
  }
}