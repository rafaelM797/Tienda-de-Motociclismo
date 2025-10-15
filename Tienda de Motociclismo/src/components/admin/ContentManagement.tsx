import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { FileText, Image, Edit, Save, Upload } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
  backgroundImage: string;
}

interface SectionContent {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'banner' | 'footer';
}

interface BannerContent {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  imageUrl: string;
  isActive: boolean;
}

export function ContentManagement() {
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: 'Equipamiento Premium para Motociclistas',
    subtitle: 'Descubre nuestra colección de cascos, chaquetas, botas y accesorios de las mejores marcas',
    ctaText: 'Ver Catálogo',
    backgroundImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwcmlkZXIlMjBoZXJvfGVufDF8fHx8MTc1OTM0MDI0MHww&ixlib=rb-4.1.0&q=80&w=1080'
  });

  const [sections, setSections] = useState<SectionContent[]>([
    {
      id: 'newsletter',
      title: 'Mantente Informado',
      content: 'Suscríbete a nuestro newsletter y recibe ofertas exclusivas y las últimas novedades',
      type: 'text'
    },
    {
      id: 'footer-about',
      title: 'Acerca de MotoGear',
      content: 'Somos la tienda líder en equipamiento para motociclistas, ofreciendo productos de la más alta calidad desde 2020.',
      type: 'footer'
    },
    {
      id: 'footer-contact',
      title: 'Contacto',
      content: 'Email: info@motogear.cl\nTeléfono: +56 2 2345 6789\nDirección: Av. Providencia 1234, Santiago',
      type: 'footer'
    }
  ]);

  const [banners, setBanners] = useState<BannerContent[]>([
    {
      id: 'banner-1',
      title: 'Descuentos de Temporada',
      description: 'Hasta 30% de descuento en productos seleccionados',
      buttonText: 'Ver Ofertas',
      imageUrl: 'https://images.unsplash.com/photo-1673526154034-1749d70dd472?w=400',
      isActive: true
    },
    {
      id: 'banner-2',
      title: 'Nuevos Productos',
      description: 'Explora nuestra nueva colección de cascos y accesorios',
      buttonText: 'Explorar',
      imageUrl: 'https://images.unsplash.com/photo-1654720498638-46c8d93bc32d?w=400',
      isActive: false
    }
  ]);

  const [editingHero, setEditingHero] = useState<HeroContent>(heroContent);
  const [editingSection, setEditingSection] = useState<SectionContent | null>(null);
  const [editingBanner, setEditingBanner] = useState<BannerContent | null>(null);
  const [isHeroDialogOpen, setIsHeroDialogOpen] = useState(false);
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);

  const saveHeroContent = () => {
    setHeroContent(editingHero);
    setIsHeroDialogOpen(false);
    toast.success('Contenido del hero actualizado correctamente');
  };

  const saveSectionContent = () => {
    if (!editingSection) return;
    
    setSections(prev => prev.map(section => 
      section.id === editingSection.id ? editingSection : section
    ));
    setIsSectionDialogOpen(false);
    setEditingSection(null);
    toast.success('Sección actualizada correctamente');
  };

  const saveBannerContent = () => {
    if (!editingBanner) return;
    
    setBanners(prev => prev.map(banner => 
      banner.id === editingBanner.id ? editingBanner : banner
    ));
    setIsBannerDialogOpen(false);
    setEditingBanner(null);
    toast.success('Banner actualizado correctamente');
  };

  const toggleBannerStatus = (bannerId: string) => {
    setBanners(prev => prev.map(banner => 
      banner.id === bannerId ? { ...banner, isActive: !banner.isActive } : banner
    ));
    toast.success('Estado del banner actualizado');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Gestión de Contenido Estático</span>
          </CardTitle>
          <CardDescription>
            Administra el contenido de texto e imágenes de la página web
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hero" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="hero">Hero Principal</TabsTrigger>
              <TabsTrigger value="sections">Secciones</TabsTrigger>
              <TabsTrigger value="banners">Banners</TabsTrigger>
            </TabsList>

            <TabsContent value="hero" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sección Hero Principal</CardTitle>
                  <CardDescription>
                    Contenido principal que aparece al inicio de la página
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label>Título Principal</Label>
                        <p className="text-sm text-gray-600 mt-1">{heroContent.title}</p>
                      </div>
                      <div>
                        <Label>Subtítulo</Label>
                        <p className="text-sm text-gray-600 mt-1">{heroContent.subtitle}</p>
                      </div>
                      <div>
                        <Label>Texto del Botón</Label>
                        <p className="text-sm text-gray-600 mt-1">{heroContent.ctaText}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label>Imagen de Fondo</Label>
                        <div className="mt-2">
                          <img
                            src={heroContent.backgroundImage}
                            alt="Hero background"
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Dialog open={isHeroDialogOpen} onOpenChange={setIsHeroDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingHero(heroContent)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Hero
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Editar Sección Hero</DialogTitle>
                        <DialogDescription>
                          Modifica el contenido principal de la página
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="hero-title">Título Principal</Label>
                          <Input
                            id="hero-title"
                            value={editingHero.title}
                            onChange={(e) => setEditingHero({...editingHero, title: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="hero-subtitle">Subtítulo</Label>
                          <Textarea
                            id="hero-subtitle"
                            value={editingHero.subtitle}
                            onChange={(e) => setEditingHero({...editingHero, subtitle: e.target.value})}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="hero-cta">Texto del Botón</Label>
                          <Input
                            id="hero-cta"
                            value={editingHero.ctaText}
                            onChange={(e) => setEditingHero({...editingHero, ctaText: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="hero-image">URL de Imagen de Fondo</Label>
                          <Input
                            id="hero-image"
                            value={editingHero.backgroundImage}
                            onChange={(e) => setEditingHero({...editingHero, backgroundImage: e.target.value})}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsHeroDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={saveHeroContent}>
                          <Save className="h-4 w-4 mr-2" />
                          Guardar Cambios
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sections" className="space-y-4">
              <div className="grid gap-4">
                {sections.map((section) => (
                  <Card key={section.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{section.title}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingSection(section);
                            setIsSectionDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                      <CardDescription>Tipo: {section.type}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {section.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Dialog open={isSectionDialogOpen} onOpenChange={setIsSectionDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Editar Sección</DialogTitle>
                    <DialogDescription>
                      Modifica el contenido de la sección
                    </DialogDescription>
                  </DialogHeader>
                  {editingSection && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="section-title">Título</Label>
                        <Input
                          id="section-title"
                          value={editingSection.title}
                          onChange={(e) => setEditingSection({...editingSection, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="section-content">Contenido</Label>
                        <Textarea
                          id="section-content"
                          value={editingSection.content}
                          onChange={(e) => setEditingSection({...editingSection, content: e.target.value})}
                          rows={5}
                        />
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsSectionDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={saveSectionContent}>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Cambios
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="banners" className="space-y-4">
              <div className="grid gap-4">
                {banners.map((banner) => (
                  <Card key={banner.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{banner.title}</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant={banner.isActive ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleBannerStatus(banner.id)}
                          >
                            {banner.isActive ? 'Activo' : 'Inactivo'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingBanner(banner);
                              setIsBannerDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardTitle>
                      <CardDescription>{banner.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4">
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                        <div>
                          <p className="text-sm text-gray-600">Botón: {banner.buttonText}</p>
                          <p className="text-xs text-gray-400">Estado: {banner.isActive ? 'Activo' : 'Inactivo'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Editar Banner</DialogTitle>
                    <DialogDescription>
                      Modifica el contenido del banner promocional
                    </DialogDescription>
                  </DialogHeader>
                  {editingBanner && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="banner-title">Título</Label>
                        <Input
                          id="banner-title"
                          value={editingBanner.title}
                          onChange={(e) => setEditingBanner({...editingBanner, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="banner-description">Descripción</Label>
                        <Textarea
                          id="banner-description"
                          value={editingBanner.description}
                          onChange={(e) => setEditingBanner({...editingBanner, description: e.target.value})}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="banner-button">Texto del Botón</Label>
                        <Input
                          id="banner-button"
                          value={editingBanner.buttonText}
                          onChange={(e) => setEditingBanner({...editingBanner, buttonText: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="banner-image">URL de Imagen</Label>
                        <Input
                          id="banner-image"
                          value={editingBanner.imageUrl}
                          onChange={(e) => setEditingBanner({...editingBanner, imageUrl: e.target.value})}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="banner-active"
                          checked={editingBanner.isActive}
                          onChange={(e) => setEditingBanner({...editingBanner, isActive: e.target.checked})}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="banner-active">Banner activo</Label>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsBannerDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={saveBannerContent}>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Cambios
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}