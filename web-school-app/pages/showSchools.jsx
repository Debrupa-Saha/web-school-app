import React, { useEffect, useState } from 'react';

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    fetch('/api/schools')
      .then((res) => res.json())
      .then((data) => setSchools(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-6">Schools</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {schools.map((s) => (
          <div key={s.id} className="border rounded p-4 shadow">
            {s.image && <img src={s.image} alt={s.name} className="h-40 w-full object-cover mb-4" />}
            <h2 className="font-bold text-lg">{s.name}</h2>
            <p>{s.address}</p>
            <p>{s.city}, {s.state}</p>
            <p>📞 {s.contact}</p>
            <p>📧 {s.email_id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
