// import {json} from "@remix-run/node";
// import {useLoaderData , useFetcher , Outlet} from "@remix-run/react";
// import type {LoaderFunctionArgs , ActionFunctionArgs} from "@remix-run/node";
// import {connectDB} from "~/db/mongoDB.server";
// import {slideCookie} from "~/cookies";
//
// type Playlist = {
//     year: number;
//     url: string;
//     embedUrl: string;
// };
//
// type LoaderData = {
//     playlists: Playlist[];
//     slideIndex: number;
// };
//
// export const loader = async ({request}: LoaderFunctionArgs) => {
//     const {db} = await connectDB ();
//     const cookieHeader = request.headers.get ("Cookie");
//     const {slideIndex = 0} = (await slideCookie.parse (cookieHeader)) || {};
//
//     const data = await db.collection ("music").findOne ({"profile.username": "Com8"});
//     const playlists: Playlist[] = data?.playlists || [];
//
//     const updatedPlaylists = playlists.map ((playlist) => ({
//         ...playlist ,
//         embedUrl: playlist.url.replace ("music.apple.com" , "embed.music.apple.com") ,
//     }));
//
//     return json<LoaderData> ({playlists: updatedPlaylists , slideIndex});
// };
//
// export const action = async ({request}: ActionFunctionArgs) => {
//     const cookieHeader = request.headers.get ("Cookie");
//     const cookie = (await slideCookie.parse (cookieHeader)) || {};
//     const formData = await request.formData ();
//
//     const direction = parseInt (formData.get ("direction") as string , 10);
//     const totalSlides = parseInt (formData.get ("totalSlides") as string , 10);
//     let slideIndex = parseInt (cookie.slideIndex || "0" , 10);
//
//     slideIndex = (slideIndex + direction + totalSlides) % totalSlides;
//
//     cookie.slideIndex = slideIndex;
//
//     return json ({slideIndex} , {
//         headers: {
//             "Set-Cookie": await slideCookie.serialize (cookie) ,
//         } ,
//     });
// };
//
// const SvgArrow = ({direction}: { direction: "left" | "right" }) => {
//     const d = direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7";
//     return (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6 sm:h-8 sm:w-8"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={ 2 }
//         >
//             <path strokeLinecap="round" strokeLinejoin="round" d={ d }/>
//         </svg>
//     );
// };
//
// export default function PlaylistsSlides() {
//     const {playlists , slideIndex} = useLoaderData<LoaderData> ();
//     const fetcher = useFetcher ();
//
//     const optimisticSlideIndex =
//         (fetcher.data as LoaderData)?.slideIndex ??
//         parseInt (fetcher.formData?.get ("slideIndex") as string , 10) ??
//         slideIndex;
//
//     const playlistsPerSlide = 1;
//     const totalPlaylists = playlists.length;
//     const totalSlides = Math.ceil (totalPlaylists / playlistsPerSlide);
//     const slideWidth = totalSlides > 0 ? 100 / totalSlides : 100;
//
//     const slides = Array.from ({length: totalSlides} , (_ , index) =>
//         playlists.slice (index * playlistsPerSlide , (index + 1) * playlistsPerSlide)
//     );
//
//     return (
//         <div
//             className="mt-8 mb-8 p-6 w-full text-gray-100 relative bg-cover bg-center"
//             style={ {
//                 backgroundImage: "url('/b.jpg')" ,
//                 boxShadow: "0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(0, 0, 255, 0.6)" ,
//
//             } }
//         >
//             <div className="text-center text-2xl sm:text-4xl mb-4 sm:mb-8">Playlists</div>
//
//             <div className="relative overflow-hidden w-full px-2 sm:px-6">
//                 <div
//                     className="flex transition-transform duration-500 ease-in-out"
//                     style={ {
//                         transform: `translateX(-${ optimisticSlideIndex * slideWidth }%)` ,
//                         width: `${ totalSlides * 100 }%` ,
//                     } }
//                 >
//                     { slides.map ((slidePlaylists , index) => (
//                         <div
//                             key={ index }
//                             className="flex flex-shrink-0 flex-wrap justify-center items-center"
//                             style={ {width: `${ slideWidth }%`} }
//                         >
//                             { slidePlaylists.map ((playlist , index) => (
//                                 <div
//                                     key={ `${ playlist.year }-${ index }` }
//                                     className="p-2 w-full sm:w-1/2 flex-none"
//                                 >
//                                     <div
//                                         className="bg-white bg-opacity-20 rounded-lg shadow-glow hover-glow transition-transform transform hover:scale-105 mx-auto">
//                                         <div
//                                             className="relative w-full pb-[56.25%] sm:pb-[75%] overflow-hidden rounded-lg bg-gray-800">
//                                             <iframe
//                                                 allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
//                                                 className="absolute top-0 left-0 w-full h-full rounded-lg"
//                                                 title={ `Playlist ${ playlist.year }` }
//                                                 src={ playlist.embedUrl }
//                                                 loading="lazy"
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             )) }
//                         </div>
//                     )) }
//                 </div>
//             </div>
//
//             <div className="flex justify-center items-center mt-6 sm:mt-12">
//                 <fetcher.Form method="post">
//                     <input type="hidden" name="totalSlides" value={ totalSlides }/>
//                     <button
//                         type="submit"
//                         name="direction"
//                         value="-1"
//                         className="mx-2 sm:mx-4 p-2 sm:p-3 rounded-full hover:bg-gray-300 hover:text-black transition-colors"
//                         aria-label="Previous Slide"
//                     >
//                         <SvgArrow direction="left"/>
//                     </button>
//                     <button
//                         type="submit"
//                         name="direction"
//                         value="1"
//                         className="mx-2 sm:mx-4 p-2 sm:p-3 rounded-full hover:bg-gray-300 hover:text-black transition-colors"
//                         aria-label="Next Slide"
//                     >
//                         <SvgArrow direction="right"/>
//                     </button>
//                 </fetcher.Form>
//             </div>
//             <Outlet/>
//         </div>
//     );
// }
