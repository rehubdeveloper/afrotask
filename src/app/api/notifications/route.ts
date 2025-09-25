import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request: Request) {
    try {
        const headersList = await headers();
        const authorization = headersList.get('authorization');

        if (!authorization) {
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const isRead = searchParams.get('is_read');
        const notificationType = searchParams.get('notification_type');

        // Build query string
        let queryString = '';
        if (isRead) queryString += `is_read=${isRead}`;
        if (notificationType) queryString += `${queryString ? '&' : ''}notification_type=${notificationType}`;

        const apiRes = await fetch(`${process.env.BASE_URL}/notifications/${queryString ? `?${queryString}` : ''}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
            },
        });

        if (!apiRes.ok) {
            const data = await apiRes.json();
            console.error('Backend notifications fetch failed:', apiRes.status, data);
            return NextResponse.json(data, { status: apiRes.status });
        }

        const data = await apiRes.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Notifications API route error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
