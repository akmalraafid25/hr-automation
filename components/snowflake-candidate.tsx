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
    fetch("/api/query/candidates")
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
              <TableHead className="border">Name</TableHead>
              <TableHead className="border">Email</TableHead>
              <TableHead className="border">Phone</TableHead>
              <TableHead className="border">LinkedIn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="border">{index + 1}</TableCell>
                <TableCell className="border">{row.NAME}</TableCell>
                <TableCell className="border">
                  <a
                    href={`mailto:${row.EMAIL}`}
                    className="text-blue-600 underline"
                  >
                    {row.EMAIL}
                  </a>
                </TableCell>
                <TableCell className="border">
                  {row.PHONE?.startsWith("0")
                    ? "+62" + row.PHONE.slice(1)
                    : row.PHONE}
                </TableCell>
                <TableCell className="border">
                  <a
                    href={row.LINKEDIN?.startsWith('linkedin')? "https://www." + row.LINKEDIN.slice(0):row.LINKEDIN}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Profile
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
