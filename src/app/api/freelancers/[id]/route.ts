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

        console.log('Freelancer profile API GET request received for ID:', resolvedParams.id);
        console.log('Authorization header:', authorization ? 'Present' : 'Missing');

        if (!authorization) {
            console.log('No authorization header, returning 401');
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        if (!process.env.BASE_URL) {
            console.error('BASE_URL environment variable is not set');
            return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
        }

        // Fetch individual freelancer profile using the working endpoint
        // The individual endpoint /freelancers/{id}/ doesn't exist yet, so we use the browse endpoint
        const apiUrl = `${process.env.BASE_URL}/freelancers/verified/`;
        console.log('Fetching freelancer from browse endpoint:', apiUrl);

        const apiRes = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
            },
        });

        console.log('Backend response status:', apiRes.status);

        if (!apiRes.ok) {
            const data = await apiRes.json();
            console.error('Backend freelancer profile fetch failed:', apiRes.status, data);
            return NextResponse.json(data, { status: apiRes.status });
        }

        const data = await apiRes.json();
        console.log('Backend freelancers data received:', JSON.stringify(data, null, 2));
        
        // Filter for the specific freelancer from the browse endpoint response
        if (data && data.results && Array.isArray(data.results)) {
            const targetId = parseInt(resolvedParams.id);
            const freelancer = data.results.find(f => f.id === targetId);
            
            if (freelancer) {
                console.log('Found freelancer:', freelancer.id, freelancer.first_name, freelancer.last_name);
                console.log('Freelancer skills:', freelancer.freelancer_profile?.skills);
                console.log('Freelancer experience:', freelancer.freelancer_profile?.experience_description);
                console.log('Freelancer education:', freelancer.freelancer_profile?.education);
                console.log('Freelancer rating:', freelancer.freelancer_profile?.rating);
                console.log('Freelancer completed projects:', freelancer.freelancer_profile?.completed_projects);
                
                // Return the individual freelancer data
                return NextResponse.json(freelancer, { status: 200 });
            } else {
                console.log('Freelancer not found with ID:', targetId);
                return NextResponse.json({ message: 'Freelancer not found' }, { status: 404 });
            }
        } else {
            console.log('Unexpected data format:', typeof data);
            return NextResponse.json({ message: 'Invalid response format' }, { status: 500 });
        }
    } catch (error) {
        console.error('Freelancer profile API route error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
