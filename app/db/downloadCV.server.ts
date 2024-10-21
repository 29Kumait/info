// app/db/downloadCV.server.ts
export async function getPdf() {
    const pdfUrl = process.env.CV_PDF_URL;

    if (!pdfUrl) throw new Error("CV_PDF_URL is not set");

    const response = await fetch(pdfUrl);

    if (!response.ok) throw new Response("Failed to fetch the PDF", { status: 500 });

    const contentType = response.headers.get("content-type") || "application/pdf";
    const contentDisposition = 'attachment; filename="Resume.pdf"';

    return new Response(response.body, {
        headers: {
            "Content-Type": contentType,
            "Content-Disposition": contentDisposition,
        },
    });
}
