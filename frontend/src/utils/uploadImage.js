import axiosInstance from "./axiosinstance";
import { API_PATHS } from "./apiPaths";

const uploadImage = async (imageFile) => {
    const formData = new FormData();

    // Append image file to form data 
    formData.append('image', imageFile);

    try {
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', 
                'Content-Type': undefined,
            },
        });
        return response.data;
    } catch (err) {
        console.error('Error uploading the image: ', err);
        throw err;
    }
};

export default uploadImage;