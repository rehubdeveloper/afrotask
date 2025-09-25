import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
    try {
        const headersList = await headers();
        const authorization = headersList.get('authorization');

        console.log('Projects API GET request received');
        console.log('Authorization header:', authorization ? 'Present' : 'Missing');
        console.log('BASE_URL environment variable:', process.env.BASE_URL);

        if (!authorization) {
            console.log('No authorization header, returning 401');
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        if (!process.env.BASE_URL) {
            console.error('BASE_URL environment variable is not set');
            return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
        }

        console.log('Fetching from backend:', `${process.env.BASE_URL}/projects/`);
        
        // Try with query parameters to get all projects
        const apiUrl = `${process.env.BASE_URL}/projects/`;
        console.log('Full API URL:', apiUrl);
        
        const apiRes = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
            },
        });

        console.log('Backend response status:', apiRes.status);

        if (!apiRes.ok) {
            const data = await apiRes.json();
            console.error('Backend projects fetch failed:', apiRes.status, data);
            return NextResponse.json(data, { status: apiRes.status });
        }

        const data = await apiRes.json();
        console.log('Backend projects data received:', data);
        if (data.results && Array.isArray(data.results)) {
            console.log(`Projects found: ${data.results.length} items, total count: ${data.count}`);
        } else if (Array.isArray(data)) {
            console.log(`Projects array with ${data.length} items`);
        } else {
            console.log('Projects data type:', typeof data);
        }
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Projects API route error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const headersList = await headers();
        const authorization = headersList.get('authorization');

        console.log('Project creation API POST request received');
        console.log('Authorization header:', authorization ? 'Present' : 'Missing');
        console.log('BASE_URL environment variable:', process.env.BASE_URL);

        if (!authorization) {
            console.log('No authorization header, returning 401');
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        if (!process.env.BASE_URL) {
            console.error('BASE_URL environment variable is not set');
            return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
        }

        const body = await request.json();
        console.log('Project creation request body:', JSON.stringify(body, null, 2));

        const apiUrl = `${process.env.BASE_URL}/projects/create/`;
        console.log('Project creation API URL:', apiUrl);

        const apiRes = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
            },
            body: JSON.stringify(body),
        });

        console.log('Project creation backend response status:', apiRes.status);

        if (!apiRes.ok) {
            const data = await apiRes.json();
            console.error('Backend project creation failed:', apiRes.status, data);
            return NextResponse.json(data, { status: apiRes.status });
        }

        const data = await apiRes.json();
        console.log('Project creation successful, response:', data);
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Project creation API route error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}