import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: Request) {
    try {
        const headersList = await headers();
        const authorization = headersList.get('authorization');

        if (!authorization) {
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        const body = await request.json();
        console.log('Create direct chat request body:', JSON.stringify(body, null, 2));

        const apiRes = await fetch(`${process.env.BASE_URL}/chat-rooms/create-direct/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
            },
            body: JSON.stringify(body),
        });

        if (!apiRes.ok) {
            const data = await apiRes.json();
            console.error('Backend direct chat creation failed:', apiRes.status, data);
            return NextResponse.json(data, { status: apiRes.status });
        }

        const data = await apiRes.json();
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Direct chat creation API route error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
