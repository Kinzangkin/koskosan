"use client";

import { updateComplaintStatus } from "@/app/actions/complaint-actions";
import { ComplaintStatus } from "@prisma/client";
import { useState } from "react";

interface Props {
  id: string;
  currentStatus: string;
}

export function UpdateComplaintStatusSelect({ id, currentStatus }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLoading(true);
    const newStatus = e.target.value as ComplaintStatus;
    const result = await updateComplaintStatus(id, newStatus);
    if (!result.success) {
      alert(result.error);
    }
    setLoading(false);
  }

  return (
    <select 
      defaultValue={currentStatus}
      onChange={handleChange}
      disabled={loading}
      className="bg-white border border-slate-200 text-sm rounded-full px-4 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-full md:w-auto disabled:opacity-50"
    >
      <option value="NEW">Mark as New</option>
      <option value="IN_PROGRESS">In Progress</option>
      <option value="DONE">Resolved</option>
    </select>
  );
}
