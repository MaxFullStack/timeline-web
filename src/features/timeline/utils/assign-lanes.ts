import type { TimelineItem, TimelineLane } from '../types/timeline';

export const assignLanes = (items: TimelineItem[]): TimelineLane[] => {
  const sortedItems = items.sort((a, b) =>
    new Date(a.start).getTime() - new Date(b.start).getTime()
  );
  const lanes: TimelineLane[] = [];

  const assignItemToLane = (item: TimelineItem): void => {
    for (const lane of lanes) {
      if (new Date(lane[lane.length - 1].end).getTime() < new Date(item.start).getTime()) {
        lane.push(item);
        return;
      }
    }
    lanes.push([item]);
  };

  for (const item of sortedItems) {
    assignItemToLane(item);
  }
  return lanes;
};