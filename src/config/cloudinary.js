// Cloudinary configuration for frontend
const CLOUDINARY_CLOUD_NAME = 'do8nqb1cm';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default'; // You can create a custom preset in your Cloudinary dashboard

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url; // Returns the uploaded image URL
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export const getCloudinaryUrl = (publicId, options = {}) => {
  const { width, height, crop = 'fill', quality = 'auto' } = options;
  let url = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  
  if (width || height || crop || quality) {
    url += `/c_${crop}`;
    if (width) url += `,w_${width}`;
    if (height) url += `,h_${height}`;
    if (quality) url += `,q_${quality}`;
  }
  
  url += `/${publicId}`;
  return url;
};

export default {
  cloudName: CLOUDINARY_CLOUD_NAME,
  uploadPreset: CLOUDINARY_UPLOAD_PRESET,
  uploadToCloudinary,
  getCloudinaryUrl
}; 