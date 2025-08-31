'use client';
import { useEffect, useState } from 'react';

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [msg, setMsg] = useState('');

  // Fetch all schools
  const fetchSchools = async () => {
    try {
      const res = await fetch('/api/schools');
      const data = await res.json();
      setSchools(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete school by ID
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this school?')) return;

    try {
      const res = await fetch(`/api/schools/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMsg('School deleted successfully!');
        fetchSchools(); // refresh after delete
      } else {
        setMsg('Error deleting school');
      }
    } catch (err) {
      console.error(err);
      setMsg('Error deleting school');
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        All Schools
      </h1>
      {msg && <p className="mb-4 text-green-600 font-semibold text-center">{msg}</p>}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {schools.map((s) => (
          <div key={s.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            {s.image ? (
              <img
                src={`/schoolImages/${s.image}`}
                alt={s.name}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                No Image
              </div>
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-1">{s.name}</h2>
              <p className="text-sm text-gray-600 mb-1">{s.address}</p>
              <p className="text-sm font-medium text-gray-800">{s.city}</p>
              <button
                onClick={() => handleDelete(s.id)}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
