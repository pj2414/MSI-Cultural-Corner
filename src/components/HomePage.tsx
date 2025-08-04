import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  Trophy, 
  Sparkles, 
  Music, 
  Theater, 
  Palette,
  Camera,
  Star,
  ChevronLeft,
  ChevronRight,
  Award,
  Target
} from "lucide-react";

// Import images
import heroBg from "@/assets/hero-bg1.jpeg";
import drPoojaSingh from "@/assets/dr-pooja-singh.png";
import drSeemaShokeen from "@/assets/dr-seema-shokeen.png";
import pranavJha from "@/assets/pranav-jha.png";
import archanaArora from "@/assets/archana-arora.jpg";
import ishi from "@/assets/ishi.jpg";
import jigisha from "@/assets/jigisha.jpg";
import shauryaPatwal from "@/assets/shaurya-patwal.png";
import genesisFest from "@/assets/genesis-fest-1.jpg";
import navrangFest from "@/assets/navrang-fest-1.jpg";

const HomePage = () => {
  // Audio state and reference
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Component state
  const [currentFestImage, setCurrentFestImage] = useState(0);
  const [hoveredHead, setHoveredHead] = useState<number | null>(null);

  // Audio setup and autoplay effect
  useEffect(() => {
    audioRef.current = new Audio('/abcd.mp3'); // Ensure 'abcd.mp3' is in /public
    audioRef.current.volume = 0.5;
    audioRef.current.loop = true;

    // --- AUTOPLAY LOGIC ---
    const attemptAutoplay = async () => {
      try {
        await audioRef.current?.play();
        setIsPlaying(true); // Update state if autoplay succeeds
      } catch (error) {
        console.log("Autoplay was prevented by the browser. User interaction is required.");
        setIsPlaying(false); // Ensure state is correct if autoplay fails
      }
    };
    
    attemptAutoplay();
    // ----------------------
    
    // Cleanup function to pause audio when the component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []); // Empty dependency array ensures this runs only once
  
  // Function to manually toggle audio playback
  const toggleAudio = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.log('Could not play audio:', error);
        }
      }
    }
  };

  // Data arrays for the page content
  const culturalConveners = [
    { name: "Dr. Pooja Singh", title: "Cultural Convener", image: drPoojaSingh },
    { name: "Dr. Seema Shokeen", title: "Cultural Convener", image: drSeemaShokeen }
  ];

  const culturalHeads = [
    { name: "Pranav Jha", title: "Cultural Head", image: pranavJha, description: "Passionate leader with exceptional vision for cultural excellence.", achievements: ["Led 15+ major events", "Student Excellence Award"], specialty: "Event Management" },
    { name: "Archana Arora", title: "Cultural Head", image: archanaArora, description: "Creative mastermind behind many successful cultural initiatives.", achievements: ["Creative Director Award", "10+ Festival Coordinator"], specialty: "Creative Direction" },
    { name: "Ishi", title: "Cultural Head", image: ishi, description: "Dedicated organizer with remarkable talent for community building.", achievements: ["Outstanding Organizer", "Cultural Ambassador"], specialty: "Community Engagement" },
    { name: "Jigisha", title: "Cultural Head", image: jigisha, description: "Innovative thinker who transforms ideas into memorable experiences.", achievements: ["Innovation Award", "Best Event Planner"], specialty: "Event Innovation" },
    { name: "Shaurya Patwal", title: "Cultural Head", image: shauryaPatwal, description: "Dynamic leader committed to fostering artistic growth.", achievements: ["Leadership Excellence", "Cultural Diversity Advocate"], specialty: "Artistic Development" }
  ];

  const festImages = [
    { name: "Genesis Fest", image: genesisFest },
    { name: "Navrang Festival", image: navrangFest },
  ];

  const stats = [
    { icon: Users, label: "Cultural Societies", value: "22+", color: "text-primary" },
    { icon: Calendar, label: "Events Annually", value: "100+", color: "text-accent" },
    { icon: Trophy, label: "Awards Won", value: "50+", color: "text-primary-glow" },
    { icon: Sparkles, label: "Years of Excellence", value: "10+", color: "text-primary" },
  ];

  const activities = [
    { icon: Music, name: "Music & Dance", desc: "Classical & Contemporary" },
    { icon: Theater, name: "Drama & Theatre", desc: "Stage Performances" },
    { icon: Palette, name: "Arts & Crafts", desc: "Creative Expression" },
    { icon: Camera, name: "Photography", desc: "Visual Storytelling" },
  ];

  // Carousel navigation functions
  const nextFestImage = () => setCurrentFestImage((prev) => (prev + 1) % festImages.length);
  const prevFestImage = () => setCurrentFestImage((prev) => (prev - 1 + festImages.length) % festImages.length);

  return (
    <div className="min-h-screen bg-background">
      {/* Floating Audio Control Button */}
      <Button 
        variant="glass" 
        size="sm" 
        onClick={toggleAudio}
        className="fixed bottom-4 right-4 z-50 backdrop-blur-sm border border-white/10"
      >
        <Music className={`mr-2 h-4 w-4 transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-50'}`} />
        {isPlaying ? 'Pause' : 'Play'} Music
      </Button>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-hero"
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/10 to-background/80" />
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-4 sm:mb-6">
            <Badge variant="outline" className="mb-2 sm:mb-4 text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2 border-primary/30 bg-background/10 backdrop-blur-sm">
              <Star className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Cultural Excellence Since 2015
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-text bg-clip-text text-transparent leading-tight px-2">
            The Cultural Corner
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-2 text-primary-glow px-2">
            MSI - Maharaja Surajmal Institute
          </p>
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
            Where creativity meets excellence. Join our vibrant community of 22+ societies, 100+ annual events, and endless opportunities for cultural expression.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button variant="hero" size="lg" className="w-full sm:w-auto sm:min-w-48">
              <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Explore Societies
            </Button>
            <Button variant="glass" size="lg" className="w-full sm:w-auto sm:min-w-48">
              <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Upcoming Events
            </Button>
          </div>
        </div>
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-10 h-10 sm:w-20 sm:h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-16 sm:bottom-32 right-8 sm:right-16 w-16 h-16 sm:w-32 sm:h-32 bg-accent/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-20 sm:top-40 right-10 sm:right-20 w-8 h-8 sm:w-16 sm:h-16 bg-primary-glow/20 rounded-full blur-xl animate-pulse delay-500" />
      </section>

      {/* Statistics */}
      <section className="py-10 sm:py-16 lg:py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500 group">
                <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                  <stat.icon className={`h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-2 sm:mb-4 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 bg-gradient-text bg-clip-text text-transparent">{stat.value}</h3>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Conveners */}
      <section className="py-10 sm:py-16 lg:py-20 bg-gradient-to-r from-muted/20 to-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 bg-gradient-text bg-clip-text text-transparent px-2">Cultural Conveners</h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">Meet our esteemed faculty members who guide and nurture our cultural journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {culturalConveners.map((convener, index) => (
              <Card key={index} className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500 group">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mx-auto mb-4 sm:mb-6 group-hover:scale-105 transition-transform duration-300">
                    <img src={convener.image} alt={convener.name} className="w-full h-full rounded-full object-cover border-2 sm:border-4 border-primary/20 shadow-glow" />
                    <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-foreground">{convener.name}</h3>
                  <Badge variant="outline" className="border-primary/30 text-xs sm:text-sm">{convener.title}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Heads */}
      <section className="py-10 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 bg-gradient-text bg-clip-text text-transparent px-2">Cultural Heads</h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">Our passionate student leaders who drive cultural excellence</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 relative">
            {culturalHeads.map((head, index) => (
              <div key={index} className="relative" onMouseEnter={() => setHoveredHead(index)} onMouseLeave={() => setHoveredHead(null)}>
                <Card className={`bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500 group ${hoveredHead === index ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-3 sm:mb-4 group-hover:scale-105 transition-transform duration-300">
                      <img src={head.image} alt={head.name} className="w-full h-full rounded-full object-cover border-2 border-primary/20" />
                    </div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 text-foreground">{head.name}</h3>
                    <Badge variant="outline" className="text-xs border-primary/30">{head.title}</Badge>
                  </CardContent>
                </Card>
                {hoveredHead === index && (
                  <Card className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-80 sm:w-96 bg-gradient-card border-border/50 shadow-2xl z-50 opacity-100 transition-all duration-500 animate-in slide-in-from-bottom-4">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                        <div className="relative flex-shrink-0">
                          <img src={head.image} alt={head.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-3 border-primary/30 shadow-glow" />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Star className="w-3 h-3 text-primary-foreground" />
                          </div>
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="text-lg font-bold mb-1 text-foreground">{head.name}</h3>
                          <Badge variant="outline" className="mb-3 border-primary/30">{head.title}</Badge>
                          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{head.description}</p>
                          <div className="mb-3">
                            <div className="flex items-center gap-1 mb-2 justify-center sm:justify-start">
                              <Target className="w-3 h-3 text-primary" /><span className="text-xs font-medium text-primary">Specialty</span>
                            </div>
                            <p className="text-xs text-foreground">{head.specialty}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 mb-2 justify-center sm:justify-start">
                              <Award className="w-3 h-3 text-accent" /><span className="text-xs font-medium text-accent">Achievements</span>
                            </div>
                            <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
                              {head.achievements.slice(0, 2).map((achievement, i) => (
                                <Badge key={i} variant="secondary" className="text-xs py-0 px-2">{achievement}</Badge>
                              ))}
                              {head.achievements.length > 2 && (
                                <Badge variant="secondary" className="text-xs py-0 px-2">+{head.achievements.length - 2} more</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Festival Gallery */}
      <section className="py-10 sm:py-16 lg:py-20 bg-gradient-to-r from-muted/20 to-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 bg-gradient-text bg-clip-text text-transparent px-2">Our Magnificent Festivals</h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">Celebrating creativity through Genesis, Navrang, and many more spectacular events</p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="relative h-48 sm:h-64 lg:h-96 rounded-xl sm:rounded-2xl overflow-hidden shadow-card">
              <img src={festImages[currentFestImage].image} alt={festImages[currentFestImage].name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-1 sm:mb-2">{festImages[currentFestImage].name}</h3>
                <Badge variant="outline" className="border-primary/30 text-xs sm:text-sm">Cultural Excellence</Badge>
              </div>
            </div>
            <button onClick={prevFestImage} className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-background/20 backdrop-blur-sm border border-white/10 rounded-full p-2 sm:p-3 hover:bg-background/40 transition-all duration-300">
              <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6 text-foreground" />
            </button>
            <button onClick={nextFestImage} className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-background/20 backdrop-blur-sm border border-white/10 rounded-full p-2 sm:p-3 hover:bg-background/40 transition-all duration-300">
              <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 text-foreground" />
            </button>
            <div className="flex justify-center mt-4 sm:hidden gap-2">
              {festImages.map((_, index) => (
                <button key={index} onClick={() => setCurrentFestImage(index)} className={`w-2 h-2 rounded-full transition-colors duration-300 ${index === currentFestImage ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="py-10 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 bg-gradient-text bg-clip-text text-transparent px-2">Cultural Activities</h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">Diverse opportunities for creative expression and artistic growth</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {activities.map((activity, index) => (
              <Card key={index} className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500 group">
                <CardContent className="p-4 sm:p-6 text-center">
                  <activity.icon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-3 sm:mb-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-1 sm:mb-2 text-foreground">{activity.name}</h3>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">{activity.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
