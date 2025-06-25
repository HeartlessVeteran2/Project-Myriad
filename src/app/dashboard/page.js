import Link from 'next/link';

async function getSeries() {
    // TODO: Fetch series data from /api/series
    // This should be an authenticated request
    return [
        { id: 1, title: 'Sample Series 1', cover_path: '/placeholder.jpg' },
    ];
}

export default async function Dashboard() {
    const seriesList = await getSeries();
    return (
        <div>
            <h1>My Collection</h1>
            <div>
                {seriesList.map(series => (
                    <div key={series.id}>
                        <Link href={`/reader/${series.id}`}>
                            {/* Add Image component for cover */}
                            <h3>{series.title}</h3>
                        </Link>
                    </div>
                ))}
            </div>
            {/* TODO: Add File Upload Component (e.g., react-dropzone) here */}
        </div>
    );
}
