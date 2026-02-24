export type SelectionAction =
  | { type: "SELECT_REGION"; region: string }
  | { type: "UNSELECT"; region: string };

export function selectionReducer(
  selected: string | null,
  action: SelectionAction
): string | null {
  switch (action.type) {
    case "SELECT_REGION":
      return action.region;

    case "UNSELECT":
      return null;

    default:
      return selected;
  }
}