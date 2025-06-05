"use client";

import { getRecentAppointmentList } from '@/lib/actions/appointment.actions';
import { clsx } from 'clsx';
import React, { useEffect, useState } from 'react';
import { BsDatabaseCheck } from "react-icons/bs";
import { MdPendingActions } from "react-icons/md";
import { TbDeviceIpadCancel } from "react-icons/tb";

interface StatCardProps {
  type: 'appointments' | 'pending' | 'cancelled';
  count: number;
  label: string;
  percentage: string;
  // onClick: (type: 'appointments' | 'pending' | 'cancelled') => void;
}

const iconMap = {
  appointments: <BsDatabaseCheck size={32} />,
  pending: <MdPendingActions size={32} />,
  cancelled: <TbDeviceIpadCancel size={32} />
};


const StatCard = ({ count = 0, label, type, percentage = "0" }: StatCardProps) => {
  return (
    <div className={('stat-card bg-black/90 ')}>
      <div className='flex items-center justify-between px-2'>
        <div className="icon-container text-neutral-300">
          {iconMap[type]}
        </div>
        <p className="text-[1rem] text-gray-400">{percentage}%</p>
      </div>
    </div>
  );
};

export default StatCard;
