import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., 'whatsapp:+14155238886'

let client: ReturnType<typeof twilio> | null = null;

// Initialize Twilio client only if credentials are available
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json();

    if (!to || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, message' },
        { status: 400 }
      );
    }

    // Check if Twilio is configured
    if (!client || !whatsappNumber) {
      console.log('Twilio not configured, simulating WhatsApp send');
      // In development, we simulate sending
      return NextResponse.json({
        success: true,
        message: 'WhatsApp message simulated (Twilio not configured)',
        sid: 'simulated-' + Date.now()
      });
    }

    // Format phone number for WhatsApp
    const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

    // Split the message into chunks of 1600 characters
    const MAX_LENGTH = 1600;
    const chunks = [];
    for (let i = 0; i < message.length; i += MAX_LENGTH) {
      chunks.push(message.substring(i, i + MAX_LENGTH));
    }

    for (const chunk of chunks) {
      await client.messages.create({
        body: chunk,
        from: whatsappNumber,
        to: formattedTo,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'WhatsApp message sent successfully',
    });

  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error);
    
    // Return different error messages based on the error type
    if (error.code === 21211) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    } else if (error.code === 21408) {
      return NextResponse.json(
        { error: 'Permission to send SMS has not been enabled' },
        { status: 403 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to send WhatsApp message' },
        { status: 500 }
      );
    }
  }
}