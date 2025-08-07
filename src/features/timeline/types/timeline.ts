export interface TimelineItem {
  id: number;
  start: string;
  end: string;
  name: string;
}

export type TimelineLane = TimelineItem[];

export interface TimelineData {
  items: TimelineItem[];
  lanes: TimelineLane[];
}