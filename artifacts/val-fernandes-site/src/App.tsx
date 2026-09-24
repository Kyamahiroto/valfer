import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Activity,
  ArrowRight,
  Brain,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Compass,
  Heart,
  Instagram,
  LineChart,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFoundFallback from '@/pages/not-found';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

const queryClient = new QueryClient();
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const asset = (file: string) => `${base}/assets/${file}`;
const whatsapp = 'https://wa.me/5565992199578';
const whatsappLink = (message?: string) => `${whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

const relationshipMessage = 'Olá, Val! Quero salvar meu relacionamento e gostaria de saber como funciona o atendimento.';
const separationMessage = 'Olá, Val! Preciso de ajuda para me curar dessa separação e gostaria de agendar uma conversa.';
const welcomeMessage = 'Olá, Val! Gostaria de agendar minha sessão de acolhimento.';
const mentoriaMessage = 'Olá, Val! Tenho interesse na Mentoria Academia da Mente. Pode me passar mais informações?';
const processoMessage = 'Olá, Val! Tenho interesse no Processo Terapêutico. Gostaria de saber mais e agendar uma conversa.';

type IconType = typeof Heart;

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="logo-container">
      <img className="logo-icon" src={asset('logo-small.png')} alt="Símbolo de Val Fernandes" />
      {!compact && (
        <span className="logo-text">
          <strong>Val Fernandes</strong>
          <span>Inteligência Emocional</span>
        </span>
      )}
    </span>
  );
}

function WhatsAppIcon({ size = 17 }: { size?: number }) {
  return <MessageCircle size={size} strokeWidth={2.3} aria-hidden="true" />;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return (
    <header className="site-header">
      <Link href="/" className="logo-container" onClick={closeMenu} data-testid="link-home-logo">
        <Logo />
      </Link>
      <nav aria-label="Navegação principal">
        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <li><a href="/#inicio" className="nav-link" onClick={closeMenu} data-testid="link-sobre">Sobre</a></li>
          <li><Link href="/processo-terapeutico" className="nav-link" onClick={closeMenu} data-testid="link-processo-nav">Processo Terapêutico</Link></li>
          <li><Link href="/mentoria" className="nav-link" onClick={closeMenu} data-testid="link-mentoria-nav">Mentoria Academia da Mente</Link></li>
          <li><Link href="/blog.html" className="nav-link" onClick={closeMenu} data-testid="link-blog-nav">Blog</Link></li>
          <li><a href="/#contato" className="nav-link" onClick={closeMenu} data-testid="link-contato">Contato</a></li>
        </ul>
      </nav>
      <a className="header-cta" href={whatsappLink(welcomeMessage)} target="_blank" rel="noopener noreferrer" data-testid="link-header-whatsapp">
        <WhatsAppIcon size={15} /> Agendar conversa
      </a>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} data-testid="button-menu-toggle">
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <Link href="/" data-testid="link-footer-home"><Logo /></Link>
      <div className="footer-credit">
        <p className="footer-copy">© 2026 Val Fernandes. Todos os direitos reservados.</p>
        <a className="gestoron-signature" href="https://gestoron.com.br/" target="_blank" rel="noopener noreferrer" aria-label="Desenvolvido e hospedado por Gestoron" data-testid="link-gestoron">
          <span className="gestoron-top-area">
            <span className="gestoron-mark" aria-hidden="true">G</span>
            <span className="gestoron-dynamic-text">Gestoron</span>
          </span>
          <span className="gestoron-static-text">Desenvolvido e hospedado por</span>
        </a>
      </div>
      <ul className="footer-links">
        <li><Link href="/politica-de-privacidade.html" data-testid="link-privacy-footer">Políticas de Privacidade</Link></li>
        <li><Link href="/termos-de-uso.html" data-testid="link-terms-footer">Termos de Uso</Link></li>
      </ul>
    </footer>
  );
}

function FloatingWhatsApp() {
  return (
    <a className="whatsapp-float" href={whatsappLink(welcomeMessage)} target="_blank" rel="noopener noreferrer" aria-label="Falar com Val Fernandes pelo WhatsApp" data-testid="link-floating-whatsapp">
      <span className="whatsapp-pulse" aria-hidden="true" />
      <WhatsAppIcon size={29} />
    </a>
  );
}

const attentionItems: { label: string; icon: IconType }[] = [
  { label: 'Ansiedade e estresse', icon: Activity },
  { label: 'Depressão e tristeza', icon: Compass },
  { label: 'Autoestima e autoconfiança', icon: CircleUserRound },
  { label: 'Relações saudáveis', icon: Heart },
  { label: 'Traumas e dores emocionais', icon: ShieldCheck },
  { label: 'Desenvolvimento pessoal', icon: Sparkles },
  { label: 'Propósito e sentido de vida', icon: Target },
  { label: 'Inteligência emocional', icon: Brain },
];

const steps: { title: string; body: string; icon: IconType }[] = [
  { title: 'Acolhimento', body: 'Escuta empática e segura para entender sua história.', icon: Heart },
  { title: 'Compreensão', body: 'Investigamos juntos as emoções e padrões que te impactam.', icon: Search },
  { title: 'Transformação', body: 'Trabalhamos bloqueios e desenvolvemos novas perspectivas.', icon: Sparkles },
  { title: 'Integração', body: 'Você aplica aprendizados no seu dia a dia com consciência.', icon: ShieldCheck },
  { title: 'Evolução', body: 'Mais equilíbrio, clareza e liberdade para viver sua melhor versão.', icon: Target },
];

const posts = [
  {
    id: 1,
    title: 'Como a Hipnoterapia Pode Destravar Padrões Subconscientes',
    category: 'Hipnoterapia',
    excerpt: 'Entenda como o acesso ao subconsciente permite ressignificar traumas antigos e criar novas programações mentais saudáveis.',
    image: 'expert2.jpeg',
    date: '10 de Agosto, 2026',
    content: 'Muitas das nossas reações automáticas, medos e bloqueios têm origem em memórias guardadas no subconsciente. A hipnoterapia clínica é uma ferramenta terapêutica de alta precisão que permite acessar esses registros de forma segura e acolhedora.\n\nDurante o processo, o paciente permanece em estado de relaxamento profundo e foco direcionado, mantendo o controle total da sua mente. É nesse estado que conseguimos desarmar crenças limitantes sobre valor próprio, fracasso ou rejeição, substituindo-as por sentimentos de capacidade, paz e segurança.',
  },
  {
    id: 2,
    title: 'Ansiedade Generalizada: Compreendendo os Sinais do Seu Corpo',
    category: 'Ansiedade & Pânico',
    excerpt: 'A ansiedade não é um inimigo, mas um alerta do seu corpo. Saiba como a Psicanálise ajuda a identificar as causas profundas.',
    image: 'expert.png',
    date: '04 de Agosto, 2026',
    content: 'Taquicardia, pensamentos acelerados, sensação de aperto no peito e preocupação constante com o futuro são sintomas frequentes da Ansiedade Generalizada e da Síndrome do Pânico.\n\nAtravés da Psicanálise Clínica, buscamos não apenas aliviar os sintomas, mas compreender o que o seu inconsciente está tentando expressar. Ao dar voz a emoções reprimidas e feridas não curadas, a necessidade do sintoma ansioso se dissipa, devolvendo a tranquilidade ao seu dia a dia.',
  },
  {
    id: 3,
    title: 'Feridas Emocionais da Infância e Seus Impactos nas Relações',
    category: 'Relacionamentos',
    excerpt: 'Abandono, rejeição e traição no passado costumam se repetir nos relacionamentos adultos. Aprenda a quebrar esse ciclo.',
    image: 'testimonials/testimonial_4.png',
    date: '28 de Julho, 2026',
    content: 'Quando carregamos feridas emocionais de rejeição, abandono ou traição, é comum desenvolvermos comportamentos defensivos nos relacionamentos adultos — como ciúme excessivo, medo da intimidade ou dependência emocional.\n\nCom a Terapia Sistêmica e a Reprogramação de Crenças, investigamos a dinâmica familiar e os padrões inconscientes para que você possa estabelecer limites saudáveis, cultivar a autoestima e construir relações baseadas no respeito e no amor autêntico.',
  },
];

const reviews = [
  ['Alexandre Eustáquio', '30/03/2025', 'testimonial_1.png', 'Excelente Profissional. Super indico!'],
  ['Dra. Anny Macedo', '29/03/2025', 'testimonial_2.png', 'Excelente profissional! Super atenciosa! Aumentou minha visualização no Google, trazendo mais pacientes!'],
  ['Robson Henrique Paes de Ba...', '29/03/2025', 'testimonial_3.png', 'Excelente profissional, atendimento de primeira, eu recomendo.'],
  ['Camila Santana', '15/03/2025', 'testimonial_4.png', 'A Dra. Val Fernandes é extraordinária. O processo terapêutico me libertou de crises de ansiedade que eu tinha desde a infância.'],
  ['Rodrigo Santos', '02/02/2025', 'testimonial_5.png', 'Sessões transformadoras! A hipnoterapia abriu minha visão sobre traumas antigos. Atendimento humanizado e excelente em Cuiabá.'],
] as const;

function Home() {
  const [reviewIndex, setReviewIndex] = useState(0);
  const [modalPost, setModalPost] = useState<(typeof posts)[number] | null>(null);
  const visibleReviews = 3;
  const maxReviewIndex = reviews.length - visibleReviews;
  const recentPosts = posts.slice(0, 3);
  const moveReviews = (direction: number) => {
    setReviewIndex((current) => current + direction > maxReviewIndex ? 0 : current + direction < 0 ? maxReviewIndex : current + direction);
  };
  return (
    <div className="site-shell">
      <Header />
      <main>
        <div className="hero-section-wrapper" id="inicio">
          <section className="hero">
            <div className="hero-content">
              <span className="eyebrow">Psicanálise &amp; Inteligência Emocional</span>
              <h1>Transforme sua mente, transforme sua vida.</h1>
              <p>Apoio terapêutico e mentoria para você se conhecer profundamente, curar emoções e viver com mais leveza, autenticidade e propósito.</p>
              <div className="hero-actions">
                <a className="button" href={whatsappLink(welcomeMessage)} target="_blank" rel="noopener noreferrer" data-testid="link-hero-whatsapp"><WhatsAppIcon /> Agendar conversa</a>
                <a className="outline-button" href="#processo" data-testid="link-hero-process">Conheça meu trabalho <ArrowRight size={16} /></a>
              </div>
            </div>
            <div className="hero-image-wrapper">
              <img src={asset('expert.png')} alt="Val Fernandes, psicanalista e hipnoterapeuta" data-testid="img-hero-val" />
            </div>
          </section>
        </div>

        <section className="hero-overlap-cards" aria-label="Serviços">
          <article className="service-overlap-card">
            <div className="card-icon-wrapper"><Heart size={29} /></div>
            <div className="card-info">
              <h3>Processo Terapêutico</h3>
              <p>Cura emocional personalizada. Sua nova versão em 6 semanas.</p>
              <Link href="/processo-terapeutico" className="more-link" data-testid="link-processo-card">Saiba mais <ArrowRight size={14} /></Link>
            </div>
          </article>
          <article className="service-overlap-card">
            <div className="card-icon-wrapper"><Brain size={29} /></div>
            <div className="card-info">
              <h3>Mentoria Academia da Mente</h3>
              <p>Descubra como reprogramar sua mente para o sucesso com nossa mentoria exclusiva.</p>
              <Link href="/mentoria" className="more-link" data-testid="link-mentoria-card">Saiba mais <ArrowRight size={14} /></Link>
            </div>
          </article>
        </section>

        <section className="process-section" id="processo">
          <div className="section-heading">
            <span className="eyebrow">Como funciona</span>
            <h2>Um processo profundo e transformador</h2>
          </div>
          <div className="process-steps">
            {steps.map(({ title, body, icon: Icon }, index) => (
              <article className="process-step-item" key={title} data-testid={`step-process-${index + 1}`}>
                <span className="process-step-number">0{index + 1}</span>
                <div className="process-step-icon"><Icon size={23} /></div>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="attention-section-wrapper" id="especialidades">
          <div className="section-heading">
            <span className="eyebrow">Áreas de atuação</span>
            <h2>Apoio para diversas áreas da sua vida</h2>
            <p>Um olhar inteiro para o que você está vivendo agora.</p>
          </div>
          <div className="attention-grid">
            {attentionItems.map(({ label, icon: Icon }) => (
              <article className="attention-card" key={label} data-testid={`card-attention-${label.toLowerCase().replaceAll(' ', '-')}`}>
                <span className="attention-card-icon"><Icon size={25} /></span><span>{label}</span>
              </article>
            ))}
          </div>
        </section>

        <RelationshipAppeals />

        <section className="section reviews-section-wrapper" id="avaliacoes">
          <div className="section-heading">
            <span className="eyebrow">Depoimentos verificados</span>
            <h2>A confiança dos meus pacientes fala por mim</h2>
          </div>
          <div className="rating-summary-box">
            <div className="rating-stars-row" aria-label="Cinco estrelas">★★★★★</div>
            <p className="rating-summary-text">Com base em <strong>54 avaliações</strong> no Google</p>
          </div>
          <div className="carousel-container">
            <button className="carousel-btn" type="button" onClick={() => moveReviews(-1)} aria-label="Depoimento anterior" data-testid="button-review-previous"><ChevronLeft size={19} /></button>
            <div className="carousel-track-wrapper">
              <div className="carousel-track" style={{ transform: `translateX(-${reviewIndex * (100 / visibleReviews + 2.1)}%)` }}>
                {reviews.map(([name, date, image, text], index) => (
                  <article className="google-card-item" key={name} data-testid={`card-review-${index + 1}`}>
                    <div className="g-card-top">
                      <img src={asset(`testimonials/${image}`)} alt={name} />
                      <div className="g-card-user"><h3>{name}</h3><small>{date}</small></div>
                      <span className="g-logo-icon" aria-label="Google">G</span>
                    </div>
                    <div className="g-card-stars" aria-label="Cinco estrelas">★★★★★</div>
                    <p>“{text}”</p>
                  </article>
                ))}
              </div>
            </div>
            <button className="carousel-btn" type="button" onClick={() => moveReviews(1)} aria-label="Próximo depoimento" data-testid="button-review-next"><ChevronRight size={19} /></button>
          </div>
          <div className="reviews-cta-container">
            <a className="button" href="https://www.google.com/search?kgmid=/g/11sx55mvh5..." target="_blank" rel="noopener noreferrer" data-testid="link-google-reviews">Ver depoimentos no Google</a>
          </div>
        </section>

        <section className="instagram-section-wrapper" id="instagram">
          <h2>Me acompanhe no Instagram</h2>
          <p>Conteúdos diários sobre mente, emoções e desenvolvimento pessoal.</p>
          <div className="insta-grid">
            {['instagram_cozy_room.png', 'instagram_meditation.png', 'instagram_tea_book.png', 'instagram_plant.png', 'instagram_smiling_woman.png', 'instagram_writing_candle.png'].map((image, index) => (
              <a className="insta-link-card" href="https://www.instagram.com/valfernandes.oficial/" target="_blank" rel="noopener noreferrer" key={image} data-testid={`link-instagram-image-${index + 1}`}>
                <img src={asset(image)} alt={['Sala de atendimento aconchegante', 'Mulher meditando ao pôr do sol', 'Chá e caderno aberto', 'Planta em luz de sol', 'Dra. Val Fernandes', 'Vela e caderno'][index]} />
                <span className="insta-hover-overlay"><Camera size={24} aria-hidden="true" /></span>
              </a>
            ))}
          </div>
          <a className="button instagram-outline-button" href="https://www.instagram.com/valfernandes.oficial/" target="_blank" rel="noopener noreferrer" data-testid="link-instagram-profile"><Instagram size={16} /> Ver no Instagram</a>
        </section>

        <section className="section blog-section-wrapper" id="artigos">
          <div className="section-heading">
            <span className="eyebrow">Blog</span>
            <h2>Artigos para sua jornada</h2>
          </div>
          <div className="blog-grid">
            {recentPosts.map((post) => <BlogCard key={post.id} post={post} onRead={() => setModalPost(post)} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/blog.html" className="button" data-testid="link-all-posts">Ver todos os posts</Link>
          </div>
        </section>

        <ContactSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
      {modalPost && <ArticleModal post={modalPost} onClose={() => setModalPost(null)} />}
    </div>
  );
}

function RelationshipAppeals() {
  return (
    <section className="relationship-section" id="relacionamentos">
      <div className="relationship-intro">
        <span className="eyebrow">Um cuidado para o seu momento</span>
        <h2>Nem toda dor precisa terminar em adeus.</h2>
        <p>Existe um caminho possível para olhar para o que está acontecendo com honestidade, cuidado e direção.</p>
      </div>
      <div className="appeal-grid">
        <article className="appeal-card">
          <h3>Você sofre dentro da relação, mas não quer terminar?</h3>
          <p>Quando ainda existe amor, mas a comunicação se perdeu, os conflitos se repetem e você se sente sozinha dentro da própria história, é hora de buscar apoio. Um espaço seguro para compreender a dinâmica do casal, cuidar das feridas e reconstruir a conexão.</p>
          <ul className="outcomes">
            <li>Clareza sobre o que está acontecendo</li>
            <li>Comunicação mais consciente</li>
            <li>Reconexão e intimidade</li>
            <li>Decisões tomadas com segurança</li>
          </ul>
          <a className="button" href={whatsappLink(relationshipMessage)} target="_blank" rel="noopener noreferrer" data-testid="link-relationship-whatsapp"><WhatsAppIcon /> Quero cuidar da minha relação</a>
        </article>
        <article className="appeal-card secondary">
          <h3>Você está sofrendo depois de uma separação?</h3>
          <p>O fim de uma relação pode deixar silêncio, culpa, saudade e a sensação de que você perdeu a si mesma. O acompanhamento acolhe essa dor sem apressar o seu tempo e ajuda você a atravessar o luto com presença.</p>
          <ul className="outcomes">
            <li>Acolhimento para a dor do luto</li>
            <li>Reconstrução da autoestima</li>
            <li>Encerramento de ciclos</li>
            <li>Liberdade para recomeçar</li>
          </ul>
          <a className="button" href={whatsappLink(separationMessage)} target="_blank" rel="noopener noreferrer" data-testid="link-separation-whatsapp"><WhatsAppIcon /> Quero me cuidar depois da separação</a>
        </article>
      </div>
      <div className="unifying-close">
        <h2>Você não precisa atravessar isso sozinha.</h2>
        <p>O primeiro passo não precisa ser grande. Precisa ser possível, seguro e seu.</p>
        <a className="button" href={whatsappLink(welcomeMessage)} target="_blank" rel="noopener noreferrer" data-testid="link-welcome-session"><WhatsAppIcon /> Agendar minha sessão de acolhimento</a>
      </div>
    </section>
  );
}

function BlogCard({ post, onRead }: { post: (typeof posts)[number]; onRead: () => void }) {
  return (
    <article className="blog-card" data-testid={`card-blog-${post.id}`}>
      <img src={asset(post.image)} alt={post.title} />
      <div className="blog-card-body">
        <span className="blog-category">{post.category}</span>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <button className="read-more-btn" type="button" onClick={onRead} data-testid={`button-read-post-${post.id}`}>Ler artigo completo <ArrowRight size={14} /></button>
      </div>
    </article>
  );
}

function ArticleModal({ post, onClose }: { post: (typeof posts)[number]; onClose: () => void }) {
  return (
    <div className="modal-overlay" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="article-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Fechar artigo" data-testid="button-close-article"><X size={24} /></button>
        <span className="blog-category">{post.category}</span>
        <h2 id="article-title" style={{ marginBottom: 14 }}>{post.title}</h2>
        <img src={asset(post.image)} alt="" style={{ width: '100%', maxHeight: 280, objectFit: 'cover', borderRadius: 12, marginBottom: 20 }} />
        <div className="modal-body-copy">{post.content.split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <a className="button" href={whatsappLink(welcomeMessage)} target="_blank" rel="noopener noreferrer" data-testid="link-article-whatsapp"><WhatsAppIcon /> Agendar uma sessão sobre este tema</a>
      </div>
    </div>
  );
}

function ContactSection() {
  return (
    <section className="contact-section-wrapper" id="contato">
      <div className="contact-layout">
        <div className="contact-info-block">
          <span className="eyebrow">Fale comigo</span>
          <h2>Vamos conversar?</h2>
          <p className="subtitle">Estou aqui para te ouvir e ajudar você a dar o primeiro passo.</p>
          <div className="contact-item"><span className="contact-item-icon"><MapPin size={20} /></span><div className="contact-item-details"><strong>Endereço</strong><p>Av. Historiador Rubens de Mendonça, 1856 - Sl 903 - Bosque da Saúde, Cuiabá - MT, 78050-000</p></div></div>
          <div className="contact-item"><span className="contact-item-icon"><Phone size={20} /></span><div className="contact-item-details"><strong>Telefone</strong><p><a href="tel:+5565992199578" data-testid="link-phone">(65) 99219-9578</a></p></div></div>
          <div className="contact-item"><span className="contact-item-icon"><Mail size={20} /></span><div className="contact-item-details"><strong>Atendimento</strong><p>Presencial em Cuiabá e online para todo o Brasil.</p></div></div>
          <a className="button" href={whatsappLink(welcomeMessage)} target="_blank" rel="noopener noreferrer" data-testid="link-contact-whatsapp"><WhatsAppIcon /> Falar pelo WhatsApp</a>
        </div>
        <div className="map-mock-card">
          <iframe title="Mapa do consultório de Val Fernandes" loading="lazy" src="https://www.google.com/maps?q=Av.+Historiador+Rubens+de+Mendonça,+1856,+Cuiabá+-+MT&output=embed" />
        </div>
      </div>
    </section>
  );
}

type ServiceKind = 'mentoria' | 'processo';

const serviceContent = {
  mentoria: {
    label: 'Mentoria exclusiva',
    title: <>Domine sua <span>mente e emoções</span></>,
    subtitle: 'Um programa intensivo de 12 encontros para você que deseja sair da estagnação, eliminar a autossabotagem e construir uma vida de realização plena.',
    cta: mentoriaMessage,
    sectionTitle: 'O mapa da sua jornada',
    sectionDescription: '12 encontros ao vivo e online para reescrever sua história com clareza, método e constância.',
    features: [
      ['Clareza radical', 'Vamos identificar exatamente onde você está e onde quer chegar, eliminando a névoa mental que impede o caminho.', Compass],
      ['Reprogramação emocional', 'Ferramentas práticas para ressignificar traumas e bloqueios que agem no seu inconsciente.', Brain],
      ['Estratégia e ação', 'Você sai com um plano validado para executar seus objetivos e sustentar seus próximos passos.', LineChart],
    ] as [string, string, IconType][],
    timeline: [
      ['01', 'Planejamento estratégico', 'Definição de sonhos e propósito inabalável.'],
      ['02', 'Gestão emocional', 'Blindagem emocional para lidar com desafios sem perder a direção.'],
      ['03', 'Comunicação assertiva', 'Conexão verdadeira através da compreensão dos perfis e necessidades.'],
      ['04', 'Felicidade autêntica', 'Princípios para uma vida prazerosa, equilibrada e com significado.'],
    ],
  },
  processo: {
    label: 'Método exclusivo',
    title: <>Sua nova versão em <span>6 semanas</span></>,
    subtitle: 'Desbloqueie as travas emocionais e aprenda a utilizar ferramentas de cura profunda com um olhar dedicado exclusivamente a você.',
    cta: processoMessage,
    sectionTitle: 'Uma jornada feita para você',
    sectionDescription: 'Um protocolo estruturado e personalizado para a sua história, suas necessidades e o ritmo possível para a sua transformação.',
    features: [
      ['Método validado', 'Um protocolo estruturado e testado, 100% personalizado para sua história e necessidades únicas.', ShieldCheck],
      ['Suporte próximo', 'Você não estará sozinha. Acompanhamento individual e direcionado durante toda a sua jornada.', Heart],
      ['Cura emocional', 'Acesse ferramentas profundas que tratam a raiz do problema, não apenas os sintomas superficiais.', Sparkles],
    ] as [string, string, IconType][],
    timeline: [
      ['01', 'Anamnese profunda', 'Mapeamento completo da sua história e identificação das raízes emocionais.'],
      ['02', 'Sessões de desbloqueio', 'Encontros online focados em ressignificar traumas e crenças limitantes.'],
      ['03', 'Plano de ação', 'Exercícios práticos para consolidar a sua nova identidade no dia a dia.'],
      ['04', 'Integração', 'Fechamento do ciclo com ferramentas para manter seu equilíbrio emocional.'],
    ],
  },
} as const;

function ServicePage({ kind }: { kind: ServiceKind }) {
  const content = serviceContent[kind];
  return (
    <div className="service-page">
      <header className="service-header">
        <Link href="/" className="service-brand" data-testid="link-service-logo"><img src={asset('logo-small.png')} alt="Símbolo de Val Fernandes" /><span>Val Fernandes</span></Link>
        <Link href="/" className="service-back" data-testid="link-service-back">Voltar ao início</Link>
      </header>
      <main>
        <section className="service-hero">
          <div className="service-hero-inner">
            <span className="service-kicker">{content.label}</span>
            <h1>{content.title}</h1>
            <p>{content.subtitle}</p>
            <div className="service-actions">
              <a className="button" href={whatsappLink(content.cta)} target="_blank" rel="noopener noreferrer" data-testid={`link-${kind}-primary-cta`}><WhatsAppIcon /> Quero saber mais</a>
              <a className="outline-button" href="#detalhes" data-testid={`link-${kind}-details`}>Conhecer o método <ArrowRight size={16} /></a>
            </div>
          </div>
        </section>
        <div className="service-body">
          <section className="service-section" id="detalhes">
            <h2>{content.sectionTitle}</h2>
            <p>{content.sectionDescription}</p>
            <div className="feature-grid">
              {content.features.map(([title, description, Icon]) => (
                <article className="feature-card" key={title}>
                  <div className="feature-icon"><Icon size={23} /></div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="service-section alt">
            <h2>Como funciona?</h2>
            <p>Passos simples, acompanhamento presente e espaço para o que é verdadeiro na sua história.</p>
            <div className="timeline">
              {content.timeline.map(([number, title, description]) => (
                <article className="timeline-item" key={number}>
                  <span className="timeline-number">{number}</span>
                  <div><h3>{title}</h3><p>{description}</p></div>
                </article>
              ))}
            </div>
          </section>
          <section className="service-section">
            <div className="service-cta">
              <h2>Seu próximo passo pode começar agora.</h2>
              <p>Converse comigo pelo WhatsApp para entender se este caminho faz sentido para você.</p>
              <a className="button" href={whatsappLink(content.cta)} target="_blank" rel="noopener noreferrer" data-testid={`link-${kind}-final-cta`}><WhatsAppIcon /> Agendar conversa</a>
            </div>
          </section>
        </div>
      </main>
      <footer className="service-footer">
        <span>© 2026 Val Fernandes. Todos os direitos reservados.</span>
        <a className="gestoron-signature" href="https://gestoron.com.br/" target="_blank" rel="noopener noreferrer" aria-label="Desenvolvido e hospedado por Gestoron" data-testid={`link-gestoron-${kind}`}>
          <span className="gestoron-top-area">
            <span className="gestoron-mark" aria-hidden="true">G</span>
            <span className="gestoron-dynamic-text">Gestoron</span>
          </span>
          <span className="gestoron-static-text">Desenvolvido e hospedado por</span>
        </a>
      </footer>
    </div>
  );
}

function BlogPage() {
  const [category, setCategory] = useState('Todos');
  const [query, setQuery] = useState('');
  const [modalPost, setModalPost] = useState<(typeof posts)[number] | null>(null);
  const categories = ['Todos', ...Array.from(new Set(posts.map((post) => post.category)))];
  const filtered = useMemo(() => posts.filter((post) => {
    const categoryMatch = category === 'Todos' || post.category === category;
    const queryMatch = `${post.title} ${post.excerpt} ${post.content}`.toLowerCase().includes(query.toLowerCase());
    return categoryMatch && queryMatch;
  }), [category, query]);
  return (
    <div className="site-shell">
      <Header />
      <main>
        <section className="blog-page-hero"><h1>Artigos &amp; Reflexões</h1><p>Conteúdo exclusivo para apoiar sua jornada de autoconhecimento, inteligência emocional e cura interna.</p></section>
        <section className="filter-search-container" aria-label="Filtros do blog">
          <div className="filter-tags">
            {categories.map((item) => <button className={`filter-tag ${category === item ? 'active' : ''}`} type="button" onClick={() => setCategory(item)} key={item} data-testid={`button-filter-${item}`}>{item}</button>)}
          </div>
          <label className="search-box"><Search size={16} /><span className="sr-only">Pesquisar artigos</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar artigos..." data-testid="input-blog-search" /></label>
        </section>
        <section className="blog-container">
          {filtered.length > 0 ? <div className="blog-grid">{filtered.map((post) => <BlogCard key={post.id} post={post} onRead={() => setModalPost(post)} />)}</div> : <p className="no-results" data-testid="text-no-results">Nenhum artigo encontrado para a busca selecionada.</p>}
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
      {modalPost && <ArticleModal post={modalPost} onClose={() => setModalPost(null)} />}
    </div>
  );
}

const privacySections = [
  ['1. Informações Gerais', <><p>A presente Política de Privacidade contém informações a respeito do modo como tratamos, total ou parcialmente, de forma automatizada ou não, os dados pessoais dos usuários que acessam nosso site.</p><p>Esta Política aplica-se a todos os usuários e visitantes do site <strong>valfernandes.com.br</strong> e está em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).</p></>],
  ['2. Dados Pessoais Coletados', <><p>Os dados pessoais coletados por meio deste site são:</p><ul><li><strong>Nome completo</strong> — quando informado pelo contato ou WhatsApp.</li><li><strong>Telefone/WhatsApp</strong> — quando informado para agendamento.</li><li><strong>Endereço de e-mail</strong> — quando informado para comunicação.</li><li><strong>Dados de navegação</strong> — como endereço IP, navegador e páginas acessadas.</li></ul></>],
  ['3. Finalidade dos Dados', <><p>Os dados coletados servem para responder solicitações, realizar agendamentos, enviar comunicações autorizadas, melhorar a experiência de navegação e cumprir obrigações legais.</p></>],
  ['4. Cookies e Tecnologias de Rastreamento', <><p>Este site pode utilizar cookies para garantir o funcionamento, memorizar preferências e coletar dados estatísticos anonimizados. O usuário pode desabilitá-los nas configurações do navegador.</p></>],
  ['5. Compartilhamento de Dados', <><p>Os dados pessoais coletados <strong>não são vendidos, alugados ou compartilhados</strong> com terceiros, exceto quando necessário para cumprir obrigação legal, operar o site ou mediante autorização expressa.</p></>],
  ['6. Segurança dos Dados', <><p>Adotamos medidas técnicas e administrativas para proteger os dados pessoais contra acesso não autorizado, destruição, perda, alteração ou comunicação indevida.</p></>],
  ['7. Direitos do Titular', <><p>Em conformidade com a LGPD, o titular pode solicitar confirmação, acesso, correção, exclusão dos seus dados ou revogar consentimento. Para isso, entre em contato pelo WhatsApp <a href={whatsapp} target="_blank" rel="noopener noreferrer">(65) 99219-9578</a>.</p></>],
  ['8. Retenção de Dados', <><p>Os dados serão mantidos apenas pelo período necessário para cumprir as finalidades descritas nesta política, salvo obrigação legal de retenção por prazo superior.</p></>],
  ['9. Alterações nesta Política', <><p>Esta Política pode ser atualizada periodicamente. Recomendamos a consulta regular desta página.</p></>],
  ['10. Contato', <><p>Responsável: <strong>Val Fernandes</strong>. WhatsApp: <a href={whatsapp} target="_blank" rel="noopener noreferrer">(65) 99219-9578</a>.</p></>],
] as const;

const termsSections = [
  ['1. Aceitação dos Termos', <p>Ao acessar e utilizar o site <strong>valfernandes.com.br</strong>, você concorda com estes Termos de Uso e com a nossa <Link href="/politica-de-privacidade.html">Política de Privacidade</Link>.</p>],
  ['2. Descrição dos Serviços', <><p>O site apresenta informações sobre Psicanálise Clínica, Hipnoterapia Clínica, Mentoria em Inteligência Emocional, PNL e Constelação Familiar Sistêmica.</p><p>O conteúdo tem caráter informativo e educacional, e <strong>não substitui</strong> diagnósticos médicos, tratamentos psiquiátricos ou acompanhamento psicológico profissional.</p></>],
  ['3. Agendamento e Atendimento', <><p>O agendamento é realizado por WhatsApp ou canais indicados no site.</p><ul><li>As sessões podem ser presenciais em Cuiabá-MT ou online.</li><li>Cancelamentos devem ser comunicados com no mínimo <strong>24 horas</strong> de antecedência.</li><li>Informações sobre valores são fornecidas no momento do agendamento.</li></ul></>],
  ['4. Propriedade Intelectual', <p>Todo o conteúdo — textos, imagens, logotipos, vídeos, gráficos e design — pertence a Val Fernandes ou é utilizado com autorização. Artigos podem ser compartilhados com atribuição à autora.</p>],
  ['5. Responsabilidades do Usuário', <p>O usuário compromete-se a fornecer informações verdadeiras, não utilizar o site para finalidades ilegais e respeitar o sigilo e a ética envolvidos no processo terapêutico.</p>],
  ['6. Limitação de Responsabilidade', <p>Val Fernandes não se responsabiliza por resultados específicos, uso indevido das informações, indisponibilidade temporária do site ou conteúdo de sites de terceiros.</p>],
  ['7. Sigilo Profissional', <p>Todo conteúdo compartilhado nas sessões é tratado com <strong>absoluto sigilo</strong>, conforme previsto no Código de Ética profissional.</p>],
  ['8. Links Externos', <p>Links para terceiros são fornecidos como conveniência e não implicam endosso ou responsabilidade pelas práticas desses sites.</p>],
  ['9. Modificações nos Termos', <p>Val Fernandes pode alterar estes Termos a qualquer momento. As alterações entram em vigor após sua publicação.</p>],
  ['10. Legislação Aplicável', <p>Estes Termos são regidos pelas leis da República Federativa do Brasil, elegendo-se o foro da comarca de Cuiabá-MT.</p>],
  ['11. Contato', <p>Em caso de dúvidas, entre em contato pelo WhatsApp <a href={whatsapp} target="_blank" rel="noopener noreferrer">(65) 99219-9578</a>.</p>],
] as const;

function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const isPrivacy = kind === 'privacy';
  const sections = isPrivacy ? privacySections : termsSections;
  return (
    <div className="legal-page-wrapper">
      <Header />
      <main>
        <section className="legal-hero"><span className="eyebrow">Documento legal</span><h1>{isPrivacy ? 'Política de Privacidade' : 'Termos de Uso'}</h1><p>{isPrivacy ? 'Sua privacidade é importante para nós. Entenda como coletamos, usamos e protegemos suas informações.' : 'Conheça as condições de uso do nosso site e dos serviços oferecidos por Val Fernandes.'}</p><span className="legal-update-date">Última atualização: Agosto de 2026</span></section>
        <article className="legal-content">
          <Link href="/" className="legal-back-link" data-testid="link-legal-back">Voltar para a página inicial</Link>
          {sections.map(([title, body]) => <section key={title}><h2>{title}</h2>{body}</section>)}
        </article>
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <ErrorBoundary resetKey={useLocation()[0]}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/blog.html" component={BlogPage} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/mentoria"><ServicePage kind="mentoria" /></Route>
        <Route path="/processo-terapeutico"><ServicePage kind="processo" /></Route>
        <Route path="/politica-de-privacidade.html"><LegalPage kind="privacy" /></Route>
        <Route path="/termos-de-uso.html"><LegalPage kind="terms" /></Route>
        <Route component={NotFoundFallback} />
      </Switch>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={base}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;