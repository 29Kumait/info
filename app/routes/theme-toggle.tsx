import { data, ActionFunctionArgs } from "@remix-run/node";
import { useFetcher, useRouteLoaderData } from "@remix-run/react";
import { themeCookie } from "~/theme.server";


export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const theme = formData.get('theme') as string;

    return data("", {
        headers: {
            'Set-Cookie': await themeCookie.serialize({ theme }),
        },
    });
};

export default function ThemeToggle() {

    const { theme } = useRouteLoaderData("root") as { theme: string };
    const fetcher = useFetcher();
    const theTheme = theme === "light" ? "dark" : "light";

    const toggleTheme = () => {

        fetcher.submit({ theme: theTheme }, { method: "POST", action: "/theme-toggle" });


        document.documentElement.setAttribute("data-theme", theTheme);

    };

    return <ToggleButton theme={theme} toggleTheme={toggleTheme} />
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({ theme , toggleTheme }) => {
  return (
      <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="hover:bg-blue-950 group flex items-center rounded-md bg-blend-darken text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
      >
      <span
          className={`ml-2 font-semibold max-w-full mx-auto ${theme === 'light' ? 'text-green-600' : 'text-pink-600'
          }`}
      >
        {theme === 'light' ? 'Dark' : 'Light'}
      </span>
        <svg width="20" height="20" fill="currentColor" className="mr-2" aria-hidden="true">
          <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
        </svg>
      </button>
  );
};

interface ToggleButtonProps {
    theme: string;
    toggleTheme: () => void;
}