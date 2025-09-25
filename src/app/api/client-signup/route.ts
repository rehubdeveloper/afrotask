import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('Client signup request body received:', JSON.stringify(body, null, 2));

        const apiRes = await fetch(`${process.env.BASE_URL}/auth/client/signup/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await apiRes.json();
        console.log('Backend response for client signup:', data);

        if (!apiRes.ok) {
            console.error('Backend returned an error for client signup:', apiRes.status, data);
            return NextResponse.json(data, { status: apiRes.status });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Client signup API route error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
