import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const headersList = await headers();
        const authorization = headersList.get('authorization');

        if (!authorization) {
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        const body = await request.json();
        console.log('Bid submission request body:', JSON.stringify(body, null, 2));

        const resolvedParams = await params;
        const apiRes = await fetch(`${process.env.BASE_URL}/projects/${resolvedParams.id}/bids/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
            },
            body: JSON.stringify(body),
        });

        if (!apiRes.ok) {
            const data = await apiRes.json();
            console.error('Backend bid submission failed:', apiRes.status, data);
            return NextResponse.json(data, { status: apiRes.status });
        }

        const data = await apiRes.json();
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Bid submission API route error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
