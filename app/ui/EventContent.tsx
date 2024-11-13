import { format } from 'date-fns';
import type { Event } from '~/types/type';

interface EventModalContentProps {
    event: Event;
}

export default function EventContent({ event }: EventModalContentProps) {
    const formattedUpdatedAt = event.payload.repository.updated_at
        ? format(new Date(event.payload.repository.updated_at), 'PPPP p')
        : 'No date available';

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">
                {event.eventType.replace(/_/g, ' ').toUpperCase()} Details
            </h2>
            <p className="text-sm text-gray-600 mb-2 italic">
                Event updated:{' '}
                <span className="font-medium text-gray-800">{formattedUpdatedAt}</span>
            </p>
            <ul className="text-gray-700 space-y-2">
                <li className="mb-2">
                    <strong className="text-base font-semibold">ID:</strong>{" "}
                    <span className="text-sm font-light break-words">
                        {event.id}
                    </span>
                </li>
                <li className="mb-2">
                    <strong className="text-base font-semibold">Repository:</strong>{" "}
                    <span className="text-sm font-light break-words">
                        {event.payload?.repository?.name || "N/A"}
                    </span>
                </li>

                {event.payload?.pusher?.name && (
                    <li className="mb-2">
                        <strong className="text-base font-semibold">Pushed by:</strong>{" "}
                        <span className="text-sm font-light break-words text-gray-700">
                            {event.payload.pusher.name}
                        </span>
                    </li>
                )}

                {event.eventType === "pull_request" &&
                    event.payload?.pull_request?.title && (
                        <li className="mb-2">
                            <strong className="text-base font-semibold">PR Title:</strong>{" "}
                            <span className="text-sm font-light break-words text-gray-700">
                                {event.payload.pull_request.title}
                            </span>
                        </li>
                    )}

                {event.eventType === "issues" && event.payload?.issue && (
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

                {event.payload?.commits && event.payload.commits.length > 0 && (
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
    );
}
