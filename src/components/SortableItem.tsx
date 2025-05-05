import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Video } from '../types';
import { FaGripVertical, FaTrash } from 'react-icons/fa';

interface SortableItemProps {
  video: Video;
  onRemove: (id: string) => void;
}

const SortableItem = ({ video, onRemove }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: video.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
        <div className="flex items-center gap-2">
          <FaGripVertical className="text-gray-500 cursor-move" />
          <span>{video.title}</span>
        </div>
        <button
          onClick={() => onRemove(video.id)}
          className="text-red-500 hover:text-red-700"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default SortableItem; 