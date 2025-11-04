import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Wand2, Loader2, BookOpen, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { generateStory, generateImage, getPromptSuggestions, StoryImage, listAvailableModels } from '@/lib/geminiService';
import { toast } from 'sonner';

const StoryGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [stories, setStories] = useState<StoryImage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const storiesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSuggestions();
    // List available models for debugging
    listAvailableModels();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new story is added
    storiesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [stories]);

  const loadSuggestions = async () => {
    try {
      const prompts = await getPromptSuggestions();
      setSuggestions(prompts);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a story idea! 💡');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate story using Gemini
      const { story, imagePrompt } = await generateStory(prompt);
      
      // Generate image placeholder
      const imageUrl = await generateImage(imagePrompt);

      // Create new story object
      const newStory: StoryImage = {
        prompt: prompt,
        description: imagePrompt,
        story: story,
        imageUrl: imageUrl,
        timestamp: Date.now()
      };

      // Add to stories list
      setStories(prev => [...prev, newStory]);
      setPrompt('');
      
      toast.success('Story created! 🎉');
    } catch (error) {
      console.error('Error generating story:', error);
      toast.error('Oops! Try again 😊');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const useSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
    textareaRef.current?.focus();
  };

  const clearStories = () => {
    setStories([]);
    toast.success('Stories cleared! 🧹');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Story Creator 🎨</h2>
              <p className="text-sm text-muted-foreground">Tell me what story you want to hear!</p>
            </div>
          </div>
          {stories.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearStories}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Stories Display Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {stories.length === 0 ? (
          <Card className="p-8 text-center bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Stories Yet! 📚</h3>
            <p className="text-muted-foreground mb-4">
              Type your story idea below or pick a suggestion to get started!
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-white transition-colors px-3 py-1"
                  onClick={() => useSuggestion(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </Card>
        ) : (
          <>
            {stories.map((storyData, index) => (
              <Card key={index} className="overflow-hidden">
                {/* User Prompt */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                      You
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Your Idea</p>
                      <p className="text-base">{storyData.prompt}</p>
                    </div>
                  </div>
                </div>

                {/* AI Story Response */}
                <div className="p-4 space-y-4">
                  {/* Story Text */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Story Magic ✨</p>
                      <div className="text-base leading-relaxed space-y-2">
                        {storyData.story.split('\n').map((paragraph, idx) => (
                          paragraph.trim() && (
                            <p key={idx} className="text-foreground">
                              {paragraph}
                            </p>
                          )
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Generated Image */}
                  {storyData.imageUrl && (
                    <div className="rounded-lg overflow-hidden border-2 border-primary/20 shadow-lg">
                      <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-semibold text-purple-800">AI Generated Illustration</span>
                      </div>
                      <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 p-4">
                        <img 
                          src={storyData.imageUrl} 
                          alt={storyData.description}
                          className="w-full h-auto rounded-lg shadow-md object-contain"
                          onError={(e) => {
                            console.error('Image failed to load:', storyData.imageUrl);
                            // Show a loading state or retry
                            const imgElement = e.target as HTMLImageElement;
                            imgElement.src = `https://placehold.co/800x450/a78bfa/ffffff?text=Generating+Image...`;
                          }}
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4 bg-muted/30">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Image Description:</p>
                        <p className="text-sm text-foreground leading-relaxed">
                          {storyData.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </>
        )}
        <div ref={storiesEndRef} />
      </div>

      {/* Prompt Suggestions */}
      {stories.length === 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            Try these ideas:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-white hover:border-primary transition-colors px-3 py-2 text-xs"
                onClick={() => useSuggestion(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="flex gap-3">
          <Textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tell me a story about... (Press Enter to send) 💭"
            className="min-h-[80px] resize-none bg-white"
            disabled={isGenerating}
          />
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            size="lg"
            className="self-end gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Create
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          💡 Tip: Ask for stories about emotions, daily activities, or learning new skills!
        </p>
      </Card>
    </div>
  );
};

export default StoryGenerator;
