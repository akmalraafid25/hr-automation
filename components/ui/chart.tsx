"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type ChartConfig = Record<
  string,
  {
    label?: string
    color?: string
  }
>

export function ChartContainer({
  id,
  config,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  id?: string
  config: ChartConfig
}) {
  return (
    <div
      data-chart={id}
      data-config={JSON.stringify(config)}
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function ChartTooltip({ content, cursor }: any) {
  return <>{ }</>
}

export function ChartTooltipContent({ hideLabel }: { hideLabel?: boolean }) {
  return (
    <div className="p-2 text-sm">
      {!hideLabel && <span>Tooltip Content</span>}
    </div>
  )
}

export function ChartStyle({
  id,
  config,
}: {
  id: string
  config: ChartConfig
}) {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
        [data-chart="${id}"] {
          --chart-1: hsl(220 90% 56%);
          --chart-2: hsl(160 70% 45%);
          --chart-3: hsl(30 90% 60%);
          --chart-4: hsl(280 80% 65%);
          --chart-5: hsl(340 75% 55%);
        }
      `,
      }}
    />
  )
}
