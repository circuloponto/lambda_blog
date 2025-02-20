import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Attempting to upload to bucket: blog-images');
      console.log('File path:', filePath);
      console.log('User:', user); // Log user info

      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (error) {
        console.error('Storage error details:', error);
        throw error;
      }

      console.log('Upload successful:', data);

      // Store just the filename in the database
      return filePath;
    } catch (error) {
      console.error('Full upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!user) {
      setError('You must be logged in to create a post');
      setLoading(false);
      return;
    }

    try {
      let imagePath = null;
      if (image) {
        try {
          imagePath = await uploadImage(image);
          console.log('Image uploaded successfully:', imagePath);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          setError('Failed to upload image. ' + uploadError.message);
          setLoading(false);
          return;
        }
      }

      console.log('Creating post with data:', {
        title,
        content,
        image_url: imagePath,
        user_id: user.id
      });

      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title,
            content,
            image_url: imagePath,
            user_id: user.id,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error('Database error:', error);
        throw new Error(error.message);
      }

      console.log('Post created successfully:', data);
      // Only navigate if post was actually created
      if (data && data.length > 0) {
        navigate('/');
      } else {
        throw new Error('Post was not created');
      }
    } catch (error) {
      console.error('Error details:', error);
      setError(error.message || 'Failed to create post. Please check if the database table exists.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-400 rounded-md text-red-700">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <MDEditor
            value={content}
            onChange={setContent}
            preview="edit"
            height={400}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Featured Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
}
