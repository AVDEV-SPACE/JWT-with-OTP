"use client";
import React from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "../ui/button";
import { IoIosArrowDropleftCircle } from "react-icons/io";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  fetchAppointments?: () => void;
}

export function DataTable<TData>({
  columns,
  data,
  currentPage,
  setCurrentPage,
  fetchAppointments
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: currentPage,
        pageSize: 10,
      },
    },
    pageCount: Math.ceil(data.length / 10),
    onPaginationChange: () => {},
  });

  const startIndex = currentPage * 10;
  const endIndex = Math.min(startIndex + 10, data.length);
  const currentPageData = data.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (endIndex < data.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const headerGroups = table.getHeaderGroups();

  return (
    <div className="data-table h-auto border_unv overflow-x-auto">
      <Table className="shad-table min-w-full">
        <TableHeader className="bg-table-head border-b-0 with-linear-gradient">
          {headerGroups.map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const columnId = header.column.columnDef.accessorKey as string;
                return (
                  <TableHead 
                    key={header.id}
                    className={`
                      ${columnId === "schedule" ? "hidden md:table-cell" : ""}
                      ${columnId === "primaryPhysician" ? "hidden md:table-cell" : ""}
                      ${columnId === "status" ? "hidden sm:table-cell" : ""}
                    `}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())
                    }
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {currentPageData.length > 0 ? (
            currentPageData.map((item, index) => (
              <TableRow key={index} className="border-b border-neutral-600">
                {columns.map((column, colIndex) => {
                  const columnId = column.accessorKey as string;
                  return (
                    <TableCell 
                      key={colIndex}
                      className={`
                        ${columnId === "schedule" ? "hidden md:table-cell" : ""}
                        ${columnId === "primaryPhysician" ? "hidden md:table-cell" : ""}
                        ${columnId === "status" ? "hidden sm:table-cell" : ""}
                      `}
                    >
                      {column.header === "Nr." ? (
                        <p className="text-14-medium">{startIndex + index + 1}</p>
                      ) : (
                        flexRender(column.cell, { 
                          row: { 
                            original: item,
                            index: startIndex + index
                          }
                        })
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="table-pagination">
        <Button
          size="sm"
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          className="bg-transparen text-white"
        >
          <IoIosArrowDropleftCircle size={30} />
        </Button>
        <Button
          size="sm"
          onClick={handleNextPage}
          disabled={endIndex >= data.length}
          className="bg-transparent text-white"
        >
          <IoIosArrowDropleftCircle size={30} className="rotate-180" />
        </Button>
      </div>
    </div>
  );
}