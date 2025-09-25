import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST() {
    try {
        const headersList = await headers();
        const authorization = headersList.get('authorization');

        if (!authorization) {
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        const apiRes = await fetch(`${process.env.BASE_URL}/notifications/mark-all-read/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
            },
        });

        if (!apiRes.ok) {
            const data = await apiRes.json();
            console.error('Backend mark all notifications read failed:', apiRes.status, data);
            return NextResponse.json(data, { status: apiRes.status });
        }

        const data = await apiRes.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Mark all notifications read API route error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
