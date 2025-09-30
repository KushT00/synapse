"use client"
import React, { useEffect, useMemo, useState } from 'react';
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
  recommended?: 'highly-recommended' | 'helpful';
};

interface ResourceHubProps {
  userRole: 'student' | 'counselor' | 'admin';
}

const ResourceHub: React.FC<ResourceHubProps> = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [videoDurations, setVideoDurations] = useState<Record<string, number>>({});

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Understanding Cognitive: A Student Guide',
      type: 'video',
      category: 'cognitive-tech',
      language: 'English',
      duration: 15,
      url: '#',
      description: 'Learn about cognitive signals, causes, and management techniques tailored for college students.',
      tags: ['cognitive', 'coping', 'students', 'mental health']
    },
    {
      id: 'a1',
      title: 'Progressive Muscle Relaxation',
      type: 'audio',
      category: 'stress',
      language: 'Hindi',
      duration: 20,
      url: '/audio/progressive-muscle-relaxation.mp3',
      description: 'Guided audio session to help you relax and reduce physical tension.',
      tags: ['relaxation', 'stress relief', 'meditation'],
      recommended: 'highly-recommended'
    },
    {
      id: 'a2',
      title: 'Guided Meditation',
      type: 'audio',
      category: 'wellness',
      language: 'Hindi',
      duration: 15,
      url: '/audio/guided-meditation.mp3',
      description: 'A calming guided imagery meditation to help reduce stress and anxiety.',
      tags: ['mindfulness', 'meditation', 'stress relief'],
      recommended: 'helpful'
    },
    {
      id: 'a3',
      title: 'OM Mantra',
      type: 'audio',
      category: 'anxiety',
      language: 'Hindi',
      duration: 10,
      url: '/audio/om-mantra.mp3',
      description: 'Sacred OM mantra chanting 108 times to help center your mind and promote inner peace.',
      tags: ['mantra', 'spiritual', 'relaxation'],
      recommended: 'highly-recommended'
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
      title: 'Exam Cognitive Management',
      type: 'article',
      category: 'academic',
      language: 'Tamil',
      url: '#',
      description: 'Strategies to manage academic pressure and perform better during exams.',
      tags: ['academic cognitive', 'exams', 'performance']
    }
  ];

  // Three public video items to append to All Resources
  const publicVideos: Resource[] = useMemo(() => [
    {
      id: 'pv1',
      title: 'Box Breathing Technique',
      type: 'video',
      category: 'anxiety',
      language: 'English',
      duration: videoDurations['pv1'],
      url: '/audio/box-breathing-fixed.mp4',
      description: 'Guided box breathing practice to calm the nervous system.',
      tags: ['breathing', 'grounding', 'anxiety'],
      recommended: 'helpful'
    },
    {
      id: 'pv2',
      title: 'Story to Let Go Your Stress',
      type: 'video',
      category: 'wellness',
      language: 'English',
      duration: videoDurations['pv2'],
      url: '/audio/story-fixed.mp4',
      description: 'A relaxing narrative to unwind and de-stress.',
      tags: ['relaxation', 'mindfulness'],
      recommended: 'helpful'
    },
    {
      id: 'pv3',
      title: '5-4-3-2-1 Grounding Method',
      type: 'video',
      category: 'anxiety',
      language: 'English',
      duration: videoDurations['pv3'],
      url: '/audio/5-4-3-2-1-groundig-fixed.mp4',
      description: 'The 5-4-3-2-1 grounding technique reduces anxiety by helping you focus on the present moment',
      tags: ['grounding', 'anxiety', 'coping'],
      recommended: 'highly-recommended'
    }
  ], [videoDurations]);

  // Load durations from video metadata for public videos
  useEffect(() => {
    const entries = [
      { id: 'pv1', src: '/audio/box-breathing-fixed.mp4' },
      { id: 'pv2', src: '/audio/story-fixed.mp4' },
      { id: 'pv3', src: '/audio/5-4-3-2-1-groundig-fixed.mp4' },
    ];
    entries.forEach(({ id, src }) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = src;
      const onLoaded = () => {
        setVideoDurations(prev => ({ ...prev, [id]: Math.round((video.duration || 0) / 60) }));
        video.removeEventListener('loadedmetadata', onLoaded);
      };
      video.addEventListener('loadedmetadata', onLoaded);
    });
  }, []);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'cognitive-tech', label: 'Cognitive' },
    { id: 'depression', label: 'Depression' },
    { id: 'cognitive-tech', label: 'Cognitive Management' },
    { id: 'sleep', label: 'Sleep & Wellness' },
    { id: 'relationships', label: 'Relationships' },
    { id: 'academic', label: 'Academic Cognitive' }
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
      {/* Inline modal removed; using dedicated viewer page */}
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

      {/* Featured Resources removed as requested */}

      {/* All Resources */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            All Resources ({[...publicVideos, ...filteredResources].length})
          </h2>
          {userRole === 'admin' && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Add Resource
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...publicVideos, ...filteredResources].map((resource) => {
            const TypeIcon = getTypeIcon(resource.type);
            return (
              <div key={resource.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${getTypeColor(resource.type)}`}>
                      <TypeIcon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(resource.type)}`}>
                        {resource.type}
                      </span>
                      {resource.recommended && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          resource.recommended === 'highly-recommended' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {resource.recommended === 'highly-recommended' ? 'Highly Recommended' : 'Community Favorite'}
                        </span>
                      )}
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
                    {resource.type === 'video' ? (
                      <a
                        href={`/dashboard/resource/watch?src=${encodeURIComponent(resource.url)}&title=${encodeURIComponent(resource.title)}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                      >
                        Access
                      </a>
                    ) : (
                      <a
                        href={`/dashboard/resource/listen?src=${encodeURIComponent(resource.url)}&title=${encodeURIComponent(resource.title)}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                      >
                        Access
                      </a>
                    )}
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