export type SelectionAction =
  | { type: "SELECT_REGION"; region: string }
  | { type: "DESELECT"; region?: string };

export function selectionReducer(
  selected: string | null,
  action: SelectionAction
): string | null {
  switch (action.type) {
    case "SELECT_REGION":
      return action.region;

    case "DESELECT":
      return null;

    default:
      return selected;
  }
}