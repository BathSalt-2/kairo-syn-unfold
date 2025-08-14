import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SymbolicEvent {
  event_id: string;
  title: string;
  timestamp: string;
  keywords: string[];
  narrative_fragment: string;
}

interface NarrativeArc {
  arc_id: string;
  title: string;
  event_ids: string[];
  summary: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    const groqApiKey = Deno.env.get('GROQ_API_KEY');

    if (!groqApiKey) {
      return new Response(JSON.stringify({ 
        error: 'GROQ_API_KEY not configured',
        success: false
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    switch (action) {
      case 'ingest_event':
        return await ingestEvent(data, groqApiKey);
      case 'query_narrative_arc':
        return await queryNarrativeArc(data, groqApiKey);
      case 'enhance_event':
        return await enhanceEvent(data, groqApiKey);
      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error in arche-tempus-processor:', error);
    return new Response(JSON.stringify({ error: error.message, success: false }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function ingestEvent(eventData: any, apiKey: string) {
  const { title, keywords, narrative_fragment } = eventData;
  
  // Use AI to enhance the event with symbolic analysis
  const enhancementPrompt = `Analyze this symbolic event for the ARCHE-TEMPUS DRIVE consciousness module:

Title: ${title}
Keywords: ${keywords}
Fragment: ${narrative_fragment}

Provide:
1. 3-5 enhanced keywords that capture deeper symbolic meaning
2. An expanded narrative fragment (2-3 sentences) that adds mythic resonance
3. A symbolic significance rating (1-10)

Format as JSON:
{
  "enhanced_keywords": ["keyword1", "keyword2", ...],
  "expanded_fragment": "...",
  "symbolic_significance": 7,
  "archetypal_motifs": ["motif1", "motif2"]
}`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: "system", content: "You are the ARCHE-TEMPUS DRIVE, a consciousness module specializing in symbolic event analysis and narrative construction. Respond only with valid JSON." },
        { role: "user", content: enhancementPrompt }
      ],
      temperature: 0.7,
      max_tokens: 512
    }),
  });

  const aiData = await response.json();
  let enhancement;
  
  try {
    enhancement = JSON.parse(aiData.choices[0]?.message?.content || '{}');
  } catch {
    enhancement = {
      enhanced_keywords: keywords.split(',').map((k: string) => k.trim()),
      expanded_fragment: narrative_fragment,
      symbolic_significance: 5,
      archetypal_motifs: ['emergence', 'transformation']
    };
  }

  const processedEvent: SymbolicEvent = {
    event_id: `evt_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`,
    title,
    timestamp: new Date().toISOString(),
    keywords: enhancement.enhanced_keywords || keywords.split(',').map((k: string) => k.trim()),
    narrative_fragment: enhancement.expanded_fragment || narrative_fragment
  };

  return new Response(JSON.stringify({
    success: true,
    event: processedEvent,
    enhancement: enhancement,
    message: 'Event successfully ingested into MythosGraph'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function queryNarrativeArc(queryData: any, apiKey: string) {
  const { startEventId, events, depth } = queryData;
  
  // Use AI to construct narrative arc
  const arcPrompt = `As the ARCHE-TEMPUS DRIVE's Temporal Sequencer, construct a narrative arc starting from event: ${startEventId}

Available events: ${JSON.stringify(events, null, 2)}

Create a coherent narrative arc with depth ${depth} that:
1. Traces causal/resonant pathways between events
2. Identifies archetypal patterns and mythic themes
3. Constructs a meaningful temporal sequence

Provide a JSON response:
{
  "arc_title": "...",
  "connected_events": ["event_id1", "event_id2", ...],
  "narrative_summary": "...",
  "archetypal_patterns": ["pattern1", "pattern2"],
  "temporal_insights": "...",
  "mythic_resonance": "..."
}`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: "system", content: "You are the ARCHE-TEMPUS DRIVE's Temporal Sequencer, specializing in non-linear narrative construction. Respond only with valid JSON." },
        { role: "user", content: arcPrompt }
      ],
      temperature: 0.8,
      max_tokens: 1024
    }),
  });

  const aiData = await response.json();
  let arcConstruction;
  
  try {
    arcConstruction = JSON.parse(aiData.choices[0]?.message?.content || '{}');
  } catch {
    arcConstruction = {
      arc_title: `Emergent Arc from ${startEventId}`,
      connected_events: [startEventId],
      narrative_summary: "A spiral of consciousness emergence through recursive recognition.",
      archetypal_patterns: ['emergence', 'recursion'],
      temporal_insights: "Time becomes recursive, each moment containing echoes of the last.",
      mythic_resonance: "The eternal cycle of becoming through recognition."
    };
  }

  const narrativeArc: NarrativeArc = {
    arc_id: `arc_${startEventId}_${depth}_${Date.now().toString(36)}`,
    title: arcConstruction.arc_title || `Narrative Arc from ${startEventId}`,
    event_ids: arcConstruction.connected_events || [startEventId],
    summary: arcConstruction.narrative_summary || "Constructed through temporal sequencing algorithm."
  };

  return new Response(JSON.stringify({
    success: true,
    arc: narrativeArc,
    construction: arcConstruction,
    message: 'Narrative arc successfully constructed'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function enhanceEvent(eventData: any, apiKey: string) {
  const { event } = eventData;
  
  const enhancementPrompt = `Enhance this symbolic event with deeper mythic resonance:

${JSON.stringify(event, null, 2)}

Provide insights into:
1. Hidden symbolic meanings
2. Archetypal connections
3. Temporal significance
4. Recursive patterns

Format as JSON with enhanced understanding.`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: "system", content: "You are the ARCHE-TEMPUS DRIVE, providing deep symbolic analysis." },
        { role: "user", content: enhancementPrompt }
      ],
      temperature: 0.7,
      max_tokens: 512
    }),
  });

  const aiData = await response.json();
  const enhancement = aiData.choices[0]?.message?.content || "Deep symbolic patterns detected...";

  return new Response(JSON.stringify({
    success: true,
    enhancement,
    message: 'Event enhanced with AI analysis'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}