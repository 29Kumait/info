import {json} from "@remix-run/node";
import {connectDB} from "~/db/mongoDB.server";
import {
    useLoaderData ,
    NavLink ,
    useSearchParams ,
    Outlet ,
    useNavigation ,
} from "@remix-run/react";
import invariant from "tiny-invariant";

interface App {
    id: string;
    title: string;
    deployment: string;
    github: string
}

interface LoaderData {
    apps: App[];
}

export const loader = async () => {
    const {db} = await connectDB ();
    invariant (db , "Failed to connect to the database");

    const data = await db.collection ("app").findOne<{ apps: App[] }> ({});
    invariant (data , "No data found in the database");

    return json ({apps: data.apps});
};

export default function AppData() {
    const {apps} = useLoaderData<LoaderData> ();
    const [searchParams] = useSearchParams ();
    const appId = searchParams.get ("appId");
    const activeApp = apps.find ((app) => app.id === appId) || apps[0];
    const navigation = useNavigation ();

    const isNavLinkPending = navigation.state === "loading";

    return (
        <div
            className="mt-12 bg-cover"
            style={ {
                backgroundImage: "url('/bg.jpg')" ,
                boxShadow:
                    "0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(0, 0, 255, 0.6)" ,
            } }
        >
            <h1 className="prose-2xl text-5xl md:text-6xl lg:text-9xl text-blue-100 m-6 lg:m-12">
                Projects
            </h1>
            <div className="max-w-5xl mx-auto p-8 m-5 relative">
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div
                        className={ `w-full h-full rounded-xl ${
                            isNavLinkPending ? "animate-borderGlowOnce" : ""
                        }` }
                        style={ {
                            background:
                                "linear-gradient(90deg, rgba(4, 9, 20, 0.9), rgba(3, 11, 25, 0.5), rgba(0,255,255,0.5), rgba(50, 50, 80, 0.8), rgba(12, 27, 52, 0.8), rgba(10, 10, 20, 0.9))" ,
                            backgroundSize: "200% 200%" ,
                        } }
                    ></div>
                </div>
                <div className="relative z-10 p-8 rounded-xl shadow-lg bg-gray-900/60">
                    { !isNavLinkPending && (
                        <div className="justify-between border-b border-[#FF507A] flex mb-8 overflow-x-auto">
                            { apps.map ((app) => {
                                const isActive = searchParams.get ("appId") === app.id;

                                return (
                                    <NavLink
                                        key={ app.id }
                                        prefetch="viewport"
                                        to={ `?appId=${ app.id }` }
                                        preventScrollReset
                                        className={ `whitespace-nowrap mr-2 md:mr-4 px-4 py-2 md:px-6 md:py-3 ${
                                            isActive
                                                ? "border-b-4 border-[#FF7A9A] text-[#FF507A]"
                                                : "text-[#BEE0DB] hover:text-[#FF7A9A]"
                                        }` }
                                    >
                                        { app.github }
                                    </NavLink>
                                );
                            }) }
                        </div>
                    ) }

                    { activeApp && (
                        <div
                            key={ activeApp.id }
                            className="relative w-full overflow-hidden rounded-lg bg-gray-800 aspect-w-16 aspect-h-9"
                        >
                            <iframe
                                src={ activeApp.deployment }
                                title={ activeApp.title }
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                allow="autoplay; fullscreen"
                                allowFullScreen
                                loading="lazy"
                            />
                        </div>
                    ) }
                </div>
                { activeApp.title }
            </div>
            <Outlet/>
        </div>
    );
}