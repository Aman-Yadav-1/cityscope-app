'use client';

import { useState } from 'react';
import { FaFilter, FaMapMarkerAlt } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

const POST_TYPES = [
  { value: '', label: 'All Types', icon: '🔍', color: 'gray' },
  { value: 'recommend_place', label: 'Recommendations', icon: '🏆', color: 'blue' },
  { value: 'ask_help', label: 'Help Requests', icon: '❓', color: 'yellow' },
  { value: 'local_update', label: 'Local Updates', icon: '📢', color: 'green' },
  { value: 'event_announcement', label: 'Events', icon: '🎉', color: 'purple' }
];

interface PostFilterProps {
  onFilterChange: (filter: any) => void;
}

const PostFilter = ({ onFilterChange }: PostFilterProps) => {
  const [filter, setFilter] = useState({
    postType: '',
    location: ''
  });
  const [locationName, setLocationName] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = {
      ...filter,
      [e.target.name]: e.target.value
    };
    
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationName(e.target.value);
  };

  const handleLocationSubmit = () => {
    // In a real app, we would use a geocoding service to convert location name to coordinates
    // For now, we'll just use the name as a filter
    const newFilter = {
      ...filter,
      location: locationName
    };
    
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const clearFilters = () => {
    setFilter({
      postType: '',
      location: ''
    });
    setLocationName('');
    onFilterChange({
      postType: '',
      location: ''
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="bg-gradient-to-br from-blue-100 to-indigo-100 p-2 rounded-lg text-blue-600 mr-3 shadow-sm">
            <FaFilter />
          </span>
          <h3 className="text-lg font-semibold text-gray-800">Filter Feed</h3>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`text-sm px-4 py-1.5 rounded-full transition-all ${showFilters ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          type="button"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      
      {showFilters && (
        <div className="space-y-5 mt-5">
          <div>
            <label htmlFor="postType" className="block text-sm font-medium text-gray-700 mb-2">
              Post Type
            </label>
            <div className="flex flex-wrap gap-2">
              {POST_TYPES.map(type => (
                <button
                  key={type.value}
                  onClick={() => {
                    const newFilter = { ...filter, postType: type.value };
                    setFilter(newFilter);
                    onFilterChange(newFilter);
                  }}
                  className={`flex items-center px-3 py-2 rounded-full text-sm font-medium transition-all ${filter.postType === type.value ? 
                    type.color === 'blue' ? 'bg-blue-100 text-blue-800 border-2 border-blue-200' :
                    type.color === 'green' ? 'bg-green-100 text-green-800 border-2 border-green-200' :
                    type.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-200' :
                    type.color === 'purple' ? 'bg-purple-100 text-purple-800 border-2 border-purple-200' :
                    'bg-gray-100 text-gray-800 border-2 border-gray-200'
                    : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'}`}
                  type="button"
                >
                  <span className="mr-1">{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                <FaMapMarkerAlt />
              </div>
              <input
                id="location"
                type="text"
                placeholder="Enter location name"
                className="w-full pl-10 pr-24 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-gray-50 hover:bg-white transition-colors"
                value={locationName}
                onChange={handleLocationChange}
              />
              <button
                type="button"
                onClick={handleLocationSubmit}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-1 rounded-full transition-colors text-sm font-medium"
                disabled={!locationName.trim()}
              >
                Apply
              </button>
            </div>
          </div>
          
          {(filter.postType || filter.location) && (
            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                onClick={clearFilters}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full"
                type="button"
              >
                <IoClose className="mr-1" size={16} />
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
      
      {(filter.postType || filter.location) && !showFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filter.postType && (
            <div className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center shadow-sm ${filter.postType === 'recommend_place' ? 'bg-blue-100 text-blue-800' : 
              filter.postType === 'ask_help' ? 'bg-yellow-100 text-yellow-800' : 
              filter.postType === 'local_update' ? 'bg-green-100 text-green-800' : 
              filter.postType === 'event_announcement' ? 'bg-purple-100 text-purple-800' : 
              'bg-gray-100 text-gray-800'}`}>
              <span className="mr-1">{POST_TYPES.find(type => type.value === filter.postType)?.icon}</span>
              {POST_TYPES.find(type => type.value === filter.postType)?.label}
              <button
                onClick={() => {
                  const newFilter = { ...filter, postType: '' };
                  setFilter(newFilter);
                  onFilterChange(newFilter);
                }}
                className="ml-2 focus:outline-none hover:opacity-70 transition-opacity"
                type="button"
                aria-label="Remove post type filter"
              >
                <IoClose size={16} />
              </button>
            </div>
          )}
          
          {filter.location && (
            <div className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center shadow-sm">
              <FaMapMarkerAlt className="mr-1" /> {filter.location}
              <button
                onClick={() => {
                  const newFilter = { ...filter, location: '' };
                  setFilter(newFilter);
                  setLocationName('');
                  onFilterChange(newFilter);
                }}
                className="ml-2 focus:outline-none hover:opacity-70 transition-opacity"
                type="button"
                aria-label="Remove location filter"
              >
                <IoClose size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostFilter;
