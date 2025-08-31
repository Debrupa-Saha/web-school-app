'use client';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function AddSchool() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [msg, setMsg] = React.useState('');

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'image') formData.append('image', value[0]);
      else formData.append(key, value);
    });

    const res = await fetch('/api/schools', { method: 'POST', body: formData });
    if (res.ok) {
      setMsg('School added successfully!');
      reset();
    } else {
      setMsg('Error adding school');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add School</h1>
      {msg && <p className="mb-4 text-green-600 font-semibold">{msg}</p>}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md space-y-4"
      >
        {/* School Name */}
        <div>
          <label className="block text-gray-700 mb-1">School Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            placeholder="Enter school name"
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <span className="text-red-500">{errors.name.message}</span>}
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-700 mb-1">Address</label>
          <textarea
            {...register('address', { required: 'Address is required' })}
            placeholder="Enter address"
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.address && <span className="text-red-500">{errors.address.message}</span>}
        </div>

        {/* City */}
        <div>
          <label className="block text-gray-700 mb-1">City</label>
          <input
            {...register('city', { required: 'City is required' })}
            placeholder="Enter city"
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.city && <span className="text-red-500">{errors.city.message}</span>}
        </div>

        {/* State */}
        <div>
          <label className="block text-gray-700 mb-1">State</label>
          <input
            {...register('state', { required: 'State is required' })}
            placeholder="Enter state"
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.state && <span className="text-red-500">{errors.state.message}</span>}
        </div>

        {/* Type Dropdown */}
        <div>
          <label className="block text-gray-700 mb-1">Type</label>
          <select
            {...register('type', { required: 'Type is required' })}
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select type</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
          {errors.type && <span className="text-red-500">{errors.type.message}</span>}
        </div>

        {/* Contact */}
        <div>
          <label className="block text-gray-700 mb-1">Contact</label>
          <input
            type="number"
            {...register('contact', { required: 'Contact is required' })}
            placeholder="Enter contact number"
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.contact && <span className="text-red-500">{errors.contact.message}</span>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('email_id', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
            })}
            placeholder="Enter email"
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email_id && <span className="text-red-500">{errors.email_id.message}</span>}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 mb-1">School Logo / Image</label>
          <input
            type="file"
            {...register('image', { required: 'Image is required' })}
            className="border p-2 w-full rounded"
          />
          {errors.image && <span className="text-red-500">{errors.image.message}</span>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition w-full"
        >
          Save
        </button>
      </form>
    </div>
  );
}
