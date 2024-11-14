import { memo } from 'react';
import { useDraggable } from '@dnd-kit/core';

interface Image {
    fileId: string;
    name: string;
    url: string;
}

interface Position {
    x: number;
    y: number;
    zIndex: number;
}

interface DraggableImageProps {
    image: Image;
    position: Position;
    imageWidthPercent: number;
    imageHeightPercent: number;
}

const rotationAnglesCache: Record<string, number> = {};

const getRotationAngle = (id: string) => {
    if (rotationAnglesCache[id] !== undefined) {
        return rotationAnglesCache[id];
    }
    let sum = 0;
    for (let i = 0; i < id.length; i++) {
        sum += id.charCodeAt(i);
    }
    const angle = (sum % 21) - 10;
    rotationAnglesCache[id] = angle;
    return angle;
};


const DraggableImage = memo(function DraggableImage({
    image,
    position,
    imageWidthPercent,
    imageHeightPercent,
}: DraggableImageProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: String(image.fileId),
    });

    const rotationAngle = getRotationAngle(image.fileId);

    const style = {
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${imageWidthPercent}%`,
        height: `${imageHeightPercent}%`,
        zIndex: isDragging ? 1000 : position.zIndex,
        transform: transform
            ? `translate(${transform.x}px, ${transform.y}px) rotate(${rotationAngle}deg)`
            : `rotate(${rotationAngle}deg)`,
        position: "absolute" as const,
        boxShadow:
            "0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(0, 0, 255, 0.6)",
        opacity: isDragging ? 0.8 : 1,
        transition: isDragging ? "none" : "transform 0.2s ease",
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="ring-offset-white img-frame hover-glow transition-transform ease-in-out duration-300 shadow-xl drop-bounce"
            {...listeners}
            {...attributes}
        >
            <div className="absolute top-1 right-1 text-sm">🧷</div>
            <img
                src={image.url}
                alt={image.name}
                className="w-full h-full object-contain rounded-md"
            />
        </div>
    );
});

export default DraggableImage;
