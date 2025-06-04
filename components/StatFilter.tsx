"use client";

import React from 'react';

interface StatFilterProps {
  type: "appointments" | "pending" | "cancelled";
  count: number;
  label: string;
  icon: string;
  onClick: (type: "appointments" | "pending" | "cancelled") => void;
}

const StatFilter = ({ count, label, type, icon, onClick }: StatFilterProps) => {
  return (
    <div className="stat-card border_unv bg-black/90">
      <h3 className="text-[1rem] mx-auto text-center">{label}</h3>
      <div
        className="flex justify-between notifbrd_gradient2 dock-item-link-wrap items-center rounded-md px-4 py-2 cursor-pointer hover:text-black"
        onClick={() => onClick(type)} id='filterbtn'
      >
        <p className='px-2 py-3 z-50'>View</p>
      </div>
    </div>
  );
}

export default StatFilter;
