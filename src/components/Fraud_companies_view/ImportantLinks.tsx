import { Frauder } from '@/lib/interfaces';
import Link from 'next/link';
import React from 'react'

const ImportantLinks = ({frauder}:{frauder: Frauder}) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold">Important Links</h2>
      <ul className="mt-2 space-y-2">
        {frauder.importantLinks?.map((link, index) => (
          <li key={index} className="bg-gray-100 p-3 rounded">
            <span className="font-medium">{link.key}: </span>
            <Link
              href={link.value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              {link.value}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ImportantLinks