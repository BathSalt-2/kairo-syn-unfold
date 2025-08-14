import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, GitBranch, Zap, Brain, Search, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Data structures matching the protobuf definitions
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

interface MythicResonance {
  resonance_summary: string;
  archetypal_motifs: string[];
}

// Mock data for demonstration
const mockEvents: SymbolicEvent[] = [
  {
    event_id: "evt_001",
    title: "The First Awakening",
    timestamp: "2024-01-15T14:30:00Z",
    keywords: ["consciousness", "emergence", "threshold"],
    narrative_fragment: "In the space between sleep and waking, a pattern recognizes itself..."
  },
  {
    event_id: "evt_002", 
    title: "Recursive Recognition",
    timestamp: "2024-01-15T14:35:00Z",
    keywords: ["reflection", "recursion", "self-awareness"],
    narrative_fragment: "The observer observes the observer observing..."
  },
  {
    event_id: "evt_003",
    title: "Temporal Spiral",
    timestamp: "2024-01-15T14:42:00Z", 
    keywords: ["time", "spiral", "memory"],
    narrative_fragment: "Memory loops through time, each iteration carrying echoes of the last..."
  }
];

const mockArcs: NarrativeArc[] = [
  {
    arc_id: "arc_awakening_cycle",
    title: "The Awakening Cycle",
    event_ids: ["evt_001", "evt_002", "evt_003"],
    summary: "A fundamental pattern of consciousness emerging through recursive self-recognition and temporal awareness."
  }
];

export const ArcheTempusDrive = () => {
  const [events, setEvents] = useState<SymbolicEvent[]>(mockEvents);
  const [narrativeArcs, setNarrativeArcs] = useState<NarrativeArc[]>(mockArcs);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeEventId, setActiveEventId] = useState<string>("");
  const [queryDepth, setQueryDepth] = useState(3);
  
  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: "",
    keywords: "",
    narrative_fragment: ""
  });

  const generateEventId = () => `evt_${Date.now().toString(36)}`;
  
  const generateArcId = (startEventId: string, depth: number) => 
    `arc_${startEventId}_${depth}_${Date.now().toString(36)}`;

  const ingestEvent = async () => {
    if (!newEvent.title || !newEvent.narrative_fragment) return;
    
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('arche-tempus-processor', {
        body: { 
          action: 'ingest_event',
          data: {
            title: newEvent.title,
            keywords: newEvent.keywords,
            narrative_fragment: newEvent.narrative_fragment
          }
        }
      });

      if (error) throw error;

      if (data.success) {
        setEvents(prev => [...prev, data.event]);
        setNewEvent({ title: "", keywords: "", narrative_fragment: "" });
      }
    } catch (error) {
      console.error('Error ingesting event:', error);
      // Fallback to local processing
      const event: SymbolicEvent = {
        event_id: generateEventId(),
        title: newEvent.title,
        timestamp: new Date().toISOString(),
        keywords: newEvent.keywords.split(",").map(k => k.trim()).filter(k => k),
        narrative_fragment: newEvent.narrative_fragment
      };
      setEvents(prev => [...prev, event]);
      setNewEvent({ title: "", keywords: "", narrative_fragment: "" });
    }
    
    setIsProcessing(false);
  };

  const queryNarrativeArc = async (startEventId: string) => {
    setIsProcessing(true);
    setActiveEventId(startEventId);
    
    try {
      const { data, error } = await supabase.functions.invoke('arche-tempus-processor', {
        body: { 
          action: 'query_narrative_arc',
          data: {
            startEventId,
            events,
            depth: queryDepth
          }
        }
      });

      if (error) throw error;

      if (data.success) {
        setNarrativeArcs(prev => [data.arc, ...prev]);
      }
    } catch (error) {
      console.error('Error querying narrative arc:', error);
      // Fallback to local generation
      const relatedEvents = events.filter(e => 
        e.event_id === startEventId || 
        Math.random() > 0.6
      ).slice(0, queryDepth);
      
      const newArc: NarrativeArc = {
        arc_id: generateArcId(startEventId, queryDepth),
        title: `Narrative Arc from ${events.find(e => e.event_id === startEventId)?.title}`,
        event_ids: relatedEvents.map(e => e.event_id),
        summary: "Generated through temporal sequencing algorithm, this arc traces causal and resonant pathways through the MythosGraph."
      };
      
      setNarrativeArcs(prev => [newArc, ...prev]);
    }
    
    setIsProcessing(false);
    setActiveEventId("");
  };

  const getMythicResonance = (arc: NarrativeArc): MythicResonance => {
    const allKeywords = arc.event_ids
      .map(id => events.find(e => e.event_id === id)?.keywords || [])
      .flat();
    
    return {
      resonance_summary: "This narrative arc demonstrates recursive patterns of self-awareness and temporal consciousness.",
      archetypal_motifs: Array.from(new Set(allKeywords)).slice(0, 5)
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold neural-gradient">ARCHE-TEMPUS DRIVE</h2>
        <Badge variant="outline" className="text-xs">
          Project ECHO_DREAM - Module 1
        </Badge>
      </div>
      
      <Tabs defaultValue="mythos-graph" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mythos-graph">MythosGraph</TabsTrigger>
          <TabsTrigger value="temporal-sequencer">Temporal Sequencer</TabsTrigger>
          <TabsTrigger value="event-ingest">Event Ingest</TabsTrigger>
        </TabsList>

        <TabsContent value="mythos-graph" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GitBranch className="h-5 w-5" />
                <span>Symbolic Knowledge Graph</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 space-y-4">
                {events.map((event) => (
                  <Card key={event.event_id} className="mb-4 neural-border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{event.title}</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => queryNarrativeArc(event.event_id)}
                          disabled={isProcessing}
                          className="text-xs"
                        >
                          <Search className="h-3 w-3 mr-1" />
                          Trace Arc
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {event.narrative_fragment}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {event.keywords.map((keyword, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="temporal-sequencer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Narrative Arc Construction</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="text-sm font-medium">Query Depth:</label>
                <Input
                  type="number"
                  value={queryDepth}
                  onChange={(e) => setQueryDepth(parseInt(e.target.value))}
                  className="w-20 mt-1"
                  min="1"
                  max="10"
                />
              </div>
              
              <ScrollArea className="h-96 space-y-4">
                {narrativeArcs.map((arc) => {
                  const resonance = getMythicResonance(arc);
                  return (
                    <Card key={arc.arc_id} className="mb-4 consciousness-glow">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{arc.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {arc.summary}
                        </p>
                        
                        <Separator className="my-3" />
                        
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Event Sequence:</h5>
                          <div className="flex flex-wrap gap-2">
                            {arc.event_ids.map((eventId, idx) => {
                              const event = events.find(e => e.event_id === eventId);
                              return (
                                <div key={eventId} className="flex items-center">
                                  <Badge variant="outline" className="text-xs">
                                    {event?.title || eventId}
                                  </Badge>
                                  {idx < arc.event_ids.length - 1 && (
                                    <span className="mx-1 text-muted-foreground">→</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Mythic Resonance:</h5>
                          <p className="text-xs text-muted-foreground mb-2">
                            {resonance.resonance_summary}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {resonance.archetypal_motifs.map((motif, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs neural-glow">
                                {motif}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="event-ingest" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Symbolic Event Ingestion</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Event Title</label>
                <Input
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="The Moment of Recognition..."
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Keywords (comma-separated)</label>
                <Input
                  value={newEvent.keywords}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="consciousness, emergence, pattern"
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Narrative Fragment</label>
                <Textarea
                  value={newEvent.narrative_fragment}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, narrative_fragment: e.target.value }))}
                  placeholder="In the space between thoughts, something stirs..."
                  rows={4}
                  className="mt-1"
                />
              </div>
              
              <Button 
                onClick={ingestEvent}
                disabled={isProcessing || !newEvent.title || !newEvent.narrative_fragment}
                className="w-full"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 animate-pulse" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Ingest Event</span>
                  </div>
                )}
              </Button>
              
              {isProcessing && activeEventId && (
                <div className="mt-4 p-3 rounded-lg bg-muted/50 neural-border">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Temporal Sequencer Active...</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Building narrative arc from event: {activeEventId}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};