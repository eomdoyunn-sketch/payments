"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type Column<T> = {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
  width?: string
}

type DataTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (row: T) => void
  searchable?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  searchable = false,
  searchPlaceholder = "검색...",
  emptyMessage = "데이터가 없습니다.",
  className
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState("")

  // 검색 필터링
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data

    return data.filter((row) => {
      return Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
  }, [data, searchQuery])

  return (
    <div className={cn("space-y-4", className)}>
      {/* 검색 */}
      {searchable && (
        <div className="flex items-center gap-2">
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              onClick={() => setSearchQuery("")}
              size="sm"
            >
              초기화
            </Button>
          )}
        </div>
      )}

      {/* 테이블 */}
      <div className="rounded-md border border-gray-300 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b-2 border-gray-300">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  style={{ width: column.width }}
                  className="text-center font-bold text-gray-700 border-r border-gray-200 last:border-r-0"
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "hover:bg-blue-50 transition-colors",
                    rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/30",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {columns.map((column) => (
                    <TableCell 
                      key={column.key}
                      style={{ width: column.width }}
                      className="text-center border-r border-gray-100 last:border-r-0"
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 결과 수 표시 */}
      {searchQuery && (
        <div className="text-sm text-muted-foreground">
          {filteredData.length}개의 결과 (전체 {data.length}개)
        </div>
      )}
    </div>
  )
}
