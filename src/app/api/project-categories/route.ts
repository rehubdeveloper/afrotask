import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const apiRes = await fetch(`${process.env.BASE_URL}/project-categories/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!apiRes.ok) {
            const data = await apiRes.json();
            console.error('Backend project categories fetch failed:', apiRes.status, data);
            return NextResponse.json(data, { status: apiRes.status });
        }

        const data = await apiRes.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Project categories API route error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}