// const supabase = require('../supabaseClient'); // Adjust path to your Supabase client

// const uploadImage = async (file, folder) => {
//     try {
//         // Upload the image to Supabase storage
//         console.log(file);
//         const { data, error } = await supabase.storage
//             .from('images') // Ensure this matches your bucket name
//             .upload(`${folder}/${Date.now()}-${file.originalname}`, file.buffer, {
//                 cacheControl: '3600',
//                 upsert: false,
//             });

//         if (error) {
//             console.error('Upload error:', error);
//             throw new Error(`Error uploading image: ${error.message}`);
//         }

//         console.log('Upload success:', data);
//         // Get the public URL of the uploaded file
//         const { publicUrl, error: urlError } = supabase.storage.from('images').getPublicUrl(data.path);
//         if (urlError) {
//             console.error('URL generation error:', urlError);
//             throw new Error(`Error generating public URL: ${urlError.message}`);
//         }

//         return publicUrl;
//     } catch (err) {
//         console.error("Image upload failed:", err.message);
//         throw new Error(`Failed to upload image: ${err.message}`);
//     }
// };


// module.exports = uploadImage;




const multer = require('multer');
const cloudinary = require('../cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads/images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
});

const upload = multer({ storage });

module.exports = { upload };

