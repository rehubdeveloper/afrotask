import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const headersList = await headers();
        const authorization = headersList.get('authorization');

        if (!authorization) {
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        const body = await request.json();
        console.log('Admin review update request body:', JSON.stringify(body, null, 2));

        const apiRes = await fetch(`${process.env.BASE_URL}/admin/reviews/${resolvedParams.id}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
            },
            body: JSON.stringify(body),
        });

        if (!apiRes.ok) {
            const data = await apiRes.json();
            console.error('Backend admin review update failed:', apiRes.status, data);
            return NextResponse.json(data, { status: apiRes.status });
        }

        const data = await apiRes.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Admin review update API route error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
