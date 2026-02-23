export type SelectionAction =
  | { type: "SELECT_REGION"; region: string }
  | { type: "CLEAR_SELECTION" };

export function selectionReducer(
  selected: string | null,
  action: SelectionAction
): string | null {
  switch (action.type) {
    case "SELECT_REGION":
      return action.region;

    case "CLEAR_SELECTION":
      return null;

    default:
      return selected;
  }
}