import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'do6qy56kf',   
    api_key: '888443219665931',        
    api_secret: 'YJE-bgUxrpRLrGcVqNICTqq_otA',   
  });
  

 
export const uploadPhotoToCloudinary = async (photo: Blob) => {
  return new Promise<string>((resolve, reject) => {
    // Convert Blob to ArrayBuffer
    photo.arrayBuffer()
      .then((buffer) => {
        const bufferObj = Buffer.from(buffer);  // Convert ArrayBuffer to Buffer

        // Ensure you're using the correct Cloudinary v2 uploader method
        cloudinary.uploader.upload_stream(
          { folder: 'o_h_app' }, // Cloudinary folder name
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);  // Log any upload errors
              reject(new Error('Failed to upload photo to Cloudinary'));
            } else {
              resolve(result.secure_url); // Return the URL of the uploaded photo
            }
          }
        ).end(bufferObj); // Pass the Buffer to Cloudinary
      })
      .catch((error) => {
        console.error('Error converting photo to buffer:', error);  // Log buffer conversion errors
        reject(new Error('Error converting photo to buffer'));
      });
  });
};

  
  
   