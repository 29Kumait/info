import {
    useRouteError,
    isRouteErrorResponse,
} from "@remix-run/react";

export default function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <div>
                <h1>Oops</h1>
                <p>Status: {error.status}</p>
                <p>{error.data.message}</p>
            </div>
        );
    }

    let errorMessage = "Unknown error";
    if (error instanceof Error) {
        errorMessage = error.message;
    }


    return (
        <div>
            <h1>Uh oh ...</h1>
            <pre>{errorMessage}</pre>
        </div>
    );
}