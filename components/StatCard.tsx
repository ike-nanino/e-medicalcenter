import Image from 'next/image'
import React from 'react'
import clsx from "clsx";


interface StatCardProps {
  type: 'appointments' | 'pending' | 'cancelled',
  count: number,
  icon: string,
  label: string,
}

function StatCard({ type, icon, label, count = 0 }: StatCardProps) {
  return (
    <div className={clsx('stat-card', {
      'bg-appointments': type === 'appointments',
      'bg-pending': type === 'pending',
      'bg-cancelled': type === 'cancelled',
    })}>
      <div className='flex items-center gap-4'>

        <Image 
        src={icon}
        width={40}
        height={40}
        alt={label}
        className="size-8 w-fit"
        />

        <h2 className='text-32-bold text-white'>{count}</h2>
      </div>

      <p className='text-14-regular'>{label}</p>
    </div>
  )
}

export default StatCard
