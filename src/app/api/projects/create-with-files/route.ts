import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: Request) {
    try {
        const headersList = await headers();
        const authorization = headersList.get('authorization');

        if (!authorization) {
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }

        // Get form data from request
        const formData = await request.formData();
        console.log('Create project with files - form data received');
        
        // Log key form data values for debugging
        const title = formData.get('title');
        const projectType = formData.get('project_type');
        const targetFreelancer = formData.get('target_freelancer');
        const chatRoomId = formData.get('chat_room_id');
        
        console.log('Form data values:', {
            title,
            project_type: projectType,
            target_freelancer: targetFreelancer,
            chat_room_id: chatRoomId
        });

        // Create a new FormData with properly converted integer values
        const processedFormData = new FormData();
        
        // Copy all form data entries
        for (const [key, value] of formData.entries()) {
            if (key === 'target_freelancer' && value) {
                // Convert to integer
                const intValue = parseInt(value.toString());
                console.log(`Converting ${key} from "${value}" to ${intValue}`);
                processedFormData.append(key, intValue.toString());
            } else if (key === 'chat_room_id' && value) {
                // Convert to integer
                const intValue = parseInt(value.toString());
                console.log(`Converting ${key} from "${value}" to ${intValue}`);
                processedFormData.append(key, intValue.toString());
            } else if (key === 'category' && value) {
                // Convert to integer
                const intValue = parseInt(value.toString());
                console.log(`Converting ${key} from "${value}" to ${intValue}`);
                processedFormData.append(key, intValue.toString());
            } else if (key === 'duration_days' && value) {
                // Convert to integer
                const intValue = parseInt(value.toString());
                console.log(`Converting ${key} from "${value}" to ${intValue}`);
                processedFormData.append(key, intValue.toString());
            } else {
                // Keep as is
                processedFormData.append(key, value);
            }
        }

        const apiRes = await fetch(`${process.env.BASE_URL}/projects/create-with-files/`, {
            method: 'POST',
            headers: {
                'Authorization': authorization,
            },
            body: processedFormData,
        });

        if (!apiRes.ok) {
            const data = await apiRes.json();
            console.error('Backend project creation with files failed:', apiRes.status, data);
            return NextResponse.json(data, { status: apiRes.status });
        }

        const data = await apiRes.json();
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Project creation with files API route error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
