'use client';

import React, { useState, useContext, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { PostsAPI } from '@/lib/api';
import { FaImage, FaMapMarkerAlt } from 'react-icons/fa';
import { FaPaperPlane } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import AuthContext from '@/context/AuthContext';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const POST_TYPES = [
  { value: 'recommend_place', label: 'Recommend a Place', color: 'blue', icon: '🏆' },
  { value: 'ask_help', label: 'Ask for Help', color: 'yellow', icon: '❓' },
  { value: 'local_update', label: 'Share Local Update', color: 'green', icon: '📢' },
  { value: 'event_announcement', label: 'Event Announcement', color: 'purple', icon: '🎉' }
];

const libraries = ['places'];

const PostForm = () => {
  const { user } = useContext(AuthContext);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [focused, setFocused] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    postType: 'local_update',
    image: '',
    location: {
      type: 'Point',
      coordinates: [0, 0],
      name: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg', // This is a public test API key from Google's documentation
    libraries: libraries as any,
  });

  const onPlaceSelected = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const name = place.formatted_address || place.name || '';
        
        setLocationName(name);
        setFormData({
          ...formData,
          location: {
            type: 'Point',
            coordinates: [lng, lat],
            name: name
          }
        });
      }
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationName(e.target.value);
    // When user types manually, we'll update just the name
    // The coordinates will be updated when they select a place from the dropdown
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        name: e.target.value
      }
    });
  };
  
  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, we would upload the image to Cloudinary or similar service
      // For now, we'll just use a placeholder URL and show a local preview
      const imageUrl = 'https://via.placeholder.com/300';
      setFormData({
        ...formData,
        image: imageUrl
      });
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const removeImage = () => {
    setFormData({
      ...formData,
      image: ''
    });
    setImagePreview('');
  };

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [formData.content]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.content.trim() === '') {
      toast.error('Please enter some content for your post');
      return;
    }
    
    if (formData.content.length > 280) {
      toast.error('Post content cannot exceed 280 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      await PostsAPI.createPost(formData);
      
      // Show success animation and toast
      toast.success('Post created successfully!');
      
      // Reset form with animation
      setFormData({
        content: '',
        postType: 'local_update',
        image: '',
        location: {
          type: 'Point',
          coordinates: [0, 0],
          name: ''
        }
      });
      setLocationName('');
      setShowLocationInput(false);
      setImagePreview('');
      setFocused(false);
    } catch (error: any) {
      toast.error(error.response?.data?.msg || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Get badge color based on post type
  const getPostTypeColor = (value: string) => {
    const postType = POST_TYPES.find(type => type.value === value);
    return postType ? postType.color : 'blue';
  };

  // Animation variants
  const formVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } }
  };

  const inputVariants = {
    initial: { height: 60 },
    focused: { height: 120, transition: { duration: 0.2 } },
    blurred: { height: 60, transition: { duration: 0.2 } }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
    disabled: { opacity: 0.7, scale: 1 }
  };

  const iconVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2, rotate: 10, transition: { duration: 0.2 } },
    tap: { scale: 0.8, transition: { duration: 0.1 } }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-3">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 border-2 border-blue-200 overflow-hidden">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user?.username || 'User'}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="text-lg font-bold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
        </div>
        
        {/* Post Form Content */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                ref={textareaRef}
                name="content"
                placeholder="What's happening in your neighborhood?"
                className={`w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700 shadow-sm bg-white overflow-hidden transition-all ${focused ? 'min-h-[120px]' : 'min-h-[60px]'}`}
                value={formData.content}
                onChange={handleChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(formData.content.length > 0)}
              />
              <div className="absolute bottom-3 right-3">
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${formData.content.length > 280 ? 'bg-red-100 text-red-600' : formData.content.length > 240 ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'}`}>
                  {formData.content.length > 0 ? 280 - formData.content.length : ''}
                </span>
              </div>
            </div>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="relative rounded-xl overflow-hidden border border-gray-100">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full max-h-64 object-cover" 
                />
                <button 
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100 transition-all"
                  aria-label="Remove image"
                >
                  <IoClose />
                </button>
              </div>
            )}
            
            {/* Post Type Selection */}
            <div className="flex flex-wrap gap-2">
              {POST_TYPES.map(type => (
                <label 
                  key={type.value} 
                  className={`flex items-center px-3 py-2 rounded-full cursor-pointer transition-all ${formData.postType === type.value ? 
                    type.color === 'blue' ? 'bg-blue-100 text-blue-800 border-2 border-blue-200' :
                    type.color === 'green' ? 'bg-green-100 text-green-800 border-2 border-green-200' :
                    type.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-200' :
                    'bg-purple-100 text-purple-800 border-2 border-purple-200'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:border-gray-200'}`}
                >
                  <input
                    type="radio"
                    name="postType"
                    value={type.value}
                    checked={formData.postType === type.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="mr-1">{type.icon}</span>
                  <span className="text-sm font-medium">{type.label}</span>
                </label>
              ))}
            </div>
            
            {/* Location Input */}
            {showLocationInput && (
              <div className="relative">
                <div className="flex">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                    <FaMapMarkerAlt />
                  </div>
                  {isLoaded ? (
                    <Autocomplete
                      onLoad={onLoad}
                      onPlaceChanged={onPlaceSelected}
                      restrictions={{ country: 'us' }} // Optional: restrict to a country
                    >
                      <input
                        type="text"
                        placeholder="Enter location name"
                        className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        value={locationName}
                        onChange={handleLocationChange}
                      />
                    </Autocomplete>
                  ) : (
                    <input
                      type="text"
                      placeholder="Enter location name"
                      className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      value={locationName}
                      onChange={handleLocationChange}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowLocationInput(false)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <IoClose />
                  </button>
                </div>
                {loadError && (
                  <p className="text-xs text-red-500 mt-1">Error loading Google Maps API: {loadError.message}</p>
                )}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="flex space-x-3">
                <label 
                  className="cursor-pointer flex items-center justify-center w-9 h-9 rounded-full text-blue-500 hover:bg-blue-50 transition-colors hover:scale-110 active:scale-95"
                >
                  <FaImage />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                
                {!showLocationInput && (
                  <button
                    type="button"
                    className="flex items-center justify-center w-9 h-9 rounded-full text-green-500 hover:bg-green-50 transition-colors hover:scale-110 active:scale-95"
                    onClick={() => setShowLocationInput(true)}
                  >
                    <FaMapMarkerAlt />
                  </button>
                )}
              </div>
              
              <button
                type="submit"
                className={`px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-full shadow-sm transition-all ${loading || formData.content.length > 280 || formData.content.length === 0 ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                disabled={loading || formData.content.length > 280 || formData.content.length === 0}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FaPaperPlane className="mr-2" />
                    Post
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
