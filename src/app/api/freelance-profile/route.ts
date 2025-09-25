import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
    const body = await req.json();
    const authHeader = req.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Token ')) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const response = await fetch(`${process.env.BASE_URL}/profile/freelancer/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
}
