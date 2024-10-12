import React from "react";
import {json} from "@remix-run/node";
import {useLoaderData , useFetcher , Outlet} from "@remix-run/react";
import type {LoaderFunction , ActionFunction} from "@remix-run/node";
import invariant from "tiny-invariant";
import ImageKit from "imagekit";
import {getSession , commitSession} from "~/sessions.server";


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
    positions: Record<string , Position>;
}

export const loader: LoaderFunction = async ({request}) => {
    const session = await getSession (request.headers.get ("Cookie"));

    const imagePositions: Record<string , Position> =
        session.get ("imagePositions") || {};

    invariant (process.env.IMAGEKIT_PUBLIC_KEY , "IMAGEKIT_PUBLIC_KEY is required");
    invariant (
        process.env.IMAGEKIT_PRIVATE_KEY ,
        "IMAGEKIT_PRIVATE_KEY is required"
    );
    invariant (
        process.env.IMAGEKIT_URL_ENDPOINT ,
        "IMAGEKIT_URL_ENDPOINT is required"
    );

    const imagekit = new ImageKit ({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string ,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string ,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string ,
    });

    const files = await imagekit.listFiles ({});

    files.forEach ((image , index) => {
        if (!imagePositions[image.fileId]) {
            const xPercent = 20 + Math.random () * 20;
            const yPercent = 30 + Math.random () * 20;
            imagePositions[image.fileId] = {
                x: xPercent ,
                y: yPercent ,
                zIndex: index + 1 ,
            };
        }
    });

    session.set ("imagePositions" , imagePositions);

    return json<LoaderData> (
        {images: files , positions: imagePositions} ,
        {
            headers: {
                "Set-Cookie": await commitSession (session) ,
            } ,
        }
    );
};

const normalizeZIndex = (imagePositions: Record<string , Position>) => {
    const sortedIds = Object.keys (imagePositions).sort ((a , b) => imagePositions[a].zIndex - imagePositions[b].zIndex);
    sortedIds.forEach ((imgId , index) => {
        imagePositions[imgId].zIndex = index + 1;
    });
};

export const action: ActionFunction = async ({request}) => {
    const session = await getSession (request.headers.get ("Cookie"));
    const formData = await request.formData ();
    const {id , x , y} = Object.fromEntries (formData);

    invariant (typeof id === "string" , "id must be a string");
    invariant (typeof x === "string" , "x must be a string");
    invariant (typeof y === "string" , "y must be a string");

    const imagePositions: Record<string , Position> =
        session.get ("imagePositions") || {};

    const imageWidthPercent = 18;
    const imageHeightPercent = 36;
    const margin = 5;

    const newX = Math.max (margin , Math.min (100 - imageWidthPercent - margin , Number (x)));
    const newY = Math.max (margin , Math.min (100 - imageHeightPercent - margin , Number (y)));

    const maxZIndex = Math.max (
        ...Object.values (imagePositions).map ((pos) => pos.zIndex || 0)
    );

    imagePositions[id] = {x: newX , y: newY , zIndex: maxZIndex + 1};

    if (maxZIndex > 129) {
        normalizeZIndex (imagePositions);
    }

    session.set ("imagePositions" , imagePositions);

    return json (
        {positions: imagePositions} ,
        {
            headers: {
                "Set-Cookie": await commitSession (session) ,
            } ,
        }
    );
};


interface TouchData {
    startX: number;
    startY: number;
    imageLeft: number;
    imageTop: number;
}

export default function Photos() {
    const {images , positions} = useLoaderData<LoaderData> ();
    const fetcher = useFetcher ();

    const imageWidth = 180;
    const imageHeight = 180;

    const imageWidthPercent = (imageWidth / 1000) * 100; // percentage based on container
    const imageHeightPercent = (imageHeight / 500) * 100;

    const imagePositions = JSON.parse (JSON.stringify (positions));

    if (fetcher.formData) {
        const {id , x , y} = Object.fromEntries (fetcher.formData);

        if (id && x && y) {
            const newX = Math.max (0 , Math.min (100 - imageWidthPercent , Number (x)));
            const newY = Math.max (0 , Math.min (100 - imageHeightPercent , Number (y)));

            const maxZIndex = Math.max (
                ...Object.values (imagePositions).map ((pos) => (pos as Position).zIndex)
            );

            imagePositions[id as string] = {
                x: newX ,
                y: newY ,
                zIndex: maxZIndex + 1 ,
            };
        }
    }

    const touchDataRef = React.useRef<Record<string , TouchData>> ({});

    const handleDragStart = (e: React.DragEvent<HTMLFormElement> , id: string) => {
        e.dataTransfer.setData ("text/plain" , id);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault ();
        const id = e.dataTransfer.getData ("text/plain");
        const rect = e.currentTarget?.getBoundingClientRect ();
        if (!rect) return;

        const xPercent = ((e.clientX - rect.left - imageWidth / 2) / rect.width) * 100;
        const yPercent = ((e.clientY - rect.top - imageHeight / 2) / rect.height) * 100;


        const formData = new FormData ();
        formData.append ("id" , id);
        formData.append ("x" , String (xPercent));
        formData.append ("y" , String (yPercent));
        fetcher.submit (formData , {method: "post"});
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault ();
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLFormElement> , id: string) => {
        const touch = e.touches[0];
        if (!touch) return;

        const rect = e.currentTarget.getBoundingClientRect ();
        touchDataRef.current[id] = {
            startX: touch.clientX ,
            startY: touch.clientY ,
            imageLeft: rect.left ,
            imageTop: rect.top ,
        };
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLFormElement> , id: string) => {
        e.preventDefault ();

        const touch = e.touches[0];
        if (!touch) return;

        const data = touchDataRef.current[id];
        if (!data) return;

        const deltaX = touch.clientX - data.startX;
        const deltaY = touch.clientY - data.startY;

        e.currentTarget.style.transform = `translate(${ deltaX }px, ${ deltaY }px)`;
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLFormElement> , id: string) => {
        e.preventDefault ();

        const data = touchDataRef.current[id];
        if (!data) return;

        const touch = e.changedTouches[0];
        if (!touch) return;

        const deltaX = touch.clientX - data.startX;
        const deltaY = touch.clientY - data.startY;

        const containerRect = e.currentTarget.parentElement?.getBoundingClientRect ();
        if (!containerRect) return;

        const imageLeft = data.imageLeft - containerRect.left + deltaX;
        const imageTop = data.imageTop - containerRect.top + deltaY;

        const xPercent = (imageLeft / containerRect.width) * 100;
        const yPercent = (imageTop / containerRect.height) * 100;


        const formData = new FormData ();
        formData.append ("id" , id);
        formData.append ("x" , String (xPercent));
        formData.append ("y" , String (yPercent));
        fetcher.submit (formData , {method: "post"});

        e.currentTarget.style.transform = '';

        delete touchDataRef.current[id];
    };

    const rotationAnglesCache: Record<string , number> = {};

    const getRotationAngle = (id: string) => {
        if (rotationAnglesCache[id] !== undefined) {
            return rotationAnglesCache[id];
        }
        let sum = 0;
        for (let i = 0; i < id.length; i++) {
            sum += id.charCodeAt (i);
        }
        const angle = (sum % 21) - 10;
        rotationAnglesCache[id] = angle;
        return angle;
    };

    return (
        <div className="relative mt-52 w-full rounded-lg z-10">
            <div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={ {
                    boxShadow: '0 0 60px rgba(255, 255, 255, 0.9), 0 0 100px rgba(255, 255, 255, 0.5)' ,
                    filter: 'blur(12px)' ,
                    zIndex: -1 ,
                } }
            ></div>
            <div
                className="relative mx-auto p-4 w-full max-w-[1229px] h-[500px] overflow-hidden rounded-lg shadow-2xl"
                onDrop={ handleDrop }
                onDragOver={ handleDragOver }
                style={ {
                    boxShadow: 'inset 0 0 20px rgba(0, 0, 255, 0.7)' ,
                } }
            >
                <div
                    className="absolute inset-0"
                    style={ {
                        backgroundImage: "url('/board.tiff')" ,
                        backgroundSize: "cover" ,
                        backgroundPosition: "center" ,
                        zIndex: 0 ,
                    } }
                ></div>
                { images.map ((image) => {
                    const position = imagePositions[image.fileId];
                    const rotationAngle = getRotationAngle (image.fileId);

                    return (
                        <fetcher.Form
                            method="post"
                            key={ image.fileId }
                            className="ring-offset-white absolute img-frame hover-glow transition-transform ease-in-out duration-300 cursor-move hover:scale-110 shadow-xl drop-bounce"
                            style={ {
                                left: `${ position.x }%` ,
                                top: `${ position.y }%` ,
                                width: `${ imageWidthPercent }%` , // image frame
                                height: `${ imageHeightPercent }%` ,
                                zIndex: position.zIndex ,
                                transform: `rotate(${ rotationAngle }deg)` ,
                                boxShadow: '0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(0, 0, 255, 0.6)' ,
                            } }
                            draggable
                            onDragStart={ (e) => handleDragStart (e , image.fileId) }
                            onTouchStart={ (e) => handleTouchStart (e , image.fileId) }
                            onTouchMove={ (e) => handleTouchMove (e , image.fileId) }
                            onTouchEnd={ (e) => handleTouchEnd (e , image.fileId) }
                        >
                            <div className="absolute top-1 right-1 text-sm">🧷</div>
                            <img
                                src={ image.url }
                                alt={ image.name }
                                className="w-full h-full object-contain rounded-md"
                            />
                        </fetcher.Form>
                    );
                }) }
            </div>
            <Outlet/>
        </div>
    );
}



