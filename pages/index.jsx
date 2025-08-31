import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">School Management</h1>
      <p className="mb-6 text-gray-600">Add and browse schools easily</p>
      <div className="space-x-4">
         <Link href="/addSchool" className="btn btn-blue">➕ Add School</Link>
<Link href="/showSchools" className="btn btn-green">📋 Show Schools</Link>
      </div>
    </div>
  );
}
