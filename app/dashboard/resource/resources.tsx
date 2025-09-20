"use client"
import React, { useState } from 'react';
import { Search, Play, BookOpen, Headphones, Filter, Star, Clock, Download } from 'lucide-react';
// Define Resource type locally since '../../types' cannot be found
type Resource = {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'article' | 'exercise';
  category: string;
  language: string;
  duration?: number;
  url: string;
  description: string;
  tags: string[];
};

interface ResourceHubProps {
  userRole: 'student' | 'counselor' | 'admin';
}

const ResourceHub: React.FC<ResourceHubProps> = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Understanding Anxiety: A Student Guide',
      type: 'video',
      category: 'anxiety',
      language: 'English',
      duration: 15,
      url: '#',
      description: 'Learn about anxiety symptoms, causes, and management techniques specifically for college students.',
      tags: ['anxiety', 'coping', 'students', 'mental health']
    },
    {
      id: '2',
      title: 'Progressive Muscle Relaxation',
      type: 'audio',
      category: 'stress',
      language: 'English',
      duration: 20,
      url: '#',
      description: 'Guided audio session to help you relax and reduce physical tension.',
      tags: ['relaxation', 'stress relief', 'meditation']
    },
    {
      id: '3',
      title: 'Depression: Breaking the Cycle',
      type: 'article',
      category: 'depression',
      language: 'Hindi',
      url: '#',
      description: 'Understanding depression and practical steps to manage symptoms in your daily life.',
      tags: ['depression', 'self-help', 'recovery']
    },
    {
      id: '4',
      title: 'Healthy Sleep Habits for Students',
      type: 'video',
      category: 'sleep',
      language: 'English',
      duration: 12,
      url: '#',
      description: 'Essential tips for improving sleep quality and establishing healthy sleep routines.',
      tags: ['sleep hygiene', 'wellness', 'productivity']
    },
    {
      id: '5',
      title: 'Building Healthy Relationships',
      type: 'exercise',
      category: 'relationships',
      language: 'English',
      url: '#',
      description: 'Interactive exercises to improve communication and build stronger relationships.',
      tags: ['relationships', 'communication', 'social skills']
    },
    {
      id: '6',
      title: 'Exam Stress Management',
      type: 'article',
      category: 'academic',
      language: 'Tamil',
      url: '#',
      description: 'Strategies to manage academic pressure and perform better during exams.',
      tags: ['academic stress', 'exams', 'performance']
    }
  ];

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'anxiety', label: 'Anxiety' },
    { id: 'depression', label: 'Depression' },
    { id: 'stress', label: 'Stress Management' },
    { id: 'sleep', label: 'Sleep & Wellness' },
    { id: 'relationships', label: 'Relationships' },
    { id: 'academic', label: 'Academic Stress' }
  ];

  const types = [
    { id: 'all', label: 'All Types' },
    { id: 'video', label: 'Videos' },
    { id: 'audio', label: 'Audio' },
    { id: 'article', label: 'Articles' },
    { id: 'exercise', label: 'Exercises' }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Play;
      case 'audio': return Headphones;
      case 'article': return BookOpen;
      case 'exercise': return Star;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'audio': return 'bg-green-100 text-green-800';
      case 'article': return 'bg-blue-100 text-blue-800';
      case 'exercise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Resource Hub</h1>
        <p className="text-gray-600">Psychoeducational resources to support your mental wellness journey</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources, topics, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {types.map(type => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Featured Resources */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Featured Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.slice(0, 3).map((resource) => {
            const TypeIcon = getTypeIcon(resource.type);
            return (
              <div key={resource.id} className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white bg-opacity-20 p-2 rounded-full">
                    <TypeIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                    Featured
                  </span>
                </div>
                <h3 className="font-semibold mb-2">{resource.title}</h3>
                <p className="text-blue-100 text-sm mb-4">{resource.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-blue-200 text-sm">
                    {resource.duration && (
                      <>
                        <Clock className="w-4 h-4 mr-1" />
                        {resource.duration} min
                      </>
                    )}
                  </div>
                  <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                    Access
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All Resources */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            All Resources ({filteredResources.length})
          </h2>
          {userRole === 'admin' && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Add Resource
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const TypeIcon = getTypeIcon(resource.type);
            return (
              <div key={resource.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${getTypeColor(resource.type)}`}>
                      <TypeIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(resource.type)}`}>
                        {resource.type}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{resource.language}</span>
                </div>

                <h3 className="font-semibold text-gray-800 mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{resource.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {resource.duration && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {resource.duration}m
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details
                  </button>
                  <div className="flex space-x-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors">
                      Access
                    </button>
                    {userRole === 'student' && (
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No resources found</h3>
          <p className="text-gray-500">Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  );
};

export default ResourceHub;