import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";import { connectDB } from "~/db/mongoDB.server";
import { slideCookie } from "~/cookies";

type Playlist = {
    year: number;
    url: string;
    embedUrl: string;
};

type LoaderData = {
    playlists: Playlist[];
    slideIndex: number;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { db } = await connectDB();
    const cookieHeader = request.headers.get("Cookie");
    const { slideIndex = 0 } = (await slideCookie.parse(cookieHeader)) || {};

    const data = await db
        .collection("music")
        .findOne({ "profile.username": "Com8" });
    const playlists: Playlist[] = data?.playlists || [];

    const updatedPlaylists = playlists.map((playlist) => ({
        ...playlist,
        embedUrl: playlist.url.replace("music.apple.com", "embed.music.apple.com"),
    }));

    return json<LoaderData>({ playlists: updatedPlaylists, slideIndex });
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await slideCookie.parse(cookieHeader)) || {};
    const formData = await request.formData();

    const direction = parseInt(formData.get("direction") as string, 10);
    const totalSlides = parseInt(formData.get("totalSlides") as string, 10);
    let slideIndex = parseInt(cookie.slideIndex || "0", 10);

    //  slide index update via looping
    slideIndex = (slideIndex + direction + totalSlides) % totalSlides;

    // then store in the cookie
    cookie.slideIndex = slideIndex;

    return json({ slideIndex }, {
        headers: {
            "Set-Cookie": await slideCookie.serialize(cookie),
        },
    });
};


export default function PlaylistsSlides() {
    const { playlists, slideIndex } = useLoaderData<LoaderData>();
    const fetcher = useFetcher();

    // Optimistic UI update
    const optimisticSlideIndex =
        (fetcher.data as LoaderData)?.slideIndex ??
        parseInt(fetcher.formData?.get("slideIndex") as string, 10) ??
        slideIndex;

    const playlistsPerSlide: number = 2;
    const totalPlaylists = playlists.length;
    const totalSlides = Math.ceil(totalPlaylists / playlistsPerSlide);
    const slideWidth = totalSlides > 0 ? 100 / totalSlides : 100;

    //  playlists within slides
    const slides = Array.from({ length: totalSlides }, (_, index) =>
        playlists.slice(
            index * playlistsPerSlide,
            (index + 1) * playlistsPerSlide
        )
    );

    return (
        <div
            className="mt-8 p-6 w-full text-gray-100 relative"
            style={{
                backgroundImage: "url('/b.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="text-center text-2xl sm:text-4xl mb-4 sm:mb-8">Playlists</div>

            <div className="relative overflow-hidden w-full px-2 sm:px-6">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(-${optimisticSlideIndex * slideWidth}%)`,
                        width: `${totalSlides * 100}%`,
                    }}
                >
                    {slides.map((slidePlaylists, index) => (
                        <div
                            key={index}
                            className="flex flex-shrink-0 flex-wrap justify-center items-center"
                            style={{ width: `${slideWidth}%` }}
                        >
                            {slidePlaylists.map((playlist) => (
                                <div
                                    key={playlist.year}
                                    className="p-2 w-full sm:w-1/2 flex-none"
                                >
                                    <div className="bg-white bg-opacity-20 rounded-lg shadow-glow hover-glow transition-transform transform hover:scale-105 mx-auto">
                                        <div className="relative w-full pb-[56.25%] sm:pb-[75%] overflow-hidden rounded-lg bg-gray-800">
                                            <iframe
                                                allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
                                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                                title={`Playlist ${playlist.year}`}
                                                src={playlist.embedUrl}
                                                style={{ border: 0 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center items-center mt-6 sm:mt-12">
                <fetcher.Form method="post">
                    <input type="hidden" name="totalSlides" value={totalSlides} />
                    <button
                        type="submit"
                        name="direction"
                        value="-1"
                        className="mx-2 sm:mx-4 p-2 sm:p-3 rounded-full hover:bg-gray-300 hover:text-black transition-colors"
                        aria-label="Previous Slide"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 sm:h-8 sm:w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <button
                        type="submit"
                        name="direction"
                        value="1"
                        className="mx-2 sm:mx-4 p-2 sm:p-3 rounded-full hover:bg-gray-300 hover:text-black transition-colors"
                        aria-label="Next Slide"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 sm:h-8 sm:w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={ 2 }
                        >
                            <path d="M16.3944 12.0001L10 16.263V7.7371L16.3944 12.0001ZM19.3759 11.584L8.7773 4.5183C8.5476 4.3651 8.2371 4.4272 8.0839 4.6569C8.0292 4.7391 8 4.8356 8 4.9343V19.0658C8 19.342 8.2239 19.5658 8.5 19.5658C8.5987 19.5658 8.6952 19.5366 8.7773 19.4818L19.3759 12.4161C19.6057 12.2629 19.6678 11.9524 19.5146 11.7227C19.478 11.6678 19.4309 11.6206 19.3759 11.584Z"></path>

                        </svg>
                    </button>
                </fetcher.Form>
            </div>
        </div>
    );
}
