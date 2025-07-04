import OpenAI from 'openai';

// Check if API key is available
if (!process.env.OPENAI_API_KEY) {
  console.error('⚠️  OPENAI_API_KEY environment variable is not set');
  console.error('📝 Please add your OpenAI API key to .env.local file');
  console.error('🔗 Get your API key from: https://platform.openai.com/api-keys');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});

export async function generateDietPlan(userData: {
  name: string;
  age: number;
  weight: number;
  height: number;
  fitness_level: string;
  fitness_goal: string;
  workout_days: number;
  dietary_restrictions?: string;
  injuries?: string;
}) {
  // Check if API key is properly configured
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key-for-build' || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    throw new Error('OpenAI API key is not configured. Please add your API key to the .env.local file.');
  }

  const prompt = `
You are a professional nutritionist and fitness expert. Create a comprehensive, personalized diet plan for the following client:

**Client Information:**
- Name: ${userData.name}
- Age: ${userData.age} years
- Weight: ${userData.weight} kg
- Height: ${userData.height} cm
- Fitness Level: ${userData.fitness_level}
- Primary Goal: ${userData.fitness_goal}
- Workout Days per Week: ${userData.workout_days}
- Dietary Restrictions: ${userData.dietary_restrictions || 'None'}
- Injuries/Medical Conditions: ${userData.injuries || 'None'}

**Please provide:**

1. **Daily Caloric Needs**: Calculate BMR and total daily energy expenditure
2. **Macronutrient Breakdown**: Protein, carbs, and fats in grams and percentages
3. **7-Day Meal Plan**: Detailed meals for breakfast, lunch, dinner, and 2 snacks
4. **Portion Sizes**: Specific quantities for each food item
5. **Meal Timing**: When to eat relative to workouts
6. **Hydration Guidelines**: Daily water intake recommendations
7. **Supplement Suggestions**: If applicable (be conservative)
8. **Shopping List**: Organized by food categories
9. **Meal Prep Tips**: How to prepare meals efficiently
10. **Important Notes**: Any special considerations based on their profile

Format the response in a clear, easy-to-follow structure with proper headings and bullet points. Make it practical and actionable.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional nutritionist creating personalized diet plans. Be thorough, accurate, and practical in your recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "Unable to generate diet plan.";
  } catch (error) {
    console.error('Error generating diet plan:', error);
    if (error instanceof Error && error.message.includes('API key')) {
      throw new Error('OpenAI API key is invalid or not configured properly. Please check your API key in the .env.local file.');
    }
    throw new Error('Failed to generate diet plan. Please try again.');
  }
}

export default openai;