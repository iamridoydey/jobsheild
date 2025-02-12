import { Frauder } from '@/lib/interfaces';
import Link from 'next/link';
import React from 'react'



const HrList = ({frauder}:{frauder: Frauder}) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl text-gray-200 font-semibold">HR Contacts</h2>
      <ul className="mt-2 space-y-2">
        {frauder.hrList?.map((hr, index) => (
          <li key={index} className="bg-gray-400 p-3 rounded">
            <p className="font-medium">{hr.name}</p>
            <Link
              href={hr.accountUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              {hr.account}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HrList