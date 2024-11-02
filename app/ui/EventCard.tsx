import {format} from "date-fns";
import {FaBug , FaCode , FaCodeBranch , FaCommentDots , FaStar , FaUser} from "react-icons/fa";
import type {Event} from "~/types/type";

interface Payload {
    created_at?: string;
    head_commit?: { timestamp?: string };
}

interface EventCardProps {
    event: Event;
    payload?: Payload;
    className?: string;
}

function getEventTypeStyle(eventType: string): string {
    const typeStyles: Record<string, string> = {
        push: "border-indigo-800 bg-gradient-to-br from-indigo-200 via-indigo-400 to-indigo-600 shadow-indigo-500/50",
        pull_request: "border-green-800 bg-gradient-to-br from-green-200 via-green-400 to-green-600 shadow-green-500/50",
        issues: "border-yellow-800 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 shadow-yellow-500/50",
        issue_comment: "border-purple-800 bg-gradient-to-br from-purple-200 via-purple-400 to-purple-600 shadow-purple-500/50",
        fork: "border-pink-800 bg-gradient-to-br from-pink-200 via-pink-400 to-pink-600 shadow-pink-500/50",
        star: "border-orange-800 bg-gradient-to-br from-orange-200 via-orange-400 to-orange-600 shadow-orange-500/50",
        default: "border-gray-800 bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600 shadow-gray-500/50",
    };
    return typeStyles[eventType] || typeStyles.default;
}

function getEventTypeIcon(eventType: string) {
    const icons: Record<string, JSX.Element> = {
        push: <FaCodeBranch className="text-indigo-800 text-4xl mb-2 drop-shadow-md" />,
        issues: <FaBug className="text-yellow-800 text-4xl mb-2 drop-shadow-md" />,
        issue_comment: <FaCommentDots className="text-purple-800 text-4xl mb-2 drop-shadow-md" />,
        fork: <FaCode className="text-pink-800 text-4xl mb-2 drop-shadow-md" />,
        star: <FaStar className="text-orange-800 text-4xl mb-2 drop-shadow-md" />,
        default: <FaUser className="text-gray-800 text-4xl mb-2 drop-shadow-md" />,
    };
    return icons[eventType] || icons.default;
}

export default function EventCard({ event, className }: EventCardProps) {
    const eventStyle = getEventTypeStyle(event.eventType);
    const eventIcon = getEventTypeIcon(event.eventType);

    const formattedCreatedAt = event.payload?.head_commit?.timestamp
        ? format(new Date(event.payload.head_commit.timestamp), "PPPP p")
        : "No date available";

    const formattedUpdatedAt = event.payload.repository.updated_at
        ? format(new Date(event.payload.repository.updated_at), "PPPP p")
        : "No date available";

    return (
        <div className={`prose shadow-2xl rounded-3xl p-8 border-l-8 ${eventStyle} transform transition-transform duration-700 hover:-translate-y-4 hover:shadow-4xl hover:scale-110 ease-out`}>
            <div className={`event-card ${className}`} />
            <div
                className="animated-border p-8 max-w-screen-xl w-full border border-gray-300 bg-dark-blue-black-03 rounded-2xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-3xl hover:bg-gray-50"
            >
                <div className="flex justify-center items-center mb-2">
                    {eventIcon}
                    <h2 className="text-2xl font-extrabold text-center text-gray-800 ml-3 tracking-wider glow-on-hover">
                        {event.eventType.replace(/_/g, " ").toUpperCase()}
                    </h2>
                </div>
            </div>

            <p className="text-md text-gray-700 mb-2 italic">Event created: <span className="font-medium text-gray-900">{formattedCreatedAt}</span></p>
            <p className="text-md text-gray-700 mb-4 italic">Event updated: <span className="font-medium text-gray-900">{formattedUpdatedAt}</span></p>

            <ul className="text-gray-900 space-y-2">
                <li className="mb-2">
                    <strong className="text-lg font-semibold">ID:</strong> <span className="text-base font-light break-words">{event.id}</span>
                </li>
                <li className="mb-2">
                    <strong className="text-lg font-semibold">Repository:</strong> <span className="text-base font-light break-words">{event.payload.repository.name || "N/A"}</span>
                </li>

                {event.payload.pusher?.name && (
                    <li className="mb-2">
                        <strong className="text-lg font-semibold">Pushed by:</strong> <span className="text-base font-light break-words text-gray-900">{event.payload.pusher.name}</span>
                    </li>
                )}

                {event.eventType === "pull_request" && event.payload.pull_request?.title && (
                    <li className="mb-2">
                        <strong className="text-lg font-semibold">PR Title:</strong> <span className="text-base font-light break-words text-gray-900">{event.payload.pull_request.title}</span>
                    </li>
                )}

                {event.eventType === "issues" && event.payload.issue && (
                    <>
                        <li className="mb-2">
                            <strong className="text-lg font-semibold">Issue Title:</strong> <span className="text-base font-light break-words text-gray-900">{event.payload.issue.title}</span>
                        </li>
                        <li className="mb-2">
                            <strong className="text-lg font-semibold">Issue URL:</strong>{" "}
                            <a
                                href={event.payload.issue.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline hover:text-blue-800 hover:font-semibold break-words"
                            >
                                {event.payload.issue.html_url}
                            </a>
                        </li>
                        <li className="mb-2">
                            <strong className="text-lg font-semibold">State:</strong> <span className="text-base font-light break-words text-gray-900">{event.payload.issue.state}</span>
                        </li>
                        <li className="mb-2">
                            <strong className="text-lg font-semibold">Opened by:</strong> <span className="text-base font-light break-words text-gray-900">{event.payload.issue.user.login}</span>
                        </li>
                    </>
                )}

                {event.payload.commits && event.payload.commits.length > 0 && (
                    <li className="mb-2">
                        <strong className="text-lg font-semibold">Commits:</strong>
                        <ul className="ml-6 list-disc space-y-2">
                            {event.payload.commits.map((commit, index) => (
                                <li key={index} className="mb-1 text-base">
                                    <a
                                        href={commit.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline hover:text-blue-800 hover:font-semibold break-words"
                                    >
                                        {commit.message}
                                    </a>{" "}
                                    - <em className="font-light break-words text-gray-900">{commit.author.name}</em>
                                </li>
                            ))}
                        </ul>
                    </li>
                )}
            </ul>
        </div>
    );
}