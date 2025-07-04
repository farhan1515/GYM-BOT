export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { generateDietPlan } from '@/lib/openai';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'age', 'weight', 'height', 'fitness_level', 'fitness_goal', 'workout_days', 'phone_number'];
    for (const field of requiredFields) {
      if (!userData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Insert user data into Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        name: userData.name,
        age: userData.age,
        weight: userData.weight,
        height: userData.height,
        injuries: userData.injuries || 'None',
        fitness_level: userData.fitness_level,
        fitness_goal: userData.fitness_goal,
        workout_days: parseInt(userData.workout_days),
        dietary_restrictions: userData.dietary_restrictions || 'None',
        phone_number: userData.phone_number,
        whatsapp_sent: false,
        conversation_log: []
      })
      .select()
      .single();

    if (userError) {
      console.error('Error inserting user:', userError);
      return NextResponse.json(
        { error: 'Failed to save user data' },
        { status: 500 }
      );
    }

    // Generate diet plan using OpenAI
    let dietPlan;
    try {
      dietPlan = await generateDietPlan({
        name: userData.name,
        age: userData.age,
        weight: userData.weight,
        height: userData.height,
        fitness_level: userData.fitness_level,
        fitness_goal: userData.fitness_goal,
        workout_days: parseInt(userData.workout_days),
        dietary_restrictions: userData.dietary_restrictions,
        injuries: userData.injuries
      });
    } catch (openaiError) {
      console.error('OpenAI Error:', openaiError);
      return NextResponse.json(
        { 
          error: openaiError instanceof Error ? openaiError.message : 'Failed to generate diet plan',
          details: 'Please ensure your OpenAI API key is properly configured in the .env.local file'
        },
        { status: 500 }
      );
    }

    // Save diet plan to database
    const { error: dietPlanError } = await supabase
      .from('diet_plans')
      .insert({
        user_id: user.id,
        plan_content: dietPlan,
        generated_at: new Date().toISOString()
      });

    if (dietPlanError) {
      console.error('Error saving diet plan:', dietPlanError);
    }

    // Send WhatsApp message (if Twilio is configured)
    try {
      // Construct absolute URL for server-side fetch
      const url = new URL(request.url);
      const baseUrl = `${url.protocol}//${url.host}`;
      
      const whatsappResponse = await fetch(`${baseUrl}/api/send-whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: userData.phone_number,
          message: `Hi ${userData.name}! 🎉 Here's your personalized diet plan:\n\n${dietPlan}\n\nFor more fitness tips and exclusive gym offers, stay tuned! Our team will contact you soon.`
        }),
      });

      if (whatsappResponse.ok) {
        // Update user record to mark WhatsApp as sent
        await supabase
          .from('users')
          .update({ whatsapp_sent: true })
          .eq('id', user.id);

        // Update diet plan with sent timestamp
        await supabase
          .from('diet_plans')
          .update({ sent_at: new Date().toISOString() })
          .eq('user_id', user.id);
      }
    } catch (whatsappError) {
      console.error('WhatsApp sending failed:', whatsappError);
      // Continue without failing the entire request
    }

    return NextResponse.json({
      success: true,
      user_id: user.id,
      diet_plan: dietPlan
    });

  } catch (error) {
    console.error('Error in generate-diet API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}