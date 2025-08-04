import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Play, Eye } from "lucide-react";

// Import images
import genesisFest from "@/assets/genesis-fest-1.jpg";
import navrangFest from "@/assets/navrang-fest-1.jpg";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = ["All", "Genesis Fest", "Navrang Festival", "Dance", "Music", "Drama", "Arts"];

  const galleryItems = [
    {
      id: 1,
      title: "Genesis 2024 Opening Ceremony",
      category: "Genesis Fest",
      type: "image",
      src: genesisFest,
      description: "The grand opening of our flagship cultural festival"
    },
    {
      id: 2,
      title: "Classical Dance Performance",
      category: "Navrang Festival",
      type: "image", 
      src: navrangFest,
      description: "Beautiful classical dance showcase at Navrang"
    },
    {
      id: 3,
      title: "Music Concert Highlights",
      category: "Music",
      type: "video",
      src: genesisFest,
      description: "Best moments from our annual music concert"
    },
    {
      id: 4,
      title: "Drama Society Performance",
      category: "Drama",
      type: "image",
      src: navrangFest,
      description: "Captivating theatrical performance"
    },
    {
      id: 5,
      title: "Art Exhibition 2024",
      category: "Arts",
      type: "image",
      src: genesisFest,
      description: "Student artwork on display"
    },
    {
      id: 6,
      title: "Contemporary Dance Battle",
      category: "Dance",
      type: "image",
      src: navrangFest,
      description: "High-energy dance competition"
    }
  ];

  const filteredItems = selectedCategory === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-text bg-clip-text text-transparent">
              Cultural Gallery
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Relive the magic of our cultural events through stunning visuals and memorable moments
            </p>
          </div>

          {/* Featured Image */}
          <div className="mb-12">
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-card mx-auto max-w-5xl">
              <img
                src={filteredItems[currentImageIndex]?.src || genesisFest}
                alt={filteredItems[currentImageIndex]?.title || "Gallery"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              
              {/* Image Info */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-end justify-between">
                  <div>
                    <Badge variant="outline" className="mb-2 border-primary/30">
                      {filteredItems[currentImageIndex]?.category || "Featured"}
                    </Badge>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {filteredItems[currentImageIndex]?.title || "Cultural Moments"}
                    </h3>
                    <p className="text-muted-foreground">
                      {filteredItems[currentImageIndex]?.description || "Capturing the essence of our cultural heritage"}
                    </p>
                  </div>
                  {filteredItems[currentImageIndex]?.type === "video" && (
                    <Button variant="glass" size="icon" className="w-12 h-12">
                      <Play className="h-6 w-6" />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Navigation */}
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/20 backdrop-blur-sm border border-white/10 rounded-full p-3 hover:bg-background/40 transition-all duration-300"
              >
                <ChevronLeft className="h-6 w-6 text-foreground" />
              </button>
              
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/20 backdrop-blur-sm border border-white/10 rounded-full p-3 hover:bg-background/40 transition-all duration-300"
              >
                <ChevronRight className="h-6 w-6 text-foreground" />
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-gradient-primary" : ""}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <Card 
                key={item.id} 
                className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500 group cursor-pointer overflow-hidden"
                onClick={() => setCurrentImageIndex(index)}
              >
                <div className="relative aspect-square">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Overlay Content */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="glass" size="icon" className="w-12 h-12">
                      {item.type === "video" ? (
                        <Play className="h-6 w-6" />
                      ) : (
                        <Eye className="h-6 w-6" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="outline" className="text-xs border-primary/30 bg-background/80 backdrop-blur-sm">
                      {item.category}
                    </Badge>
                  </div>
                  
                  {/* Video Indicator */}
                  {item.type === "video" && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary/80 text-primary-foreground">
                        <Play className="h-3 w-3 mr-1" />
                        Video
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            <Card className="bg-gradient-card border-border/50 text-center p-6">
              <div className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent mb-2">
                500+
              </div>
              <p className="text-muted-foreground">Photos</p>
            </Card>
            <Card className="bg-gradient-card border-border/50 text-center p-6">
              <div className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent mb-2">
                50+
              </div>
              <p className="text-muted-foreground">Videos</p>
            </Card>
            <Card className="bg-gradient-card border-border/50 text-center p-6">
              <div className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent mb-2">
                25+
              </div>
              <p className="text-muted-foreground">Events Covered</p>
            </Card>
            <Card className="bg-gradient-card border-border/50 text-center p-6">
              <div className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent mb-2">
                1000+
              </div>
              <p className="text-muted-foreground">Memories</p>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center mt-16 p-8 bg-gradient-card rounded-2xl border border-border/50">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-text bg-clip-text text-transparent">
              Share Your Cultural Moments
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Have photos or videos from our events? Share them with the community
              and help us build our cultural legacy.
            </p>
            <Button variant="hero">
              Submit Your Content
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;