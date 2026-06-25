import { useState, useMemo } from "react";
import PageHeader from "../components/common/PageHeader";
import SearchComparison from "../components/search/SearchComparison";
import { searchTestCases } from "../data/analytics";
import { initialProducts } from "../data/products";
import { Sparkles } from "lucide-react";

export default function SearchTesting() {
  const [searchQuery, setSearchQuery] = useState("something to listen to music while jogging");
  const [products] = useState(() => {
    const stored = localStorage.getItem("admin_products");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  // Derived search results using useMemo instead of useEffect
  const { traditionalResults, aiResults } = useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        traditionalResults: { latency: "0ms", queryType: "SQL SELECT", results: [], matchedTokens: [] },
        aiResults: { latency: "0ms", queryType: "Vector Similarity", results: [] }
      };
    }

    const cleanQuery = searchQuery.trim().toLowerCase();
    
    // 1. Check if it matches a pre-defined high-fidelity test case
    const preDefined = searchTestCases.find(
      (tc) => tc.query.toLowerCase() === cleanQuery
    );

    if (preDefined) {
      // Traditional results from test case: match with actual current products by ID if they exist
      const tradResults = preDefined.traditional.results.map((r) => {
        const currentProd = products.find((p) => p.id === r.id);
        return currentProd ? { ...currentProd, ...r } : null;
      }).filter(Boolean);

      const aiResultsList = preDefined.ai.results.map((r) => {
        const currentProd = products.find((p) => p.id === r.id);
        return currentProd ? { ...currentProd, ...r } : null;
      }).filter(Boolean);

      return {
        traditionalResults: {
          ...preDefined.traditional,
          results: tradResults
        },
        aiResults: {
          ...preDefined.ai,
          results: aiResultsList
        }
      };
    }

    // 2. Custom query simulation
    const tokens = cleanQuery.split(/\s+/).filter((t) => t.length > 2);
    
    // Traditional Search Simulation: Strict text substring
    const tradMatches = products.filter((p) => {
      return tokens.some(
        (t) =>
          p.name.toLowerCase().includes(t) ||
          p.tags.some((tag) => tag.toLowerCase() === t)
      );
    });
    const tradLatency = `${Math.max(1, Math.round(tradMatches.length * 0.2))}ms`;
    
    const matchedTokens = tokens.filter(t => 
      products.some(p => p.name.toLowerCase().includes(t) || p.tags.some(tag => tag.toLowerCase() === t))
    );

    const tradResults = {
      latency: tradLatency,
      queryType: `SELECT * FROM products WHERE (${tokens.map(t => `name LIKE '%${t}%'`).join(" OR ")})`,
      results: tradMatches,
      matchedTokens: matchedTokens
    };

    // AI Semantic Search Simulation: Semantic matching on description + tag embeddings
    // Calculate simulated semantic weights
    const aiMatches = products
      .map((p) => {
        let relevancy = 0;
        let reasons = [];

        // Check category context
        const cat = p.category.toLowerCase();
        if (cleanQuery.includes("electronic") && cat === "electronics") {
          relevancy += 40;
          reasons.push("Category matched 'Electronics'");
        }
        if ((cleanQuery.includes("wear") || cleanQuery.includes("apparel") || cleanQuery.includes("cloth")) && cat === "apparel") {
          relevancy += 45;
          reasons.push("Category matched 'Apparel'");
        }
        if ((cleanQuery.includes("home") || cleanQuery.includes("living") || cleanQuery.includes("kitchen") || cleanQuery.includes("room")) && cat === "home & living") {
          relevancy += 40;
          reasons.push("Category matched 'Home & Living'");
        }

        // Semantic synonym checking
        const desc = p.description.toLowerCase();
        const name = p.name.toLowerCase();
        
        // Audio synonym checks
        if ((cleanQuery.includes("audio") || cleanQuery.includes("sound") || cleanQuery.includes("listen") || cleanQuery.includes("music") || cleanQuery.includes("song")) && p.tags.includes("audio")) {
          relevancy += 50;
          reasons.push("Semantic match for audio equipment");
        }
        
        // Fitness synonym checks
        if ((cleanQuery.includes("sport") || cleanQuery.includes("run") || cleanQuery.includes("fit") || cleanQuery.includes("jog") || cleanQuery.includes("workout")) && (p.tags.includes("fitness") || p.tags.includes("running"))) {
          relevancy += 48;
          reasons.push("Semantic match for athletic/sport activity");
        }
        
        // Office desk checks
        if ((cleanQuery.includes("office") || cleanQuery.includes("desk") || cleanQuery.includes("work") || cleanQuery.includes("type") || cleanQuery.includes("keyboard")) && (p.id === "prod-7" || p.id === "prod-8")) {
          relevancy += 52;
          reasons.push("Context match for office workstation");
        }
        
        // Flask / drink checks
        if ((cleanQuery.includes("drink") || cleanQuery.includes("water") || cleanQuery.includes("cold") || cleanQuery.includes("hot") || cleanQuery.includes("bottle")) && p.id === "prod-3") {
          relevancy += 55;
          reasons.push("Semantic match for hydration flask");
        }

        // Generic token check fallback for scores
        const tokenHits = tokens.filter(t => desc.includes(t) || name.includes(t)).length;
        relevancy += tokenHits * 12;

        if (relevancy > 0) {
          // cap relevancy at 98% for custom simulations
          const finalScore = Math.min(relevancy + 35, 98); 
          const reasonStr = reasons.length > 0 
            ? `Matched via context: ${reasons.join(", ")}`
            : "Concept matches product description index";

          return {
            ...p,
            relevancy: finalScore,
            reason: reasonStr
          };
        }
        return null;
      })
      .filter(Boolean)
      // Sort by relevancy score
      .sort((a, b) => b.relevancy - a.relevancy);

    // AI searches take longer than local SELECTs due to vector arithmetic
    const aiLatency = `${Math.round(aiMatches.length * 0.5 + 35)}ms`; 

    const aiResultsObj = {
      latency: aiLatency,
      queryType: "Vector Similarity (Cosine Distance on OpenAI embeddings-3-large)",
      results: aiMatches
    };

    return {
      traditionalResults: tradResults,
      aiResults: aiResultsObj
    };
  }, [searchQuery, products]);

  const suggestedQueries = [
    "something to listen to music while jogging",
    "keep cold drinks in summer",
    "office desk clicky typing",
    "headphones"
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="AI Vector Search Console"
        subtitle="Compare traditional database keyword lookups with high-performance vector search in real-time."
      >
        <span className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1.5 rounded-xl">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Semantic Index Active
        </span>
      </PageHeader>

      {/* Main Search Comparison Dashboard */}
      <SearchComparison
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        traditionalData={traditionalResults}
        aiData={aiResults}
        suggestedQueries={suggestedQueries}
        onSuggestionClick={setSearchQuery}
      />
    </div>
  );
}
