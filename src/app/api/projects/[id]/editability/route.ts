import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const headersList = await headers();
        const authorization = headersList.get('authorization');

        if (!authorization) {
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        const apiRes = await fetch(`${process.env.BASE_URL}/projects/${resolvedParams.id}/editability/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
            },
        });

        if (!apiRes.ok) {
            const data = await apiRes.json();
            console.error('Backend project editability fetch failed:', apiRes.status, data);
            return NextResponse.json(data, { status: apiRes.status });
        }

        const data = await apiRes.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Project editability API route error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
