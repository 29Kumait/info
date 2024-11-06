import {format} from "date-fns";
import {FaBug , FaCode , FaCodeBranch , FaCommentDots , FaStar , FaUser ,} from "react-icons/fa";
import type {Event} from "~/types/type";
import {useFetcher} from "@remix-run/react";

interface EventCardProps {
    event: Event;
    className?: string;
    fetcher: ReturnType<typeof useFetcher>;
}

function getEventTypeStyle(eventType: string): string {
    const baseStyle = "border border-transparent rounded-2xl p-6 backdrop-blur-sm bg-white/30 shadow-md";
    const typeStyles: Record<string, string> = {
        push: `${baseStyle} border-indigo-200`,
        pull_request: `${baseStyle} border-green-200`,
        issues: `${baseStyle} border-yellow-200`,
        issue_comment: `${baseStyle} border-purple-200`,
        fork: `${baseStyle} border-pink-200`,
        star: `${baseStyle} border-orange-200`,
        default: `${baseStyle} border-gray-200`,
    };
    return typeStyles[eventType] || typeStyles.default;
}

function getEventTypeIcon(eventType: string) {
    const icons: Record<string, JSX.Element> = {
        push: <FaCodeBranch className="text-indigo-600 text-3xl mb-2 drop-shadow-sm" />,
        issues: <FaBug className="text-yellow-600 text-3xl mb-2 drop-shadow-sm" />,
        issue_comment: <FaCommentDots className="text-purple-600 text-3xl mb-2 drop-shadow-sm" />,
        fork: <FaCode className="text-pink-600 text-3xl mb-2 drop-shadow-sm" />,
        star: <FaStar className="text-orange-600 text-3xl mb-2 drop-shadow-sm" />,
        default: <FaUser className="text-gray-600 text-3xl mb-2 drop-shadow-sm" />,
    };
    return icons[eventType] || icons.default;
}

export default function EventCard({ event, className = "", fetcher }: EventCardProps) {
    const eventStyle = getEventTypeStyle(event.eventType);
    const eventIcon = getEventTypeIcon(event.eventType);

    const formattedCreatedAt = event.payload?.head_commit?.timestamp
        ? format(new Date(event.payload.head_commit.timestamp), "PPPP p")
        : "No date available";

    const formattedUpdatedAt = event.payload.repository.updated_at
        ? format(new Date(event.payload.repository.updated_at), "PPPP p")
        : "No date available";

    return (
        <fetcher.Form method="post">
            <input type="hidden" name="eventId" value={event.id} />
            <button
                type="submit"
                className={`${eventStyle} cursor-pointer ${className} w-80 h-56 mb-4 mx-2`}
            >
                <div className="flex justify-center items-center mb-4">
                    {eventIcon}
                </div>
                <p className="text-sm text-gray-600 mb-2 italic">
                    Event created:{" "}
                    <span className="font-medium text-gray-800">
                        {formattedCreatedAt}
                    </span>
                </p>
                <p className="text-sm text-gray-600 mb-2 italic">
                    Event updated:{" "}
                    <span className="font-medium text-gray-800">
                        {formattedUpdatedAt}
                    </span>
                </p>
                <p className="text-sm text-gray-600">
                    Repository:{" "}
                    <span className="font-medium text-gray-800">
                        {event.payload.repository.name || "N/A"}
                    </span>
                </p>
            </button>
        </fetcher.Form>
    );
}
