'use client';
import { useEffect } from 'react';

// TODO: Fetch series details and image paths
// TODO: Implement 'Next' and 'Previous' page logic
// TODO: Send progress updates to the backend API

export default function ReaderPage({ params }) {
    useEffect(() => {
        console.log(`Fetching data for series: ${params.seriesId}`);
        // On page change, POST to /api/progress
    }, [params.seriesId]);

    return (
        <div>
            <h1>Reader for Series {params.seriesId}</h1>
            <div>
                {/* Image display area */}
            </div>
            <button>Previous</button>
            <button>Next</button>
        </div>
    );
}
