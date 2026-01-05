import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook endpoint for Farcaster Frame notifications
 * This receives events when users interact with the frame
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Log the webhook event for debugging
    console.log('Farcaster webhook received:', JSON.stringify(body, null, 2));
    
    // Handle different event types
    const { event, data } = body;
    
    switch (event) {
      case 'frame_added':
        // User added the frame to their favorites
        console.log('Frame added by user:', data?.fid);
        break;
        
      case 'frame_removed':
        // User removed the frame
        console.log('Frame removed by user:', data?.fid);
        break;
        
      case 'notifications_enabled':
        // User enabled notifications
        console.log('Notifications enabled for:', data?.fid);
        break;
        
      case 'notifications_disabled':
        // User disabled notifications
        console.log('Notifications disabled for:', data?.fid);
        break;
        
      default:
        console.log('Unknown event type:', event);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'Farcaster webhook',
    events: ['frame_added', 'frame_removed', 'notifications_enabled', 'notifications_disabled'],
  });
}
