import { Timeline } from "@/features/timeline/components/timeline"
import { timelineItems } from "@/features/timeline/data/timeline-items"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Timeline items={timelineItems} />
    </div>
  )
}
