import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, Link, useSearchParams, Outlet } from "@remix-run/react";

type Card = {
    slug: string;
    title: string;
    passions?: string;
    summary?: string;
    experience?: string;
};

type MdxModule = {
    frontmatter: {
        title: string;
        [key: string]: string;
    };
    default: () => JSX.Element;
};

const mdxCards = import.meta.glob("./mdx/*.mdx", { eager: true });

const slugToComponent = Object.fromEntries(
    Object.entries(mdxCards).map(([path, mod]) => {
        const slug = path.replace(/\.\/mdx\/|\.mdx?$/g, "");
        return [slug, (mod as MdxModule).default];
    })
);

export const loader: LoaderFunction = async () => {
    const cards: Card[] = Object.entries(mdxCards).map(([filename, mod]) => {
        const frontmatter = (mod as MdxModule).frontmatter;
        return {
            slug: filename.replace(/\.\/mdx\/|\.mdx?$/g, ""),
            ...frontmatter,
        };
    });
    return json({ cards });
};

const ITEMS_PER_PAGE = 3;

const getVisibleCards = (cards: Card[], pageIndex: number): Card[] => {
    return cards.slice(
        pageIndex * ITEMS_PER_PAGE,
        (pageIndex + 1) * ITEMS_PER_PAGE
    );
};

export default function PhotosCards() {
    const { cards } = useLoaderData<{ cards: Card[] }>();
    const [searchParams] = useSearchParams();
    const currentPageIndex = parseInt(searchParams.get("page") || "0", 10);
    const totalCards = cards.length;
    const maxPageIndex = Math.ceil(totalCards / ITEMS_PER_PAGE) - 1;
    const visibleCards = getVisibleCards(cards, currentPageIndex);

    return (
        <div
            className="p-8 text-gray-900 w-full bg-cover bg-center mt-36"
            style={{
                backgroundImage: "url('/bg.jpg')",
            }}
        >
            <div className="text-center text-7xl  mb-36 mt-8">Kumait</div>
            <div className="flex justify-center items-center mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {visibleCards.length > 0 ? (
                        visibleCards.map((card, index) => {
                            const Component = slugToComponent[card.slug];
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg p-6 mx-2 text-gray-900 min-h-[150px] transition-transform duration-300 ease-in-out hover:border-2 hover:border-blue-500 hover:shadow-lg hover:scale-105 border border-transparent"
                                >
                                    <h1 className="text-lg opacity-70 mb-2">{card.title}</h1>
                                    <Component />
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-3 text-center text-gray-500">
                            No cards available.
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-8">
                <Link preventScrollReset={true}
                      to={`?page=${currentPageIndex > 0 ? currentPageIndex - 1 : maxPageIndex}`}
                    className={`mx-2 border border-gray-900 rounded-full ${currentPageIndex === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:bg-blue-600"
                        }`}
                >
                    <ArrowIcon />
                </Link>
                <span className="mx-4">
                    {currentPageIndex + 1} of {maxPageIndex + 1}
                </span>
                <Link preventScrollReset={true}
                      to={`?page=${currentPageIndex < maxPageIndex ? currentPageIndex + 1 : 0}`}
                    className={`mx-2 border border-gray-900 rounded-full ${currentPageIndex === maxPageIndex
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:bg-blue-600"
                        }`}
                >
                    <ArrowIcon />
                </Link>
            </div>

            <Outlet />
        </div>
    );
}

const ArrowIcon = () => (
    <svg viewBox="0 0 50.01 50" xmlns="http://www.w3.org/2000/svg" width="39" height="39">
        <g stroke="#2088ff">
            <path d="m17 21-3.4 3.4a.85.85 0 0 0 0 1.2l3.4 3.4m17-8 3.4 3.4a.85.85 0 0 1 0 1.2l-3.4 3.4" />
            <path d="m28 18.05-5 14.01" />
        </g>
    </svg>
);