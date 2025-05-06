import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  ListItem, 
  ListItemText, 
  IconButton,
  Box
} from '@mui/material';
import { Delete as DeleteIcon, DragIndicator as DragIcon } from '@mui/icons-material';
import { Video } from '../types';

interface SortableItemProps {
  video: Video;
  onRemove: (id: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ video, onRemove }) => {
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
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-child': {
          borderBottom: 'none'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <IconButton
          {...attributes}
          {...listeners}
          size="small"
          sx={{ mr: 1 }}
        >
          <DragIcon />
        </IconButton>
        <ListItemText 
          primary={video.title}
          secondary={video.url}
          sx={{ flex: 1 }}
        />
        <IconButton
          onClick={() => onRemove(video.id)}
          size="small"
          sx={{ ml: 1 }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </ListItem>
  );
};

export default SortableItem; 