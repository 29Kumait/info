import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useRouteLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import "./tailwind.css";
import ErrorBoundary from "~/routes/errorBoundary";

import {themeCookie} from "~/theme.server";
import ThemeToggle from "~/routes/theme-toggle";


export const links: LinksFunction = () => [
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const cookieHeader = request.headers.get('Cookie');
    const cookie = (await themeCookie.parse(cookieHeader)) || { theme: 'light' };
    return { theme: cookie.theme };
};

export function Layout({ children }: { children: React.ReactNode }) {

    const { theme } = useRouteLoaderData("root") as { theme: string };

    return (
        <html lang="en" data-theme={ theme } >
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <Meta />
            <Links />
            <title></title>
        </head>
        <body >
        <header>
            <ThemeToggle/>
        </header>
        { children }
        <ScrollRestoration/>
        <Scripts/>
        </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}

export { ErrorBoundary }
