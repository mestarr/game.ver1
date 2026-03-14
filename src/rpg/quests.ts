export type QuestStage =
  | "find_gamwise"
  | "go_elven"
  | "get_ring"
  | "go_volcano"
  | "destroy"
  | "done";

export interface QuestState {
  stage: QuestStage;
  hasRing: boolean;
  ringDestroyed: boolean;
}

export function questHint(s: QuestState): string {
  if (s.ringDestroyed)
    return "The ring is gone. Rest by the river, stroll the city, or watch the mill turn.";
  if (s.stage === "find_gamwise")
    return "Gamwise waits by the green — follow the path from the well. City Stoneford lies north across the bridges.";
  if (s.stage === "go_elven")
    return "Silvervale glade is east — follow the east road past the fields. Lady Arweneth waits among the trees.";
  if (s.stage === "get_ring")
    return "You bear the Ashfire Ring. Mount Tharen burns far east — follow the path beyond the elves.";
  if (s.stage === "go_volcano")
    return "At the eastern fire-pool, by the black pillar — press E to end the ring.";
  return "";
}
