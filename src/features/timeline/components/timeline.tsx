'use client'

import React, { useState, useEffect } from 'react'
import type { TimelineItem } from '../types/timeline'
import { assignLanes } from '../utils/assign-lanes'
import { TimelineItemComponent } from './timeline-item'

interface TimelineProps {
  items: TimelineItem[]
}

export const Timeline = ({ items: initialItems }: TimelineProps) => {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [items, setItems] = useState(initialItems)
  const [editingItemId, setEditingItemId] = useState<number | null>(null)

  // Sync props with state when items change
  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  const lanes = assignLanes(items)

  const allDates = items.flatMap((item) => [new Date(item.start), new Date(item.end)])
  const startDate =
    allDates.length > 0 ? new Date(Math.min(...allDates.map((d) => d.getTime()))) : new Date()
  const endDate =
    allDates.length > 0 ? new Date(Math.max(...allDates.map((d) => d.getTime()))) : new Date()
  const totalDays =
    allDates.length > 0 ? Math.ceil((endDate.getTime() - startDate.getTime()) / 86_400_000) + 1 : 0

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  const generateTimeScale = () => {
    const scales: { date: Date; position: number }[] = []
    const weeksDiff = Math.ceil(totalDays / 7)
    let interval = Math.max(1, Math.floor(weeksDiff / (8 * zoomLevel)))

    if (zoomLevel >= 4) interval = Math.max(1, Math.floor(interval / 2))
    if (zoomLevel <= 0.5) interval = Math.max(2, interval * 2)

    for (let i = 0; i <= weeksDiff; i += interval) {
      const date = new Date(startDate.getTime() + i * 7 * 86_400_000)
      if (date <= endDate) {
        const position = ((date.getTime() - startDate.getTime()) / 86_400_000 / totalDays) * 100
        scales.push({ date, position })
      }
    }
    return scales
  }

  const timeScales = generateTimeScale()

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev * 1.5, 8))
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev / 1.5, 1))
  const resetZoom = () => setZoomLevel(1)

  const handleItemEdit = (itemId: number) => setEditingItemId(itemId)
  const handleItemSave = (itemId: number, newName: string) => {
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, name: newName } : item)))
    setEditingItemId(null)
  }
  const handleItemCancel = () => setEditingItemId(null)

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4 px-6">Timeline Visualization</h2>

      {/* Timeline Controls */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span className="bg-blue-100 px-3 py-1 rounded-full font-medium">{items.length} items</span>
            <span className="bg-green-100 px-3 py-1 rounded-full font-medium">{lanes.length} lanes</span>
            <span className="bg-purple-100 px-3 py-1 rounded-full font-medium">{totalDays} days</span>
            <span className="text-slate-500">
              {formatDate(startDate)} → {formatDate(endDate)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-600 font-medium">Zoom: {(zoomLevel * 100).toFixed(0)}%</div>
            <div className="flex items-center gap-1 bg-white rounded-lg border border-slate-200 shadow-sm p-1">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                className="px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              >
                −
              </button>
              <button
                onClick={resetZoom}
                className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 8}
                className="px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-x-auto">
        <div style={{ minWidth: `${Math.max(1000, 1000 * zoomLevel)}px` }}>
          {/* Time Scale Header */}
          <div className="border-b bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 pl-20 relative overflow-visible">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative h-12">
              {timeScales.map((scale, idx) => (
                <div key={idx} className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-slate-300 via-slate-200 to-transparent" style={{ left: `${scale.position}%` }} />
              ))}
              {timeScales.map((scale, idx) => (
                <div key={idx} className="absolute transform -translate-x-1/2" style={{ left: `${scale.position}%` }}>
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 px-3 py-2 mb-2 min-w-[60px] text-center">
                    <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{scale.date.toLocaleDateString('en-US', { month: 'short' })}</div>
                    <div className="text-lg font-bold text-slate-800">{scale.date.toLocaleDateString('en-US', { day: 'numeric' })}</div>
                    <div className="text-xs text-slate-500 font-medium">{scale.date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  </div>
                  <div className="w-1 h-3 bg-gradient-to-b from-blue-500 to-blue-400 rounded-full mx-auto shadow-sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Content */}
          <div className="p-6 pl-20 bg-white">
            <div className="relative">
              <div className="absolute -left-16 top-0 w-12 text-center mb-2">
                <div className="bg-white rounded-md shadow-sm border border-slate-200 px-2 py-1">
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Lane</div>
                </div>
              </div>

              {timeScales.map((scale, idx) => (
                <div key={idx} className="absolute top-0 w-px bg-gradient-to-b from-slate-200 via-slate-100 to-transparent" style={{ left: `${scale.position}%`, height: `${lanes.length * 56}px` }} />
              ))}

              {lanes.map((lane, laneIndex) => (
                <div key={laneIndex} className="relative mb-4 last:mb-0" style={{ height: 48 }}>
                  <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-12 text-center">
                    <div className="bg-white rounded-md shadow-sm border border-slate-200 px-2 py-1">
                      <div className="text-sm font-bold text-slate-800">Lane {laneIndex + 1}</div>
                    </div>
                  </div>
                  <div className="relative w-full h-full bg-gray-50 rounded-md border border-gray-200">
                    {lane.map((item) => (
                      <TimelineItemComponent
                        key={item.id}
                        item={item}
                        startDate={startDate}
                        totalDays={totalDays}
                        isEditing={editingItemId === item.id}
                        onEdit={handleItemEdit}
                        onSave={handleItemSave}
                        onCancel={handleItemCancel}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
