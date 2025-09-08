'use client'
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SnowflakeTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/query/job_post")
      .then((res) => res.json())
      .then((d) => {
        let parsed;
        if (typeof d === "string") {
          try {
            parsed = JSON.parse(d);
          } catch {
            parsed = [];
          }
        } else if (Array.isArray(d)) {
          parsed = d;
        } else if (d?.rows) {
          parsed = d.rows;
        } else {
          parsed = [];
        }
        setData(parsed);
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      {/* Table Container with border + rounded corners */}
      <div className="border border-gray-300 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="border">No</TableHead>
              <TableHead className="border">Job Name</TableHead>
              <TableHead className="border">Caption</TableHead>
              <TableHead className="border">Start Date</TableHead>
              <TableHead className="border">End Date</TableHead>
              <TableHead className="border">Date Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="border">{index + 1}</TableCell>
                <TableCell className="border">{row.JOB_NAME}</TableCell>
                <TableCell className="border max-w-[250px] truncate">{row.PROMPT}</TableCell>
                <TableCell className="border">{row.START_DATE}</TableCell>
                <TableCell className="border">{row.END_DATE}</TableCell>
                <TableCell className="border">{row.DATE_CREATED}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
