import { useMemo } from "react"

interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
}

export function VirtualList<T>({ items, itemHeight, containerHeight, renderItem }: VirtualListProps<T>) {
  const visibleItems = useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 2
    return items.slice(0, visibleCount)
  }, [items, itemHeight, containerHeight])

  return (
    <div style={{ height: containerHeight, overflow: 'auto' }}>
      {visibleItems.map((item, index) => (
        <div key={index} style={{ height: itemHeight }}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  )
}