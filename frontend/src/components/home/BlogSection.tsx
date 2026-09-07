import React, { useState } from "react";
import { BookOpen, Clock, Calendar, ArrowRight, User, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
  excerpt: string;
  content: string;
}

const ARTICLES: Article[] = [
  {
    id: "1",
    title: "Complete Tirupati to Tirumala Ghat Road Driving Guide (2026)",
    category: "Pilgrim Guide",
    readTime: "5 min read",
    date: "Aug 28, 2026",
    author: "Moar Travel Editorial",
    image: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80",
    excerpt: "Essential rules for driving on Tirumala Up-Ghat and Down-Ghat roads, minimum travel time requirements, and scenic viewpoints.",
    content: `Driving your own self-drive vehicle up the holy Seven Hills (Seshachalam ranges) to Tirumala is one of the most spiritual and scenic experiences in South India.

Key Ghat Road Rules & Timings:
1. Speed & Minimum Transit Time: TTD enforces strict automated toll checkpoints. The minimum travel time for Up-Ghat Road is 28 minutes, and Down-Ghat is 40 minutes. Ensure you do not overspeed to prevent penalty tickets.
2. Vehicle Fitness: Automatic hill-hold assist and strong brake pads are vital. All Moar Cars SUVs and Sedans undergo 32-point ghat inspection before handover.
3. Ghat Timings: The ghat roads open at 3:00 AM and close for night traffic at 12:00 Midnight.
4. Scenic Spots: Stop safely at Sri Venkateswara National Park view points and Mokalla Parvatham for memorable photographs.`,
  },
  {
    id: "2",
    title: "Top 5 Scenic Road Trips Starting from Tirupati",
    category: "Road Trips",
    readTime: "6 min read",
    date: "Aug 20, 2026",
    author: "Raghav V.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    excerpt: "Escape to lush greenery: Explore Talakona Waterfalls, Horsley Hills hill station, Kailasakona, and Chandragiri Fort.",
    content: `Beyond the temple towers of Tirupati lie some of Andhra Pradesh's most picturesque natural escapes:

1. Talakona Waterfalls (58 km): The highest waterfall in Andhra Pradesh, nestled deep within dense forests. A high-ground clearance SUV like Mahindra Scorpio or Creta is ideal.
2. Horsley Hills (125 km): Known as the 'Ooty of Andhra', famous for pleasant cool weather, viewpoints, and eucalyptus trees.
3. Chandragiri Fort (15 km): Historical 11th-century palace of the Vijayanagara empire, featuring spectacular sound and light shows.
4. Srikalahasti (38 km): Famous Vayu Linga Shiva temple on the banks of River Swarnamukhi.
5. Pulicat Lake & Bird Sanctuary (90 km): Ideal for bird watchers and serene backwaters.`,
  },
  {
    id: "3",
    title: "Self-Drive vs Taxi: Why Self-Drive Wins for Family Pilgrimages",
    category: "Travel Tips",
    readTime: "4 min read",
    date: "Aug 12, 2026",
    author: "Deepa Menon",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    excerpt: "Why renting a sanitized 7-seater SUV gives you complete privacy, schedule flexibility, and massive cost savings.",
    content: `When travelling with elderly parents and children for temple darshans, peace of mind and comfort are paramount.

Advantages of Self-Drive:
- 100% Privacy: Have personal conversations, play devotional chants, and rest in complete sanctuary.
- Flexible Schedule: No taxi driver waiting charges or rush. Stay in Tirumala as long as your darshan takes.
- Direct Airport/Station Delivery: Start your trip immediately without bargaining with local cabs.
- Cost Effective: For 3+ family members, a self-drive Innova Crysta saves up to 40% compared to multiple taxi bookings.`,
  },
];

export const BlogSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <section className="py-24 bg-brand-mist/40 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-teal flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" /> Travel Guides & Tips
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
              Latest from the <span className="text-brand-teal">Moar Cars Journal</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              Curated road trip guides, Tirumala ghat safety tips, and destination itineraries to make your journey unforgettable.
            </p>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((art) => (
            <article
              key={art.id}
              className="group rounded-3xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              {/* Photo */}
              <div className="relative h-52 w-full overflow-hidden bg-brand-navy">
                <img
                  src={art.image}
                  alt={art.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                  {art.category}
                </span>
                <span className="absolute bottom-3 left-4 text-white/90 text-xs font-medium flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-brand-gold" /> {art.readTime}
                </span>
              </div>

              {/* Text Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {art.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" /> {art.author}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-navy group-hover:text-brand-teal transition-colors line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedArticle(art)}
                    className="p-0 text-xs font-bold text-brand-teal hover:text-brand-navy flex items-center gap-1.5"
                  >
                    Read Guide <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 h-9 w-9 rounded-full bg-brand-mist hover:bg-brand-teal hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-bold uppercase tracking-wider">
                {selectedArticle.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy leading-tight">
                {selectedArticle.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-muted-foreground border-b border-border pb-4">
                <span>By {selectedArticle.author}</span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </div>
            </div>

            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="w-full h-64 object-cover rounded-2xl shadow"
            />

            <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line space-y-4 font-normal">
              {selectedArticle.content}
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <Button
                onClick={() => setSelectedArticle(null)}
                className="bg-brand-navy hover:bg-brand-navy/90 text-white rounded-xl px-6"
              >
                Close Article
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
