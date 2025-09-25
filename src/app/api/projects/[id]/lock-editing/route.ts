import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function PATCH(
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

        const body = await request.json();
        console.log('Lock project editing request body:', JSON.stringify(body, null, 2));

        const apiRes = await fetch(`${process.env.BASE_URL}/projects/${resolvedParams.id}/lock-editing/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
            },
            body: JSON.stringify(body),
        });

        if (!apiRes.ok) {
            const data = await apiRes.json();
            console.error('Backend project lock editing failed:', apiRes.status, data);
            return NextResponse.json(data, { status: apiRes.status });
        }

        const data = await apiRes.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Project lock editing API route error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
