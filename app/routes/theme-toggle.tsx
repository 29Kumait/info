import { data, ActionFunctionArgs } from "@remix-run/node";
import { useFetcher, useRouteLoaderData } from "@remix-run/react";
import { themeCookie } from "~/theme.server";

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const theme = formData.get("theme") as string;

    return data("", {
        headers: {
            "Set-Cookie": await themeCookie.serialize({ theme }),
        },
    });
};

export default function ThemeToggle() {
    const { theme } = useRouteLoaderData("root") as { theme: string };
    const fetcher = useFetcher();
    const theTheme = theme === "light" ? "dark" : "light";

    const toggleTheme = () => {
        fetcher.submit(
            { theme: theTheme },
            { method: "POST", action: "/theme-toggle" }
        );
        document.documentElement.setAttribute("data-theme", theTheme);
    };

    const isSubmitting = fetcher.state === "submitting";

    return (
        <button
            onClick={ toggleTheme }
            aria-label="Toggle Theme"
            disabled={ isSubmitting }
            className={ `z-30 right-0 fixed flex items-center px-4 py-2 text-sm font-medium transition ${
                isSubmitting ? "cursor-not-allowed opacity-50" : "hover:bg-blend-darken"
            } ${
                theme === "light"
                    ? 'text-neon-pink' : 'text-neon-lime'
            }` }
        >
            <span>{ theme === "light" ? "dark" : "light" } </span>
        </button>
    );
}