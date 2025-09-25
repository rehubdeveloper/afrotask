import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const headersList = await headers();
        const authorization = headersList.get('authorization');

        if (!authorization) {
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        const resolvedParams = await params;
        const apiRes = await fetch(`${process.env.BASE_URL}/projects/${resolvedParams.id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
            },
        });

        if (!apiRes.ok) {
            const data = await apiRes.json();
            console.error('Backend project details fetch failed:', apiRes.status, data);
            return NextResponse.json(data, { status: apiRes.status });
        }

        const data = await apiRes.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Project details API route error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const headersList = await headers();
        const authorization = headersList.get('authorization');

        if (!authorization) {
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        const body = await request.json();
        console.log('Project update request body:', JSON.stringify(body, null, 2));

        const resolvedParams = await params;
        console.log('Project ID from params:', resolvedParams.id);
        console.log('Backend URL:', `${process.env.BASE_URL}/projects/${resolvedParams.id}/update/`);
        console.log('Authorization header:', authorization);

        const apiRes = await fetch(`${process.env.BASE_URL}/projects/${resolvedParams.id}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
            },
            body: JSON.stringify(body),
        });

        console.log('Backend response status:', apiRes.status);
        console.log('Backend response ok:', apiRes.ok);

        if (!apiRes.ok) {
            const data = await apiRes.json();
            console.error('Backend project update failed:', apiRes.status, data);
            return NextResponse.json(data, { status: apiRes.status });
        }

        const data = await apiRes.json();
        console.log('Backend response data:', JSON.stringify(data, null, 2));
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Project update API route error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const headersList = await headers();
        const authorization = headersList.get('authorization');

        if (!authorization) {
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        const resolvedParams = await params;
        const apiRes = await fetch(`${process.env.BASE_URL}/projects/${resolvedParams.id}/delete/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
            },
        });

        if (!apiRes.ok) {
            const data = await apiRes.json();
            console.error('Backend project delete failed:', apiRes.status, data);
            return NextResponse.json(data, { status: apiRes.status });
        }

        const data = await apiRes.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Project delete API route error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
