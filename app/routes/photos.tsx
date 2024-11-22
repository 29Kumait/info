// import React, { useEffect, useRef, useState } from "react";
// import type { ActionFunction, LoaderFunction } from "@remix-run/node";
// import { Outlet, useFetcher, useLoaderData } from "@remix-run/react";
// import invariant from "tiny-invariant";
// import ImageKit from "imagekit";
// import {
//     DndContext,
//     DragEndEvent,
//     PointerSensor,
//     useDraggable,
//     useSensor,
//     useSensors,
// } from "@dnd-kit/core";
// import { restrictToParentElement } from "@dnd-kit/modifiers";
//
// interface Image {
//     fileId: string;
//     name: string;
//     url: string;
// }
//
// interface Position {
//     x: number;
//     y: number;
//     zIndex: number;
// }
//
// interface LoaderData {
//     images: Image[];
//     positions: Record<string, Position>;
// }
//
// export const loader: LoaderFunction = async ({ request }) => {
//     invariant(process.env.IMAGEKIT_PUBLIC_KEY,
//         "IMAGEKIT_PUBLIC_KEY is required"
//     );
//     invariant(
//         process.env.IMAGEKIT_PRIVATE_KEY,
//         "IMAGEKIT_PRIVATE_KEY is required"
//     );
//     invariant(
//         process.env.IMAGEKIT_URL_ENDPOINT,
//         "IMAGEKIT_URL_ENDPOINT is required"
//     );
//
//     const imagekit = new ImageKit({
//         publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
//         privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
//         urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
//     });
//
//     const files = await imagekit.listFiles({});
//     const imagePositions: Record<string, Position> = {};
//
//     files.forEach((image, index) => {
//         if (!imagePositions[image.fileId]) {
//             const xPercent = 20 + Math.random() * 20;
//             const yPercent = 30 + Math.random() * 20;
//             imagePositions[image.fileId] = {
//                 x: xPercent,
//                 y: yPercent,
//                 zIndex: index + 1,
//             };
//         }
//     });
//
//     return { images: files, positions: imagePositions };
// };
//
// export const action: ActionFunction = async ({ request }) => {
//     const formData = await request.formData();
//     const imageId = formData.get("imageId") as string;
//     const positionData = formData.get("position") as string;
//
//     if (!imageId || !positionData) {
//         throw new Error("Invalid data");
//     }
//
//     const position: Position = JSON.parse(positionData);
//
//     return { positions: { [imageId]: position } };
//
// };
//
// const rotationAnglesCache: Record<string, number> = {};
//
// const getRotationAngle = (id: string) => {
//     if (rotationAnglesCache[id] !== undefined) {
//         return rotationAnglesCache[id];
//     }
//     let sum = 0;
//     for (let i = 0; i < id.length; i++) {
//         sum += id.charCodeAt(i);
//     }
//     const angle = (sum % 21) - 10;
//     rotationAnglesCache[id] = angle;
//     return angle;
// };
//
// export default function Photos() {
//     const { images, positions } = useLoaderData<LoaderData>();
//     const fetcher = useFetcher();
//
//     const [imagePositions, setImagePositions] = useState<Record<string, Position>>(
//         positions
//     );
//
//     const containerRef = useRef<HTMLDivElement>(null);
//
//     const sensors = useSensors(
//         useSensor(PointerSensor, {
//             activationConstraint: {
//                 distance: 5,
//             },
//         })
//     );
//
//     const imageWidthPercent = 18;
//     const imageHeightPercent = 36;
//
//     const [hydrated, setIsHydrated] = useState(false);
//
//     useEffect(() => {
//         setIsHydrated(true);
//     }, []);
//
//     const handleDragEnd = (event: DragEndEvent) => {
//         const { active, delta } = event;
//
//         const id = String(active.id);
//         const position = imagePositions[id];
//
//         if (!position || !containerRef.current) return;
//
//
//         const containerRect = containerRef.current.getBoundingClientRect();
//
//         const xPercent = position.x + (delta.x / containerRect.width) * 100;
//         const yPercent = position.y + (delta.y / containerRect.height) * 100;
//
//         const newX = Math.max(0, Math.min(100 - imageWidthPercent, xPercent));
//         const newY = Math.max(0, Math.min(100 - imageHeightPercent, yPercent));
//
//         const maxZIndex = Math.max(
//             ...Object.values(imagePositions).map((pos) => pos.zIndex)
//         );
//
//         const newPosition = {
//             x: newX,
//             y: newY,
//             zIndex: maxZIndex + 1,
//         };
//
//         setImagePositions((prevPositions) => ({
//             ...prevPositions,
//             [id]: newPosition,
//         }));
//
//         if (hydrated) {
//             const formData = new FormData();
//             formData.append("imageId", id);
//             formData.append("position", JSON.stringify(newPosition));
//             fetcher.submit(formData, { method: "post" });
//         }
//     };
//
//     return (
//         <div className="relative w-full rounded-lg z-10 bg-cover">
//             {hydrated ? (
//                 <DndContext
//                     sensors={sensors}
//                     onDragEnd={handleDragEnd}
//                     modifiers={[restrictToParentElement]}
//                 >
//                     <div
//                         ref={containerRef}
//                         id="image-container"
//                         className="relative mx-auto p-4 w-full max-w-[1229px] h-[500px] overflow-hidden shadow-2xl inset-0 bg-cover bg-center bg-no-repeat z-0 rounded-xl"
//                         style={{
//                             backgroundImage: "url('/board.tiff')",
//                             boxShadow:
//                                 "0 0 60px rgba(255, 255, 255, 0.9), 0 0 80px rgba(0, 0, 255, 0.6)",
//                         }}
//                     >
//                         {images.map((image) => {
//                             const position = imagePositions[image.fileId];
//                             const rotationAngle = getRotationAngle(image.fileId);
//                             return (
//                                 <DraggableImage
//                                     key={image.fileId}
//                                     image={image}
//                                     position={position}
//                                     rotationAngle={rotationAngle}
//                                     imageWidthPercent={imageWidthPercent}
//                                     imageHeightPercent={imageHeightPercent}
//                                 />
//                             );
//                         })}
//                     </div>
//                 </DndContext>
//             ) : (
//                 // placeholder 4 SSR
//                 <div
//                     ref={containerRef}
//                     id="image-container"
//                     className="relative mx-auto p-4 w-full max-w-[1229px] h-[500px] overflow-hidden shadow-2xl inset-0 bg-cover bg-center bg-no-repeat z-0 rounded-xl"
//                     style={{
//                         backgroundImage: "url('/board.tiff')",
//                         boxShadow:
//                             "0 0 60px rgba(255, 255, 255, 0.9), 0 0 80px rgba(0, 0, 255, 0.6)",
//                     }}
//                 >
//
//                 </div>
//             )}
//             <Outlet />
//         </div>
//     );
// }
//
// interface DraggableImageProps {
//     image: Image;
//     position: Position;
//     rotationAngle: number;
//     imageWidthPercent: number;
//     imageHeightPercent: number;
// }
//
// const DraggableImage = React.memo(function DraggableImage({
//     image,
//     position,
//     rotationAngle,
//     imageWidthPercent,
//     imageHeightPercent,
// }: DraggableImageProps) {
//     const { attributes, listeners, setNodeRef, transform, isDragging } =
//         useDraggable({
//             id: String(image.fileId),
//         });
//
//     const style = {
//         left: `${position.x}%`,
//         top: `${position.y}%`,
//         width: `${imageWidthPercent}%`,
//         height: `${imageHeightPercent}%`,
//         zIndex: isDragging ? 1000 : position.zIndex,
//         transform: transform
//             ? `translate(${transform.x}px, ${transform.y}px) rotate(${rotationAngle}deg)`
//             : `rotate(${rotationAngle}deg)`,
//         position: "absolute" as const,
//         boxShadow:
//             "0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(0, 0, 255, 0.6)",
//         opacity: isDragging ? 0.8 : 1,
//         transition: isDragging ? "none" : "transform 0.2s ease",
//     };
//
//     return (
//         <div
//             ref={setNodeRef}
//             style={style}
//             className="ring-offset-white img-frame hover-glow transition-transform ease-in-out duration-300 shadow-xl drop-bounce"
//             {...listeners}
//             {...attributes}
//         >
//             <div className="absolute top-1 right-1 text-sm">🧷</div>
//             <img
//                 src={image.url}
//                 alt={image.name}
//                 className="w-full h-full object-contain rounded-md"
//             />
//         </div>
//     );
// });
//
//
