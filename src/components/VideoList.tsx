import React, { useState } from 'react';
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FaUpload } from 'react-icons/fa';
import { Video } from '../types';
import SortableItem from './SortableItem';

interface VideoListProps {
  videos: Video[];
  onVideosChange: (videos: Video[]) => void;
}

const VideoList: React.FC<VideoListProps> = ({ videos, onVideosChange }) => {
  const [inputValue, setInputValue] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = videos.findIndex(v => v.id === active.id);
      const newIndex = videos.findIndex(v => v.id === over.id);
      const newVideos = [...videos];
      const [removed] = newVideos.splice(oldIndex, 1);
      newVideos.splice(newIndex, 0, removed);
      onVideosChange(newVideos);
    }
  };

  const handleAddVideo = () => {
    if (inputValue.trim()) {
      const videoId = extractVideoId(inputValue);
      if (videoId) {
        const newVideo: Video = {
          id: videoId,
          title: `Video ${videos.length + 1}`,
          url: `https://www.youtube.com/watch?v=${videoId}`
        };
        onVideosChange([...videos, newVideo]);
        setInputValue('');
      }
    }
  };

  const handleRemoveVideo = (id: string) => {
    onVideosChange(videos.filter(video => video.id !== id));
  };

  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter YouTube URL"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleAddVideo}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <FaUpload />
        </button>
      </div>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={videos.map(v => v.id)} strategy={verticalListSortingStrategy}>
          {videos.map((video) => (
            <SortableItem
              key={video.id}
              video={video}
              onRemove={handleRemoveVideo}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default VideoList;