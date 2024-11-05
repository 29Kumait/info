import {format} from "date-fns";
import {FaBug , FaCode , FaCodeBranch , FaCommentDots , FaStar , FaUser ,} from "react-icons/fa";
import type {Event} from "~/types/type";
import {useState} from "react";
import Modal from "./Modal";

interface EventCardProps {
    event: Event;
    className?: string;
}

function getEventTypeStyle(eventType: string): string {
    const baseStyle =
        "border border-transparent rounded-2xl p-6 backdrop-blur-sm bg-white/30 shadow-md";
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
        issue_comment: (
            <FaCommentDots className="text-purple-600 text-3xl mb-2 drop-shadow-sm" />
        ),
        fork: <FaCode className="text-pink-600 text-3xl mb-2 drop-shadow-sm" />,
        star: <FaStar className="text-orange-600 text-3xl mb-2 drop-shadow-sm" />,
        default: <FaUser className="text-gray-600 text-3xl mb-2 drop-shadow-sm" />,
    };
    return icons[eventType] || icons.default;
}

export default function EventCard({ event, className }: EventCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const eventStyle = getEventTypeStyle(event.eventType);
    const eventIcon = getEventTypeIcon(event.eventType);

    const formattedCreatedAt = event.payload?.head_commit?.timestamp
        ? format(new Date(event.payload.head_commit.timestamp), "PPPP p")
        : "No date available";

    const formattedUpdatedAt = event.payload.repository.updated_at
        ? format(new Date(event.payload.repository.updated_at), "PPPP p")
        : "No date available";

    return (
        <>
            <div
                className={`${eventStyle} cursor-pointer ${className} w-80 h-56 mb-4 mx-2`}
                role="button"
                tabIndex={0}
                onClick={() => setIsModalOpen(true)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        setIsModalOpen(true);
                        e.preventDefault();
                    }
                }}
            >
                <div className="flex justify-center items-center mb-4">
                    {eventIcon}
                </div>
                <p className="text-sm text-gray-600 mb-2 italic">
                    Event created:{" "}
                    <span className="font-medium text-gray-800">{formattedCreatedAt}</span>
                </p>
                <p className="text-sm text-gray-600 mb-2 italic">
                    Event updated:{" "}
                    <span className="font-medium text-gray-800">{formattedUpdatedAt}</span>
                </p>
                <p className="text-sm text-gray-600">
                    Repository:{" "}
                    <span className="font-medium text-gray-800">
                        {event.payload.repository.name || "N/A"}
                    </span>
                </p>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4">
                        {event.eventType.replace(/_/g, " ").toUpperCase()} Details
                    </h2>
                    <p className="text-sm text-gray-600 mb-2 italic">
                        Event updated:{" "}
                        <span className="font-medium text-gray-800">
                            {formattedUpdatedAt}
                        </span>
                    </p>
                    <ul className="text-gray-700 space-y-2">
                        <li className="mb-2">
                            <strong className="text-base font-semibold">ID:</strong>{" "}
                            <span className="text-sm font-light break-words">{event.id}</span>
                        </li>
                        <li className="mb-2">
                            <strong className="text-base font-semibold">Repository:</strong>{" "}
                            <span className="text-sm font-light break-words">
                                {event.payload.repository.name || "N/A"}
                            </span>
                        </li>

                        {event.payload.pusher?.name && (
                            <li className="mb-2">
                                <strong className="text-base font-semibold">Pushed by:</strong>{" "}
                                <span className="text-sm font-light break-words text-gray-700">
                                    {event.payload.pusher.name}
                                </span>
                            </li>
                        )}

                        {event.eventType === "pull_request" &&
                            event.payload.pull_request?.title && (
                                <li className="mb-2">
                                    <strong className="text-base font-semibold">PR Title:</strong>{" "}
                                    <span className="text-sm font-light break-words text-gray-700">
                                        {event.payload.pull_request.title}
                                    </span>
                                </li>
                            )}

                        {event.eventType === "issues" && event.payload.issue && (
                            <>
                                <li className="mb-2">
                                    <strong className="text-base font-semibold">
                                        Issue Title:
                                    </strong>{" "}
                                    <span className="text-sm font-light break-words text-gray-700">
                                        {event.payload.issue.title}
                                    </span>
                                </li>
                                <li className="mb-2">
                                    <strong className="text-base font-semibold">
                                        Issue URL:
                                    </strong>{" "}
                                    <a
                                        href={event.payload.issue.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline hover:text-blue-800 transition-colors duration-200 break-words"
                                    >
                                        View Issue
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <strong className="text-base font-semibold">State:</strong>{" "}
                                    <span className="text-sm font-light break-words text-gray-700">
                                        {event.payload.issue.state}
                                    </span>
                                </li>
                                <li className="mb-2">
                                    <strong className="text-base font-semibold">
                                        Opened by:
                                    </strong>{" "}
                                    <span className="text-sm font-light break-words text-gray-700">
                                        {event.payload.issue.user.login}
                                    </span>
                                </li>
                            </>
                        )}

                        {event.payload.commits && event.payload.commits.length > 0 && (
                            <li className="mb-2">
                                <strong className="text-base font-semibold">Commits:</strong>
                                <ul className="ml-4 list-disc space-y-1">
                                    {event.payload.commits.map((commit, index) => (
                                        <li key={index} className="text-sm">
                                            <a
                                                href={commit.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline hover:text-blue-800 transition-colors duration-200 break-words"
                                            >
                                                View Commit
                                            </a>{" "}
                                            -{" "}
                                            <em className="font-light text-gray-700">
                                                {commit.author.name}
                                            </em>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        )}
                    </ul>
                </div>
            </Modal>
        </>
    );
}
