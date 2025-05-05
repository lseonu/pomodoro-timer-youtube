import React, { useState } from 'react';
import { Video } from '../types';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { FaPlus, FaTrash, FaUpload, FaGripVertical } from 'react-icons/fa';

interface VideoListProps {
  videos: Video[];
  onVideosChange: (videos: Video[]) => void;
}

interface ValidationResult {
  valid: boolean;
  embeddable: boolean;
  embedUrl?: string;
  fallbackUrl?: string;
  title?: string;
  error?: string;
}

export const VideoList: React.FC<VideoListProps> = ({ videos, onVideosChange }) => {
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [error, setError] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const validateVideo = async (videoId: string): Promise<ValidationResult> => {
    try {
      const response = await fetch(`http://localhost:3001/api/verify-video/${videoId}`);
      const data = await response.json();
      if (data.embeddable) {
        return {
          valid: true,
          embeddable: true,
          embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&controls=1&modestbranding=1`,
          title: `Video ${videoId}`
        };
      }
      return {
        valid: false,
        embeddable: false,
        fallbackUrl: `https://www.youtube.com/watch?v=${videoId}`,
        error: 'Video not found or not accessible'
      };
    } catch (error) {
      console.error('Failed to validate video:', error);
      return {
        valid: false,
        embeddable: false,
        fallbackUrl: `https://www.youtube.com/watch?v=${videoId}`,
        error: 'Failed to validate video'
      };
    }
  };

  const handleAddVideo = async () => {
    if (!newVideoUrl) return;

    try {
      const videoId = extractVideoId(newVideoUrl);
      if (!videoId) {
        setError('Invalid YouTube URL');
        return;
      }

      const validationResult = await validateVideo(videoId);
      
      if (validationResult.valid && validationResult.embedUrl && validationResult.title) {
        const newVideo: Video = {
          id: videoId,
          url: validationResult.embedUrl,
          title: validationResult.title
        };
        
        onVideosChange([...videos, newVideo]);
        setNewVideoUrl('');
        setIsUploadModalOpen(false);
        setError('');
      } else {
        setError(validationResult.error || 'Video not found or not accessible');
      }
    } catch (err) {
      setError('Failed to add video. Please try again.');
    }
  };

  const handleRemoveVideo = (id: string) => {
    onVideosChange(videos.filter(video => video.id !== id));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = videos.findIndex(video => video.id === active.id);
      const newIndex = videos.findIndex(video => video.id === over.id);
      const newVideos = [...videos];
      const [removed] = newVideos.splice(oldIndex, 1);
      newVideos.splice(newIndex, 0, removed);
      onVideosChange(newVideos);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsUploadModalOpen(true)}
        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        <FaUpload />
        Add Video
      </button>

      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add YouTube Video</h3>
            <input
              type="text"
              value={newVideoUrl}
              onChange={(e) => setNewVideoUrl(e.target.value)}
              placeholder="Enter YouTube URL"
              className="w-full p-2 border rounded mb-4"
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setError('');
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddVideo}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={videos.map(video => video.id)}>
          <div className="space-y-2">
            {videos.map((video) => (
              <SortableItem key={video.id} id={video.id}>
                <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                  <div className="flex items-center gap-2">
                    <FaGripVertical className="text-gray-500 cursor-move" />
                    <span>{video.title}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveVideo(video.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};