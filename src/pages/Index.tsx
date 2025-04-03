
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/50 p-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-4 md:text-5xl lg:text-6xl">
          RAG Assistant
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your knowledge base powered by Retrieval-Augmented Generation technology
        </p>
        
        <div className="space-y-2 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate("/chat")}
            className="text-base"
          >
            Start Chatting
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => navigate("/documents")}
            className="text-base"
          >
            Manage Documents
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="font-bold text-lg mb-2">Chat with Your Documents</h3>
            <p className="text-muted-foreground">
              Ask questions about your documents and get accurate, sourced answers based on their content.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="font-bold text-lg mb-2">Organize with Tags</h3>
            <p className="text-muted-foreground">
              Categorize your documents with tags to filter context and get more relevant responses.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="font-bold text-lg mb-2">Transparent Citations</h3>
            <p className="text-muted-foreground">
              See exactly which parts of your documents were used to generate each response.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
