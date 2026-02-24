import { RegionData } from "../types/types";

export type SelectionAction =
  | { type: "SELECT_REGION"; region: RegionData }
  | { type: "DESELECT"; region?: RegionData };

export function selectionReducer(
  selected: RegionData | null,
  action: SelectionAction
): RegionData | null {
  switch (action.type) {
    case "SELECT_REGION":
      return action.region;

    case "DESELECT":
      return null;

    default:
      return selected;
  }
}