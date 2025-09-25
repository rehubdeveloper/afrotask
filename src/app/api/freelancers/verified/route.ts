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
        const queryString = searchParams.toString();
        const apiUrl = queryString 
            ? `${process.env.BASE_URL}/freelancers/verified/?${queryString}`
            : `${process.env.BASE_URL}/freelancers/verified/`;

        const apiRes = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
            },
        });

        if (!apiRes.ok) {
            const data = await apiRes.json();
            console.error('Backend freelancers fetch failed:', apiRes.status, data);
            return NextResponse.json(data, { status: apiRes.status });
        }

        const data = await apiRes.json();
        console.log('Backend freelancers response:', JSON.stringify(data, null, 2));
        console.log('First freelancer from backend:', JSON.stringify(data.results?.[0], null, 2));
        
        // Check specifically for skills and experience in the first freelancer
        if (data.results && data.results.length > 0) {
          const firstFreelancer = data.results[0];
          console.log('First freelancer data check:');
          console.log('- freelancer_profile?.skills:', firstFreelancer.freelancer_profile?.skills);
          console.log('- skills:', firstFreelancer.skills);
          console.log('- freelancer_profile?.experience_description:', firstFreelancer.freelancer_profile?.experience_description);
          console.log('- experience_description:', firstFreelancer.experience_description);
          console.log('- freelancer_profile keys:', Object.keys(firstFreelancer.freelancer_profile || {}));
          console.log('- freelancer keys:', Object.keys(firstFreelancer));
        }
        
        console.log('Backend response status:', apiRes.status);
        console.log('Backend response headers:', Object.fromEntries(apiRes.headers.entries()));
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Freelancers API route error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
