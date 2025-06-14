import { corsHeaders } from '../_shared/cors.ts';

interface NudgeRequest {
  force?: boolean; // For testing purposes
}

interface UserProfile {
  user_id: string;
  nudges_enabled: boolean;
  skin_type: string;
  language: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // This function should be called by a cron job or scheduled task
    // For now, we'll allow manual triggering for testing
    
    const body: NudgeRequest = req.method === 'POST' ? await req.json() : {};
    const isForced = body.force || false;
    
    // Get current time info
    const now = new Date();
    const currentHour = now.getHours();
    
    // Only send nudges during appropriate hours (7 AM - 9 PM) unless forced
    if (!isForced && (currentHour < 7 || currentHour > 21)) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Outside nudge hours',
          skipped: true 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get users who have nudges enabled
    const { data: users, error: usersError } = await Deno.env.get('SUPABASE_URL') 
      ? await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/user_profiles?nudges_enabled=eq.true&select=user_id,nudges_enabled,skin_type,language`, {
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
            'Content-Type': 'application/json'
          }
        }).then(res => res.json())
      : { data: [], error: null };

    if (usersError) {
      throw new Error(`Failed to fetch users: ${usersError}`);
    }

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No users with nudges enabled',
          sent: 0 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate nudge messages based on time of day
    const generateNudgeMessage = (user: UserProfile, timeOfDay: 'morning' | 'evening'): string => {
      const messages = {
        morning: {
          English: [
            "Good morning! ✨ Ready to start your skincare routine?",
            "Rise and glow! 🌅 Your skin is waiting for some love.",
            "Morning sunshine! ☀️ Time for your skincare ritual.",
            "Start your day right with your morning routine! 💫",
            "Your skin deserves the best start to the day! 🌸"
          ],
          Hindi: [
            "सुप्रभात! ✨ अपनी स्किनकेयर शुरू करने का समय है।",
            "उठो और चमको! 🌅 आपकी त्वचा आपका इंतज़ार कर रही है।",
            "सुबह की धूप! ☀️ स्किनकेयर का समय है।",
            "अपने दिन की शुरुआत सही तरीके से करें! 💫",
            "आपकी त्वचा दिन की बेहतरीन शुरुआत की हकदार है! 🌸"
          ]
        },
        evening: {
          English: [
            "Evening glow time! 🌙 Don't forget your nighttime routine.",
            "Wind down with your evening skincare ritual. 🌸",
            "Time to pamper your skin before bed! ✨",
            "End your day with some self-care. 💆‍♀️",
            "Your skin worked hard today - give it some love! 🌺"
          ],
          Hindi: [
            "शाम की चमक का समय! 🌙 रात की दिनचर्या न भूलें।",
            "शाम की स्किनकेयर के साथ आराम करें। 🌸",
            "सोने से पहले अपनी त्वचा का ख्याल रखें! ✨",
            "अपने दिन का अंत सेल्फ-केयर के साथ करें। 💆‍♀️",
            "आपकी त्वचा ने आज कड़ी मेहनत की है - इसे प्यार दें! 🌺"
          ]
        }
      };

      const timeOfDayToUse = currentHour < 12 ? 'morning' : 'evening';
      const language = user.language === 'Hindi' ? 'Hindi' : 'English';
      const messageArray = messages[timeOfDayToUse][language];
      
      return messageArray[Math.floor(Math.random() * messageArray.length)];
    };

    // Send nudges to eligible users
    const nudgesToSend = [];
    const timeOfDay = currentHour < 12 ? 'morning' : 'evening';

    for (const user of users) {
      // Check if user already received a nudge today
      const today = now.toISOString().split('T')[0];
      
      const { data: existingNudges } = await fetch(
        `${Deno.env.get('SUPABASE_URL')}/rest/v1/user_notifications?user_id=eq.${user.user_id}&type=eq.routine_nudge&created_at=gte.${today}T00:00:00Z&select=id`, 
        {
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
            'Content-Type': 'application/json'
          }
        }
      ).then(res => res.json()).catch(() => ({ data: [] }));

      // Skip if user already received a nudge today (unless forced)
      if (!isForced && existingNudges && existingNudges.length > 0) {
        continue;
      }

      const message = generateNudgeMessage(user, timeOfDay);
      
      nudgesToSend.push({
        user_id: user.user_id,
        message,
        type: 'routine_nudge',
        read: false,
        created_at: now.toISOString(),
        expires_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      });
    }

    // Batch insert nudges
    let sentCount = 0;
    if (nudgesToSend.length > 0) {
      const { error: insertError } = await fetch(
        `${Deno.env.get('SUPABASE_URL')}/rest/v1/user_notifications`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(nudgesToSend)
        }
      ).then(res => res.json()).catch(err => ({ error: err }));

      if (insertError) {
        console.error('Error inserting nudges:', insertError);
        throw new Error(`Failed to send nudges: ${insertError}`);
      }

      sentCount = nudgesToSend.length;
    }

    // Clean up expired notifications
    await fetch(
      `${Deno.env.get('SUPABASE_URL')}/rest/v1/rpc/cleanup_expired_notifications`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
          'Content-Type': 'application/json'
        }
      }
    ).catch(err => console.warn('Cleanup failed:', err));

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully sent ${sentCount} nudges`,
        sent: sentCount,
        eligible_users: users.length,
        time_of_day: timeOfDay,
        forced: isForced
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Daily nudges error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});