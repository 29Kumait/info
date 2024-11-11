import {
    useSearchParams,
    useLoaderData,
    NavLink,
    Outlet,
} from "@remix-run/react";
import { connectDB } from "~/db/mongoDB.server";
import invariant from "tiny-invariant";

export interface Feature {
    [key: string]: string;
}

export interface App {
    id: string;
    title: string;
    deployment: string;
    github: string;
    overview: string;
    description: string;
    features?: Feature[];
    technologiesUsed?: string[];
    installation?: string;
    usage?: string;
}

interface LoaderData {
    apps: App[];
}

export const loader = async () => {
    const { db } = await connectDB();
    invariant(db, "Failed to connect to the database");

    const data = await db.collection("app").findOne<{ apps: App[] }>({});
    invariant(data, "No data found in the database");

    return ({ apps: data.apps });
};

export default function AppData() {
    const { apps } = useLoaderData<LoaderData>();

    if (!apps || apps.length === 0) {
        return <div>No applications available.</div>;
    }

    const [searchParams] = useSearchParams();
    const appId = searchParams.get("appId");
    const activeApp = apps.find((app) => app.id === appId) || apps[0];

    return (
        <div
            className="mt-12 bg-cover bg-center"
            style={{
                backgroundImage: "url('/GlassBackground.jpg')",
                boxShadow:
                    "0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(0, 0, 255, 0.6)",
            }}
        >
            <nav className="justify-between border-b border-[#50e5ff] flex mb-8 overflow-x-auto relative z-10">
                {apps.map((app) => (
                    <NavLink
                        key={app.id}
                        prefetch="intent"
                        to={`?appId=${app.id}`}
                        preventScrollReset
                        className={({ isActive }) =>
                            `whitespace-nowrap mt-3 mr-2 md:mr-4 px-4 py-2 md:px-6 md:py-3 ${isActive
                                ? "border-b-4 border-[#7ab6ff] text-blue-100"
                                : "text-[#6382b3] hover:text-[#50e5ff]"
                            }`
                        }
                    >
                        {app.github}
                    </NavLink>
                ))}
            </nav>

            <div className="max-w-5xl mx-auto p-8 m-5 relative mt-24">
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div
                        className="w-full h-full rounded-xl animate-borderGlowOnce"
                        style={{
                            background:
                                "linear-gradient(90deg, rgba(4, 9, 20, 0.9), rgba(3, 11, 25, 0.5), rgba(0,255,255,0.5), rgba(50, 50, 80, 0.8), rgba(12, 27, 52, 0.8), rgba(10, 10, 20, 0.9))",
                            backgroundSize: "200% 200%",
                        }}
                    ></div>
                </div>

                <div className="relative z-10 p-8 rounded-xl shadow-lg bg-gray-900/60">
                    <div
                        className="text-center prose-xl md:text-3xl lg:text-5xl text-blue-100 mb-28 mt-24 animated-border p-6 max-w-screen-xl w-full border border-gray-200 rounded-xl shadow-md transition-shadow duration-200 ease-in-out hover:shadow-lg"
                        style={{
                            boxShadow:
                                "0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(0, 0, 255, 0.6)",
                        }}
                    >
                        <h1>{activeApp.title}</h1>
                        <div
                            key={activeApp.id}
                            className="relative w-full overflow-hidden rounded-lg bg-gray-800 aspect-w-16 aspect-h-9 mb-28"
                        >
                            <iframe
                                src={activeApp.deployment}
                                title={activeApp.title}
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                allow="autoplay; fullscreen"
                                allowFullScreen
                                loading="lazy"
                            />
                        </div>
                    </div>

                    <div
                        className="text-center text-xl md:text-3xl lg:text-5xl text-blue-100 mb-16 mt-12 p-4 max-w-screen-lg w-full border border-gray-200 rounded-lg shadow-md transition-shadow duration-200 ease-in-out hover:shadow-lg grid grid-cols-1 md:grid-cols-2 gap-4"
                        style={{
                            boxShadow:
                                "0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(0, 0, 255, 0.4)",
                        }}
                    >
                        <div>{activeApp.overview}</div>
                        {activeApp.features && activeApp.features.map((feature, index) => {
                            const [title, description] = Object.entries(feature)[0];
                            return (
                                <div key={index} className="bg-gray-700 p-4 rounded">
                                    <h4 className="text-lg font-semibold">{title}</h4>
                                    <p className="text-sm">{description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div
                    className="text-center text-xl md:text-3xl lg:text-5xl text-blue-100 mb-16 mt-12 p-4 max-w-screen-lg w-full border border-gray-200 rounded-lg shadow-md transition-shadow duration-200 ease-in-out hover:shadow-lg overflow-hidden"
                    style={{
                        boxShadow:
                            "0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(0, 0, 255, 0.4)",
                    }}   >
                    <div className="mb-8">{activeApp.overview}</div>
                    {activeApp.features && activeApp.features.length > 0 ? (
                        <div className="animate-marquee flex space-x-8">
                            {activeApp.features.map((feature, index) => {
                                const [title] = Object.entries(feature)[0];
                                return (
                                    <div
                                        key={index}
                                        className="bg-gray-700 p-4 rounded-lg shadow-inner flex-shrink-0 w-64 sm:w-72 md:w-80"
                                    >
                                        <h4 className="text-lg font-semibold break-words">
                                            {title}
                                        </h4>
                                    </div>
                                );
                            })}
                            {activeApp.features.map((feature, index) => {
                                const [title] = Object.entries(feature)[0];
                                return (
                                    <div
                                        key={`dup-${index}`}
                                        className="bg-gray-700 p-4 rounded-lg shadow-inner flex-shrink-0 w-64 sm:w-72 md:w-80"
                                    >
                                        <h4 className="text-lg font-semibold break-words">
                                            {title}
                                        </h4>                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-gray-400 italic">
                            Currently, there are no features to display for this application.
                        </div>
                    )}
                </div>
                <Outlet />
            </div>
        </div>
    );
}
