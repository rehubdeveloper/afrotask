import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request: Request) {
    try {
        const headersList = await headers();
        const authorization = headersList.get('authorization');

        if (!authorization) {
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        if (!process.env.BASE_URL) {
            console.error('BASE_URL environment variable is not set');
            return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
        }

        const apiUrl = `${process.env.BASE_URL}/chat-rooms/`;
        console.log('Fetching chat rooms from backend:', apiUrl);

        const apiRes = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
            },
        });

        console.log('Backend chat rooms response status:', apiRes.status);

        if (!apiRes.ok) {
            const data = await apiRes.json();
            console.error('Backend chat rooms fetch failed:', apiRes.status, data);
            return NextResponse.json(data, { status: apiRes.status });
        }

        const data = await apiRes.json();
        console.log('Backend chat rooms data received:', JSON.stringify(data, null, 2));
        
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Chat rooms API route error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
