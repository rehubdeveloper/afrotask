import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST() {
    try {
        const headersList = await headers();
        const authorization = headersList.get('authorization');

        if (!authorization) {
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        const apiRes = await fetch(`${process.env.BASE_URL}/auth/logout/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
            },
        });

        if (!apiRes.ok) {
            const data = await apiRes.json();
            console.error('Backend logout failed:', apiRes.status, data);
            return NextResponse.json(data, { status: apiRes.status });
        }

        return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
    } catch (error) {
        console.error('Logout API route error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
