import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('Login request received on server:', body);

        const apiRes = await fetch(`${process.env.BASE_URL}/auth/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await apiRes.json();
        console.log('Response from backend API:', data);

        if (!apiRes.ok) {
            console.error('Backend API returned an error:', apiRes.status, data);
            return NextResponse.json(data, { status: apiRes.status });
        }

        console.log('Login successful, returning data to client.');
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Login API route error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
