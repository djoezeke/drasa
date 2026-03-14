export async function GET() {
    return Response.json({
        notes: [
            {
                version: "0.1.0",
                date: "2026-03-14",
                highlights: [
                    "Fumadocs documentation experience with search and themes",
                    "Modernized docs layout and navigation",
                ],
            },
        ],
    });
}
