import { json } from "@remix-run/node";
import {useLoaderData , useFetcher , Outlet} from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import ImageKit from "imagekit";
import { getSession, commitSession } from "~/sessions.server";
import React from "react";

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

interface LoaderData {
    images: Image[];
    positions: Record<string, Position>;
}

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));

    const imagePositions: Record<string, Position> =
        session.get("imagePositions") || {};

    invariant(process.env.IMAGEKIT_PUBLIC_KEY, "IMAGEKIT_PUBLIC_KEY is required");
    invariant(
        process.env.IMAGEKIT_PRIVATE_KEY,
        "IMAGEKIT_PRIVATE_KEY is required"
    );
    invariant(
        process.env.IMAGEKIT_URL_ENDPOINT,
        "IMAGEKIT_URL_ENDPOINT is required"
    );

    const imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
    });

    const files = await imagekit.listFiles({});

    files.forEach((image, index) => {
        if (!imagePositions[image.fileId]) {
            const xPercent = 20 + Math.random() * 20;
            const yPercent = 30 + Math.random() * 20;
            imagePositions[image.fileId] = {
                x: xPercent,
                y: yPercent,
                zIndex: index + 1,
            };
        }
    });

    session.set("imagePositions", imagePositions);

    return json<LoaderData>(
        { images: files, positions: imagePositions },
        {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        }
    );
};

export const action: ActionFunction = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const { id, x, y } = data;

    invariant(typeof id === "string", "id must be a string");
    invariant(typeof x === "string", "x must be a string");
    invariant(typeof y === "string", "y must be a string");

    const imagePositions: Record<string, Position> =
        session.get("imagePositions") || {};

    const newX = Math.max(0, Math.min(100 - 18, Number(x)));
    const newY = Math.max(0, Math.min(100 - 36, Number(y)));

    const maxZIndex = Math.max(
        ...Object.values(imagePositions).map((pos) => pos.zIndex || 0)
    );

    imagePositions[id] = { x: newX, y: newY, zIndex: maxZIndex + 1 };
    session.set("imagePositions", imagePositions);

    return json(
        { positions: imagePositions },
        {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        }
    );
};
export default function Photos() {
    const { images, positions } = useLoaderData<LoaderData>();
    const fetcher = useFetcher();

    const imageWidth = 180;
    const imageHeight = 180;

    const imageWidthPercent = (imageWidth / 1000) * 100; // percentage based on container
    const imageHeightPercent = (imageHeight / 500) * 100;

    const imagePositions = { ...positions };

    if (fetcher.formData) {
        const data = Object.fromEntries(fetcher.formData);
        const { id, x, y } = data;

        if (id && x && y) {
            const newX = Math.max(0, Math.min(100 - imageWidthPercent, Number(x)));
            const newY = Math.max(0, Math.min(100 - imageHeightPercent, Number(y)));

            const maxZIndex = Math.max(
                ...Object.values(imagePositions).map((pos) => pos.zIndex)
            );

            imagePositions[id as string] = {
                x: newX,
                y: newY,
                zIndex: maxZIndex + 1,
            };
        }
    }

    const handleDragStart = (e: React.DragEvent<HTMLFormElement>, id: string) => {
        e.dataTransfer.setData("text/plain", id);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain");
        const rect = e.currentTarget.getBoundingClientRect();

        const xPercent = ((e.clientX - rect.left - imageWidth / 2) / rect.width) * 100;
        const yPercent = ((e.clientY - rect.top - imageHeight / 2) / rect.height) * 100;

        const formData = new FormData();
        formData.append("id", id);
        formData.append("x", String(xPercent));
        formData.append("y", String(yPercent));
        fetcher.submit(formData, { method: "post" });
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const getRotationAngle = (id: string) => {
        let sum = 0;
        for (let i = 0; i < id.length; i++) {
            sum += id.charCodeAt(i);
        }
        return (sum % 21) - 10;
    };

    return (
        <div className="relative mt-52 w-full rounded-lg z-10">
            <div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                    boxShadow: '0 0 60px rgba(255, 255, 255, 0.9), 0 0 100px rgba(255, 255, 255, 0.5)',
                    filter: 'blur(12px)',
                    zIndex: -1,
                }}
            ></div>
            <div
                className="relative mx-auto p-4 w-full max-w-[1229px] h-[500px] overflow-hidden rounded-lg shadow-2xl"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{
                    boxShadow: 'inset 0 0 20px rgba(0, 0, 255, 0.7)',
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: "url('/board.tiff')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        zIndex: 0,
                    }}
                ></div>
                {images.map((image) => {
                    const position = imagePositions[image.fileId];
                    const rotationAngle = getRotationAngle(image.fileId);

                    return (
                        <fetcher.Form
                            method="post"
                            key={image.fileId}
                            className="ring-offset-white absolute img-frame hover-glow transition-transform ease-in-out duration-300 cursor-move hover:scale-110 shadow-xl"
                            style={{
                                left: `${position.x}%`,
                                top: `${position.y}%`,
                                width: `${imageWidthPercent}%`, // image frame
                                height: `${imageHeightPercent}%`,
                                zIndex: position.zIndex,
                                transform: `rotate(${rotationAngle}deg)`,
                                boxShadow: '0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(0, 0, 255, 0.6)', // Stronger glow for individual images
                            }}
                            draggable
                            onDragStart={(e) => handleDragStart(e, image.fileId)}
                        >
                            <div className="absolute top-1 right-1 text-sm">🧷</div> {/* Smaller emoji */}
                            <img
                                src={image.url}
                                alt={image.name}
                                className="w-full h-full object-contain rounded-md"
                            />
                        </fetcher.Form>
                    );
                })}
            </div>
            <Outlet/>
        </div>
    );
}
