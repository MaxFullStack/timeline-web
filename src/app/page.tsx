import { Timeline } from "@/features/timeline/components/timeline"
import { timelineItems } from "@/features/timeline/data/timeline-items"

export const iframeHeight = "800px"

export const description = "A timeline visualization with drag-and-drop and zoom features."

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Timeline items={timelineItems} />
    </div>
  )
}
