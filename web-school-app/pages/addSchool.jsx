import React from 'react';
import { useForm } from 'react-hook-form';

export default function AddSchool() {
  const { register, handleSubmit, reset } = useForm();
  const [msg, setMsg] = React.useState('');

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'image') formData.append('image', value[0]);
      else formData.append(key, value);
    });

    const res = await fetch('/api/schools', {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      setMsg('School added successfully');
      reset();
    } else {
      setMsg('Error adding school');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Add School</h1>
      {msg && <p>{msg}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('name', { required: true })} placeholder="School Name" className="border p-2 w-full" />
        <textarea {...register('address')} placeholder="Address" className="border p-2 w-full" />
        <input {...register('city')} placeholder="City" className="border p-2 w-full" />
        <input {...register('state')} placeholder="State" className="border p-2 w-full" />
        <input {...register('contact')} placeholder="Contact" className="border p-2 w-full" />
        <input {...register('email_id')} placeholder="Email" className="border p-2 w-full" />
        <input type="file" {...register('image')} className="w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">Submit</button>
      </form>
    </div>
  );
}
