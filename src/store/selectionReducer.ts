export type SelectionAction =
  | { type: "SELECT_REGION"; region: string }
  | { type: "CLEAR_SELECTION"; region: string };

export function selectionReducer(
  selected: string | null,
  action: SelectionAction
): string | null {
  switch (action.type) {
    case "SELECT_REGION":
      return action.region;

    case "CLEAR_SELECTION":
      return action.region;

    default:
      return selected;
  }
}