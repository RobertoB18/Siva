'use client';
import { useState, useEffect } from 'react';
import { get } from 'react-hook-form';

export default function ImagenLogo({ register, setValue, defaultValue, errors, setFile }) {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); 
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  useEffect(() => { 
    if (defaultValue) {
      setPreview(defaultValue);
      setValue('logo', defaultValue);
    }
  }, [defaultValue, setValue]);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'preset_publico'); // tu preset público de Cloudinary

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      setUploadedUrl(data.secure_url);
      setValue('logo', data.secure_url); // actualiza valor del campo en el formulario
    } catch (error) {
      console.error('Error al subir imagen:', error);
    }
  };
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">Logo de la tienda</label>
      <input
        {...register('logo', { required: !defaultValue })}
        className={`border p-2 mb-4 w-full text-black rounded-lg ${errors.logo ? "border-red-400 border-2" : "border-gray-500"}`}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      {preview && (
        <div className="mb-2">
          <img src={preview} alt="Vista previa" width="200" height="50" className="mb-2" />
        </div>
      )}
    </div>
  );
}
