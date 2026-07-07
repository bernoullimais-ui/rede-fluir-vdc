// Supabase Connection Credentials
const SUPABASE_URL = 'https://bcuoekliuysopebkttbw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdW9la2xpdXlzb3BlYmt0dGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxMDIxNDksImV4cCI6MjA5ODY3ODE0OX0.y1smJKrR8yCVhi603ULOS2GVuwGmqCD7OOYUv4qkV4A';

// Configurações Padrão de Fallback
const DEFAULT_CONFIG = {
    whatsapp: '5577999999999',
    address: 'Av. Olívia Flores, 1200 - Candeias, Vitória da Conquista - BA',
    mapsLink: 'https://maps.google.com/?q=Av.+Olivia+Flores,+Vitória+da+Conquista',
    instagram: 'https://instagram.com/fluir.conquista',
    facebook: 'https://facebook.com/fluir.conquista',
    youtube: 'https://youtube.com/redefluir',
    linkedin: 'https://linkedin.com/company/redefluir',
    adminPassword: 'admin123',
    logoText: 'Fluir',
    logoImage: '',
    logoSize: 40,
    btnBgColor: '#0073F7',
    btnTextColor: '#FFFFFF',
    btnHoverBgColor: '#0A43C3',
    btnHoverTextColor: '#FFFFFF',
    contactInfo: 'Você também pode nos chamar no WhatsApp para agendar uma aula experimental por apenas R$ 10,00.',
    heroImage: 'assets/hero_woman.jpg',
    heroTitle: 'A vida\nacontece em\nmovimento.',
    heroSubtitle: 'Em breve, a maior e mais moderna rede de atividades aquáticas e Pilates da Bahia chega a Vitória da Conquista.',
    introTitle: 'Rumo a Conquista.',
    introText: 'Em breve, Vitória da Conquista receberá a mais nova forma de cuidar da saúde, do movimento e do equilíbrio da vida.\nO Fluir traz à Região Sudoeste toda a experiência de uma marca que na Bahia já transformou milhares de vidas e hoje oferece infraestrutura moderna, piscinas mantidas sempre limpas, climatizadas e tratadas com tecnologia de ozônio, atendimento humanizado, profissionais qualificados e excelência em cada detalhe.\nMais do que um estúdio ou academia, o nosso espaço foi projetado para oferecer uma experience completa, com a tranquilidade que você precisa para promover bem-estar, motivação e resultados reais para a sua rotina.\nAgora é a vez de Vitória da Conquista fazer parte dessa história.\nEstamos nos preparando para abrir as portas e receber você e sua família em um espaço moderno, totalmente pensado para que cada treino, aula e contato contribuam para uma vida mais saudável.',
    introFooter: 'Seja bem-vindo(a) à Rede Fluir. Em breve, a vida flui por aqui.',
    modalities: [
        { id: 'natacao_bebe', name: 'Natação Bebê', active: true, image: 'assets/natacao_bebe.jpg' },
        { id: 'programa_gestantes', name: 'Programa de Gestantes', active: true, image: 'assets/programa_gestantes.jpg' },
        { id: 'natacao_infantil', name: 'Natação Infantil', active: true, image: 'assets/natacao_infantil.jpg' },
        { id: 'pilates', name: 'Pilates', active: true, image: 'assets/pilates_studio.jpg' },
        { id: 'natacao_adulto', name: 'Natação Adulto', active: true, image: 'assets/natacao_adulto.jpg' },
        { id: 'well_estar', name: 'Well-estar', active: true, image: 'assets/well_estar.jpg' },
        { id: 'hidroginastica', name: 'Hidroginástica', active: true, image: 'assets/hidroginastica.jpg' },
        { id: 'fisioterapia', name: 'Fisioterapia Aquática', active: true, image: 'assets/fisioterapia.jpg' }
    ],
    spaces: [
        { id: 'piscina', name: 'Piscina Climatizada', image: 'assets/espaco_piscina.jpg' },
        { id: 'recepcao', name: 'Recepção / Atendimento', image: 'assets/espaco_recepcao.jpg' },
        { id: 'pilates', name: 'Estúdio de Pilates', image: 'assets/espaco_pilates.jpg' },
        { id: 'fachada', name: 'Fachada', image: 'assets/espaco_fachada.jpg' },
        { id: 'avaliacao', name: 'Sala de Avaliação', image: 'assets/espaco_avaliacao.jpg' },
        { id: 'circulacao', name: 'Lobby', image: 'assets/espaco_circulacao.jpg' }
    ]
};

// --- INITIALIZE SUPABASE CLIENT ---
let supabaseClient = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("Supabase inicializado com sucesso!");
    } catch (e) {
        console.error("Erro ao carregar o cliente do Supabase:", e);
    }
} else {
    console.warn("Supabase URL ou Anon Key não configuradas. Usando LocalStorage.");
}

// --- ASYNC DATA STORAGE HELPERS ---

// Obter Configurações com Cache para evitar multiplas chamadas simultâneas
let cachedConfig = null;

async function getAppConfigAsync(forceRefresh = false) {
    if (cachedConfig && !forceRefresh) {
        return cachedConfig;
    }

    if (supabaseClient) {
        try {
            // 1. Buscar configuração geral
            const { data: configData, error: configError } = await supabaseClient
                .from('config')
                .select('*')
                .eq('id', 1)
                .maybeSingle();

            if (configError) throw configError;

            // 2. Buscar modalidades
            const { data: modData, error: modError } = await supabaseClient
                .from('modalities')
                .select('*');

            if (modError) throw modError;

            let finalConfig = { ...DEFAULT_CONFIG };

            // Se existirem dados de config no banco
            if (configData) {
                finalConfig.whatsapp = configData.whatsapp || finalConfig.whatsapp;
                finalConfig.address = configData.address || finalConfig.address;
                finalConfig.mapsLink = configData.maps_link || finalConfig.mapsLink;
                finalConfig.instagram = configData.instagram || finalConfig.instagram;
                finalConfig.facebook = configData.facebook || finalConfig.facebook;
                finalConfig.youtube = configData.youtube || finalConfig.youtube;
                finalConfig.linkedin = configData.linkedin || finalConfig.linkedin;
                finalConfig.adminPassword = configData.admin_password || finalConfig.adminPassword;
                // Colunas de customização com fallback seguro caso o banco ainda não tenha sido alterado
                finalConfig.logoText = configData.logo_text !== undefined && configData.logo_text !== null ? configData.logo_text : finalConfig.logoText;
                finalConfig.logoImage = configData.logo_image !== undefined && configData.logo_image !== null ? configData.logo_image : finalConfig.logoImage;
                finalConfig.logoSize = configData.logo_size !== undefined && configData.logo_size !== null ? parseInt(configData.logo_size, 10) : finalConfig.logoSize;
                finalConfig.btnBgColor = configData.btn_bg_color !== undefined && configData.btn_bg_color !== null ? configData.btn_bg_color : finalConfig.btnBgColor;
                finalConfig.btnTextColor = configData.btn_text_color !== undefined && configData.btn_text_color !== null ? configData.btn_text_color : finalConfig.btnTextColor;
                finalConfig.btnHoverBgColor = configData.btn_hover_bg_color !== undefined && configData.btn_hover_bg_color !== null ? configData.btn_hover_bg_color : finalConfig.btnHoverBgColor;
                finalConfig.btnHoverTextColor = configData.btn_hover_text_color !== undefined && configData.btn_hover_text_color !== null ? configData.btn_hover_text_color : finalConfig.btnHoverTextColor;
                finalConfig.contactInfo = configData.contact_info !== undefined && configData.contact_info !== null ? configData.contact_info : finalConfig.contactInfo;
                finalConfig.heroImage = configData.hero_image !== undefined && configData.hero_image !== null ? configData.hero_image : finalConfig.heroImage;
                finalConfig.heroTitle = configData.hero_title !== undefined && configData.hero_title !== null ? configData.hero_title : finalConfig.heroTitle;
                finalConfig.heroSubtitle = configData.hero_subtitle !== undefined && configData.hero_subtitle !== null ? configData.hero_subtitle : finalConfig.heroSubtitle;
                finalConfig.introTitle = configData.intro_title !== undefined && configData.intro_title !== null ? configData.intro_title : finalConfig.introTitle;
                finalConfig.introText = configData.intro_text !== undefined && configData.intro_text !== null ? configData.intro_text : finalConfig.introText;
                finalConfig.introFooter = configData.intro_footer !== undefined && configData.intro_footer !== null ? configData.intro_footer : finalConfig.introFooter;
            } else {
                // Inicializar com dados padrão se a tabela estiver vazia
                await supabaseClient.from('config').insert({
                    id: 1,
                    whatsapp: DEFAULT_CONFIG.whatsapp,
                    address: DEFAULT_CONFIG.address,
                    maps_link: DEFAULT_CONFIG.mapsLink,
                    instagram: DEFAULT_CONFIG.instagram,
                    facebook: DEFAULT_CONFIG.facebook,
                    youtube: DEFAULT_CONFIG.youtube,
                    linkedin: DEFAULT_CONFIG.linkedin,
                    admin_password: DEFAULT_CONFIG.adminPassword,
                    logo_text: DEFAULT_CONFIG.logoText,
                    logo_image: DEFAULT_CONFIG.logoImage,
                    logo_size: DEFAULT_CONFIG.logoSize,
                    btn_bg_color: DEFAULT_CONFIG.btnBgColor,
                    btn_text_color: DEFAULT_CONFIG.btnTextColor,
                    btn_hover_bg_color: DEFAULT_CONFIG.btnHoverBgColor,
                    btn_hover_text_color: DEFAULT_CONFIG.btnHoverTextColor,
                    hero_image: DEFAULT_CONFIG.heroImage,
                    hero_title: DEFAULT_CONFIG.heroTitle,
                    hero_subtitle: DEFAULT_CONFIG.heroSubtitle,
                    intro_title: DEFAULT_CONFIG.introTitle,
                    intro_text: DEFAULT_CONFIG.introText,
                    intro_footer: DEFAULT_CONFIG.introFooter,
                    contact_info: DEFAULT_CONFIG.contactInfo
                });
            }

            // Se existirem modalidades no banco
            if (modData && modData.length > 0) {
                finalConfig.modalities = DEFAULT_CONFIG.modalities.map(defaultMod => {
                    const dbMod = modData.find(m => m.id === defaultMod.id);
                    return dbMod ? {
                        id: dbMod.id,
                        name: dbMod.name,
                        active: dbMod.active,
                        image: dbMod.image
                    } : defaultMod;
                });
            } else {
                // Inicializar modalidades padrão no banco se estiver vazio
                for (const mod of DEFAULT_CONFIG.modalities) {
                    await supabaseClient.from('modalities').insert({
                        id: mod.id,
                        name: mod.name,
                        active: mod.active,
                        image: mod.image
                    });
                }
            }

            // 3. Buscar espaços
            try {
                const { data: spacesData, error: spacesError } = await supabaseClient
                    .from('spaces')
                    .select('*');

                if (spacesError) throw spacesError;

                if (spacesData && spacesData.length > 0) {
                    finalConfig.spaces = DEFAULT_CONFIG.spaces.map(defaultSpace => {
                        const dbSpace = spacesData.find(s => s.id === defaultSpace.id);
                        return dbSpace ? {
                            id: dbSpace.id,
                            name: dbSpace.name,
                            image: dbSpace.image
                        } : defaultSpace;
                    });
                } else {
                    // Inicializar espaços padrão no banco se estiver vazio
                    for (const space of DEFAULT_CONFIG.spaces) {
                        await supabaseClient.from('spaces').insert({
                            id: space.id,
                            name: space.name,
                            image: space.image
                        });
                    }
                }
            } catch (spacesErr) {
                console.warn("Erro ao buscar/inicializar espaços (a tabela 'spaces' pode não estar criada no Supabase ainda):", spacesErr);
            }

            cachedConfig = finalConfig;
            return finalConfig;
        } catch (e) {
            console.warn("Supabase indisponível, usando dados locais de LocalStorage:", e);
        }
    }
    
    // Fallback: LocalStorage
    let config = localStorage.getItem('fluir_config');
    if (!config) {
        localStorage.setItem('fluir_config', JSON.stringify(DEFAULT_CONFIG));
        cachedConfig = DEFAULT_CONFIG;
        return DEFAULT_CONFIG;
    }
    const parsed = JSON.parse(config);
    const finalConfig = { ...DEFAULT_CONFIG, ...parsed };
    cachedConfig = finalConfig;
    return finalConfig;
}

// Salvar Configurações
async function saveAppConfigAsync(config) {
    // Salvar localmente como backup
    localStorage.setItem('fluir_config', JSON.stringify(config));
    cachedConfig = config; // Atualizar o cache local imediatamente

    if (supabaseClient) {
        try {
            // Salvar Config Geral
            const { error: configError } = await supabaseClient
                .from('config')
                .upsert({
                    id: 1,
                    whatsapp: config.whatsapp,
                    address: config.address,
                    maps_link: config.mapsLink,
                    instagram: config.instagram,
                    facebook: config.facebook,
                    youtube: config.youtube,
                    linkedin: config.linkedin,
                    admin_password: config.adminPassword,
                    logo_text: config.logoText,
                    logo_image: config.logoImage,
                    logo_size: config.logoSize,
                    btn_bg_color: config.btnBgColor,
                    btn_text_color: config.btnTextColor,
                    btn_hover_bg_color: config.btnHoverBgColor,
                    btn_hover_text_color: config.btnHoverTextColor,
                    hero_image: config.heroImage,
                    hero_title: config.heroTitle,
                    hero_subtitle: config.heroSubtitle,
                    intro_title: config.introTitle,
                    intro_text: config.introText,
                    intro_footer: config.introFooter,
                    contact_info: config.contactInfo
                });

            if (configError) throw configError;

            // Salvar Modalidades
            for (const mod of config.modalities) {
                const { error: modError } = await supabaseClient
                    .from('modalities')
                    .upsert({
                        id: mod.id,
                        name: mod.name,
                        active: mod.active,
                        image: mod.image
                    });
                if (modError) throw modError;
            }

            // Salvar Espaços
            if (config.spaces) {
                for (const space of config.spaces) {
                    const { error: spaceError } = await supabaseClient
                        .from('spaces')
                        .upsert({
                            id: space.id,
                            name: space.name,
                            image: space.image
                        });
                    if (spaceError) throw spaceError;
                }
            }
        } catch (e) {
            console.error("Falha ao sincronizar com o Supabase:", e);
            alert("Erro ao sincronizar com o Supabase: " + (e.message || e.details || JSON.stringify(e)) + "\n\nAs alterações foram salvas localmente no seu navegador.");
        }
    }
}

// Obter Leads
async function getLeadsAsync() {
    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            return data.map(lead => ({
                id: lead.id,
                name: lead.name,
                whatsapp: lead.whatsapp,
                email: lead.email,
                modality: lead.modality,
                status: lead.status,
                date: lead.created_at
            }));
        } catch (e) {
            console.warn("Falha ao puxar leads do Supabase, usando LocalStorage:", e);
        }
    }

    let leads = localStorage.getItem('fluir_leads');
    return leads ? JSON.parse(leads) : [];
}

// Gravar Novo Lead
async function saveLeadAsync(lead) {
    // Salvar backup local
    const localLeads = getLeads();
    localLeads.unshift(lead);
    localStorage.setItem('fluir_leads', JSON.stringify(localLeads));

    if (supabaseClient) {
        try {
            const { error } = await supabaseClient
                .from('leads')
                .insert({
                    name: lead.name,
                    whatsapp: lead.whatsapp,
                    email: lead.email,
                    modality: lead.modality,
                    status: lead.status
                });

            if (error) throw error;
        } catch (e) {
            console.error("Erro ao enviar lead para o Supabase:", e);
        }
    }
}

// Atualizar Status do Lead
async function updateLeadStatusAsync(leadId, newStatus) {
    // Salvar backup local
    let localLeads = getLeads();
    localLeads = localLeads.map(l => l.id === leadId ? { ...l, status: newStatus } : l);
    localStorage.setItem('fluir_leads', JSON.stringify(localLeads));

    if (supabaseClient && isUUID(leadId)) {
        try {
            const { error } = await supabaseClient
                .from('leads')
                .update({ status: newStatus })
                .eq('id', leadId);

            if (error) throw error;
        } catch (e) {
            console.error("Erro ao atualizar status no Supabase:", e);
        }
    }
}

// Helper síncronos legados para compatibilidade e backup
function getLeads() {
    let leads = localStorage.getItem('fluir_leads');
    return leads ? JSON.parse(leads) : [];
}

function isUUID(str) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(str);
}

// Format Phone Input
function maskPhone(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
}

// Show toast helper
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.querySelector('.toast-text').textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// --- LANDING PAGE LOGIC ---
async function initLandingPage() {
    const config = await getAppConfigAsync();
    
    console.log("=== INICIALIZAÇÃO DA LANDING PAGE ===");
    console.log("Origem das configurações da LP:", supabaseClient ? "Supabase (Banco de Dados)" : "LocalStorage (Navegador)");
    console.log("Dados carregados:", config);
    
    // 0. Update Logo dynamically
    const logoContainer = document.getElementById('logo-container');
    if (logoContainer) {
        if (config.logoImage && config.logoImage.trim() !== '') {
            const logoHeight = config.logoSize || 40;
            logoContainer.innerHTML = `<img src="${config.logoImage}" alt="Logo" style="max-height: ${logoHeight}px; width: auto; object-fit: contain; display: block;">`;
        } else if (config.logoText && config.logoText.trim() !== '' && config.logoText.trim().toLowerCase() !== 'default') {
            const logoHeight = config.logoSize || 40;
            logoContainer.innerHTML = `<span style="font-weight: 800; font-size: ${logoHeight / 25}rem; letter-spacing: -0.5px; color: white;">${config.logoText}</span>`;
        } else {
            // Logo padrão SVG
            logoContainer.innerHTML = `
                <svg width="130" height="40" viewBox="0 0 130 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 12C9.5 12 7.5 14 7.5 17.5V32H13.5V18.5C13.5 16.5 14.5 15.5 16 15.5C16.8 15.5 17.5 15.8 18 16.2V11.2C17.2 10.8 16.2 10.5 15 10.5C13.8 10.5 13 11 12.5 12Z" fill="white"/>
                    <path d="M26.5 21C26.5 15 28.5 10.5 35 10.5C41 10.5 43 14.5 43 21H32.5C32.5 24.5 34 26.5 36.5 26.5C38.5 26.5 39.5 25.5 40 24.5H45.5C44.5 28.5 41.5 32 36 32C29.5 32 26.5 27.5 26.5 21ZM37.5 17C37.5 15.5 36.5 14.5 35 14.5C33.5 14.5 32.5 15.5 32.5 17H37.5Z" fill="white"/>
                    <path d="M48.5 5.5H54.5V14C55.5 11.5 58 10.5 61 10.5C66.5 10.5 69.5 14.5 69.5 21C69.5 27.5 66.5 32 61 32C58 32 55.5 31 54.5 28.5V32H48.5V5.5ZM59 16C57 16 55.5 17.5 55.5 21.2C55.5 25 57 26.5 59 26.5C61 26.5 62.5 25 62.5 21.2C62.5 17.5 61 16 59 16Z" fill="white"/>
                    <path d="M72.5 11H78.5V23.5C78.5 25.5 79.5 26.5 81.5 26.5C83.5 26.5 84.5 25.5 84.5 23.5V11H90.5V23C90.5 28.5 86.5 32 81.5 32C76.5 32 72.5 28.5 72.5 23V11Z" fill="white"/>
                    <path d="M96 11H102V32H96V11Z" fill="white"/>
                    <path d="M99 2C101.209 2 103 3.79086 103 6C103 8.20914 101.209 10 99 10C96.7909 10 95 8.20914 95 6C95 3.79086 96.7909 2 99 2Z" fill="#00D4FF"/>
                    <path d="M106.5 12C108.5 12 110.5 14 110.5 17.5V32H116.5V18.5C116.5 16.5 117.5 15.5 119 15.5C119.8 15.5 120.5 15.8 121 16.2V11.2C120.2 10.8 119.2 10.5 118 10.5C116.8 10.5 116 11 115.5 12V11H109.5V12C108.5 12.2 107.5 12 106.5 12Z" fill="white"/>
                </svg>
            `;
        }
    }
    const footerLogo = document.getElementById('footer-logo-text');
    if (footerLogo) {
        if (config.logoImage && config.logoImage.trim() !== '') {
            footerLogo.innerHTML = `<img src="${config.logoImage}" alt="Logo" style="max-height: 35px; width: auto; object-fit: contain; display: block;">`;
        } else if (config.logoText && config.logoText.trim() !== '' && config.logoText.trim().toLowerCase() !== 'default') {
            footerLogo.innerHTML = `<span style="font-weight: 800; font-size: 1.3rem; color: white;">${config.logoText}</span>`;
        } else {
            footerLogo.textContent = 'Fluir';
        }
    }

    // Update Hero Title and Subtitle dynamically
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle && config.heroTitle) {
        heroTitle.innerHTML = config.heroTitle.replace(/\n/g, '<br>');
    }
    const heroSubtitle = document.getElementById('hero-subtitle');
    if (heroSubtitle && config.heroSubtitle) {
        heroSubtitle.textContent = config.heroSubtitle;
    }

    // Update Hero Image dynamically as background
    const heroSection = document.querySelector('.hero');
    if (heroSection && config.heroImage && config.heroImage.trim() !== '') {
        heroSection.style.setProperty('--hero-bg', `url('${config.heroImage}')`);
    }

    // Update Intro Section dynamically
    const introTitle = document.getElementById('intro-title');
    if (introTitle && config.introTitle) {
        introTitle.textContent = config.introTitle;
    }
    const introParagraphs = document.getElementById('intro-paragraphs');
    if (introParagraphs && config.introText) {
        introParagraphs.innerHTML = config.introText
            .split('\n')
            .filter(p => p.trim() !== '')
            .map(p => `<p>${p.trim()}</p>`)
            .join('');
    }
    const introFooter = document.getElementById('intro-footer');
    if (introFooter && config.introFooter) {
        introFooter.textContent = config.introFooter;
    }

    // Update Button Colors dynamically
    const root = document.documentElement;
    if (config.btnBgColor) root.style.setProperty('--btn-bg', config.btnBgColor);
    if (config.btnTextColor) root.style.setProperty('--btn-text', config.btnTextColor);
    if (config.btnHoverBgColor) root.style.setProperty('--btn-hover-bg', config.btnHoverBgColor);
    if (config.btnHoverTextColor) root.style.setProperty('--btn-hover-text', config.btnHoverTextColor);

    // 1. Update Contact Links and Info
    const whatsappLink = `https://wa.me/${config.whatsapp.replace(/\D/g, '')}`;
    
    document.querySelectorAll('.whatsapp-url').forEach(el => {
        el.href = whatsappLink;
    });

    // Update Contact section footer text dynamically
    const vipInfoBox = document.getElementById('contact-info-text');
    if (vipInfoBox && config.contactInfo) {
        vipInfoBox.innerHTML = config.contactInfo.replace(/WhatsApp/g, `<a href="${whatsappLink}" class="whatsapp-url" target="_blank">WhatsApp</a>`);
    }
    
    const addressElement = document.getElementById('address-text');
    if (addressElement) {
        addressElement.textContent = config.address;
    }
    
    const mapsElement = document.getElementById('maps-link');
    if (mapsElement) {
        mapsElement.href = config.mapsLink;
    }
    
    // Social Links
    const socialMap = {
        'social-instagram': config.instagram,
        'social-facebook': config.facebook,
        'social-youtube': config.youtube,
        'social-linkedin': config.linkedin
    };
    
    Object.keys(socialMap).forEach(key => {
        const el = document.getElementById(key);
        if (el && socialMap[key]) {
            el.href = socialMap[key];
        }
    });

    // 2. Render Active Modalities
    const modalitiesGrid = document.getElementById('modalities-grid');
    const modalitySelect = document.getElementById('vip-modality');
    
    if (modalitiesGrid) {
        modalitiesGrid.innerHTML = '';
        let activeCount = 0;
        
        config.modalities.forEach(mod => {
            if (mod.active) {
                activeCount++;
                const card = document.createElement('div');
                card.className = 'modalidade-card';
                card.innerHTML = `
                    <img src="${mod.image}" alt="${mod.name}" class="modalidade-img" onerror="this.src='https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80'">
                    <div class="modalidade-overlay">
                        <h3 class="modalidade-title">${mod.name}</h3>
                    </div>
                `;
                modalitiesGrid.appendChild(card);
            }
        });
        
        if (activeCount === 0) {
            modalitiesGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Nenhuma modalidade ativa no momento.</div>`;
        }
    }

    // Populate dropdown
    if (modalitySelect) {
        modalitySelect.innerHTML = '<option value="" disabled selected>Modalidade de interesse</option>';
        config.modalities.forEach(mod => {
            if (mod.active) {
                const opt = document.createElement('option');
                opt.value = mod.name;
                opt.textContent = mod.name;
                modalitySelect.appendChild(opt);
            }
        });
    }

    // 3. Render Spaces
    const spacesGrid = document.getElementById('spaces-grid');
    if (spacesGrid) {
        spacesGrid.innerHTML = '';
        config.spaces.forEach(space => {
            const card = document.createElement('div');
            card.className = 'espaco-card';
            card.innerHTML = `
                <img src="${space.image}" alt="${space.name}" class="espaco-img" onerror="this.src='https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80'">
            `;
            spacesGrid.appendChild(card);
        });
    }

    // 4. Form Submission and Masking
    const phoneInput = document.getElementById('vip-whatsapp');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = maskPhone(e.target.value);
        });
    }

    const vipForm = document.getElementById('vip-form');
    if (vipForm) {
        vipForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('vip-name').value.trim();
            const whatsapp = document.getElementById('vip-whatsapp').value.trim();
            const email = document.getElementById('vip-email').value.trim();
            const modality = document.getElementById('vip-modality').value;

            if (!name || !whatsapp || !email || !modality) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            const newLead = {
                id: 'lead_' + Date.now(),
                name,
                whatsapp,
                email,
                modality,
                status: 'Pendente',
                date: new Date().toISOString()
            };

            await saveLeadAsync(newLead);

            // Clear form
            vipForm.reset();

            // Display Toast
            showToast('Cadastro VIP realizado com sucesso!');
        });
    }
}

// --- ADMIN PANEL LOGIC ---
let authenticated = false;

async function checkAdminAuth() {
    try {
        const sessionAuth = sessionStorage.getItem('fluir_auth');
        
        // Iniciar carregamento das configurações em segundo plano imediatamente
        const configPromise = getAppConfigAsync();
        
        if (sessionAuth === 'true') {
            authenticated = true;
            document.getElementById('login-overlay').style.display = 'none';
            try {
                const config = await configPromise;
                
                // Atualizar a logo no header do admin
                const adminLogoContainer = document.getElementById('admin-logo-container');
                if (adminLogoContainer) {
                    if (config.logoImage && config.logoImage.trim() !== '') {
                        adminLogoContainer.innerHTML = `<img src="${config.logoImage}" alt="Logo" style="max-height: 30px; width: auto; object-fit: contain; display: block; margin-right: 8px;"> <span>Admin</span> <span class="admin-badge">Vitória da Conquista</span>`;
                    } else if (config.logoText && config.logoText.trim() !== '' && config.logoText.trim().toLowerCase() !== 'default') {
                        adminLogoContainer.innerHTML = `${config.logoText} <span>Admin</span> <span class="admin-badge">Vitória da Conquista</span>`;
                    }
                }
                
                await loadAdminDashboard();
            } catch (dashboardErr) {
                console.error("Erro ao carregar o dashboard:", dashboardErr);
                alert("Erro ao carregar o painel: " + dashboardErr.message);
            }
        } else {
            document.getElementById('login-overlay').style.display = 'flex';
            
            // Listen to password submit (Registrado IMEDIATAMENTE e de forma síncrona para evitar reloads no envio rápido)
            const loginForm = document.getElementById('login-form');
            const loginError = document.getElementById('login-error');
            
            if (loginForm) {
                loginForm.addEventListener('submit', async (e) => {
                    e.preventDefault(); // Impede o reload do navegador instantaneamente
                    try {
                        const passInput = document.getElementById('login-password').value;
                        
                        // Aguardar as configurações carregarem em segundo plano
                        const config = await configPromise;
                        
                        console.log("=== SISTEMA DE AUTENTICAÇÃO ===");
                        console.log("Origem das configurações:", supabaseClient ? "Supabase (Banco de Dados)" : "LocalStorage (Navegador)");
                        console.log("Senha atualmente configurada/esperada:", `"${config.adminPassword}"`);
                        
                        // Comparar ignorando espaços extras no início/fim
                        if (passInput.trim() === config.adminPassword.trim()) {
                            sessionStorage.setItem('fluir_auth', 'true');
                            authenticated = true;
                            document.getElementById('login-overlay').style.display = 'none';
                            
                            // Atualizar a logo no header do admin
                            const adminLogoContainer = document.getElementById('admin-logo-container');
                            if (adminLogoContainer) {
                                if (config.logoImage && config.logoImage.trim() !== '') {
                                    adminLogoContainer.innerHTML = `<img src="${config.logoImage}" alt="Logo" style="max-height: 30px; width: auto; object-fit: contain; display: block; margin-right: 8px;"> <span>Admin</span> <span class="admin-badge">Vitória da Conquista</span>`;
                                } else if (config.logoText && config.logoText.trim() !== '' && config.logoText.trim().toLowerCase() !== 'default') {
                                    adminLogoContainer.innerHTML = `${config.logoText} <span>Admin</span> <span class="admin-badge">Vitória da Conquista</span>`;
                                }
                            }
                            
                            await loadAdminDashboard();
                        } else {
                            console.warn(`Tentativa de login malsucedida. Digitado: "${passInput}", Esperado: "${config.adminPassword}"`);
                            loginError.textContent = 'Senha incorreta. Tente novamente.';
                            loginError.style.display = 'block';
                        }
                    } catch (submitErr) {
                        console.error("Erro ao processar o formulário de login:", submitErr);
                        alert("Erro ao tentar fazer login: " + submitErr.message);
                    }
                });
            }
        }
    } catch (authErr) {
        console.error("Erro crítico de autenticação:", authErr);
        alert("Erro crítico no carregamento da autenticação: " + authErr.message);
    }
}

function handleLogout() {
    sessionStorage.removeItem('fluir_auth');
    window.location.reload();
}

async function loadAdminDashboard() {
    if (!authenticated) return;
    
    initAdminTabs();
    await renderStats();
    await renderLeadsTable();
    await loadConfigForm();
    await renderModalitiesList();
    await renderSpacesList();
    
    // Register general save listeners
    const configForm = document.getElementById('admin-config-form');
    if (configForm) {
        configForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const config = await getAppConfigAsync();
            
            const getVal = (id, defaultVal = '') => {
                const el = document.getElementById(id);
                return el ? el.value.trim() : defaultVal;
            };

            config.whatsapp = getVal('cfg-whatsapp', config.whatsapp);
            config.address = getVal('cfg-address', config.address);
            config.mapsLink = getVal('cfg-maps', config.mapsLink);
            config.instagram = getVal('cfg-instagram', config.instagram);
            config.facebook = getVal('cfg-facebook', config.facebook);
            config.youtube = getVal('cfg-youtube', config.youtube);
            config.linkedin = getVal('cfg-linkedin', config.linkedin);
            
            // Novos campos de customização
            config.logoText = getVal('cfg-logo-text', config.logoText);
            config.logoImage = getVal('cfg-logo-image', config.logoImage);
            config.logoSize = parseInt(getVal('cfg-logo-size', '40'), 10) || 40;
            config.btnBgColor = getVal('cfg-btn-bg', config.btnBgColor);
            config.btnTextColor = getVal('cfg-btn-text', config.btnTextColor);
            config.btnHoverBgColor = getVal('cfg-btn-hover-bg', config.btnHoverBgColor);
            config.btnHoverTextColor = getVal('cfg-btn-hover-text', config.btnHoverTextColor);
            config.contactInfo = getVal('cfg-contact-info', config.contactInfo);
            config.heroImage = getVal('cfg-hero-image', config.heroImage);
            config.heroTitle = getVal('cfg-hero-title', config.heroTitle);
            config.heroSubtitle = getVal('cfg-hero-subtitle', config.heroSubtitle);
            config.introTitle = getVal('cfg-intro-title', config.introTitle);
            config.introText = getVal('cfg-intro-text', config.introText);
            config.introFooter = getVal('cfg-intro-footer', config.introFooter);
            
            const newPass = getVal('cfg-password');
            if (newPass) {
                config.adminPassword = newPass;
            }
            
            await saveAppConfigAsync(config);
            showToast('Configurações salvas com sucesso!');
            await renderStats();
        });
    }

    // Ouvinte para upload da imagem da Logo
    const logoFileInput = document.getElementById('logo-file-input');
    if (logoFileInput) {
        logoFileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const label = document.getElementById('upload-label-logo-img');
            const btnText = label.querySelector('.upload-btn-text');
            const originalText = btnText.textContent;

            btnText.textContent = "Enviando...";
            label.style.opacity = "0.7";
            label.style.pointerEvents = "none";

            try {
                if (!supabaseClient) {
                    throw new Error("Supabase não inicializado. Verifique a conexão.");
                }

                const fileExt = file.name.split('.').pop();
                const fileName = `logo_${Date.now()}.${fileExt}`;
                const filePath = `brand/${fileName}`;

                const { data, error } = await supabaseClient.storage
                    .from('images')
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: true
                    });

                if (error) throw error;

                const { data: publicUrlData } = supabaseClient.storage
                    .from('images')
                    .getPublicUrl(filePath);

                if (!publicUrlData || !publicUrlData.publicUrl) {
                    throw new Error("Não foi possível gerar a URL pública da logo.");
                }

                document.getElementById('cfg-logo-image').value = publicUrlData.publicUrl;

                btnText.textContent = "Sucesso!";
                setTimeout(() => {
                    btnText.textContent = originalText;
                }, 2000);
            } catch (err) {
                console.error("Erro no upload da logo:", err);
                alert("Erro ao enviar logo: " + err.message + "\n\nCertifique-se de que você criou um bucket público chamado 'images' no painel do Supabase Storage com políticas de escrita para usuários anônimos (anon).");
                btnText.textContent = "Erro";
                setTimeout(() => {
                    btnText.textContent = originalText;
                }, 2000);
            } finally {
                label.style.opacity = "1";
                label.style.pointerEvents = "auto";
            }
        });
    }

    // Ouvinte para upload da imagem do Hero
    const heroFileInput = document.getElementById('hero-file-input');
    if (heroFileInput) {
        heroFileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const label = document.getElementById('upload-label-hero-img');
            const btnText = label.querySelector('.upload-btn-text');
            const originalText = btnText.textContent;

            btnText.textContent = "Enviando...";
            label.style.opacity = "0.7";
            label.style.pointerEvents = "none";

            try {
                if (!supabaseClient) {
                    throw new Error("Supabase não inicializado. Verifique a conexão.");
                }

                const fileExt = file.name.split('.').pop();
                const fileName = `hero_${Date.now()}.${fileExt}`;
                const filePath = `hero/${fileName}`;

                const { data, error } = await supabaseClient.storage
                    .from('images')
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: true
                    });

                if (error) throw error;

                const { data: publicUrlData } = supabaseClient.storage
                    .from('images')
                    .getPublicUrl(filePath);

                if (!publicUrlData || !publicUrlData.publicUrl) {
                    throw new Error("Não foi possível gerar a URL pública do hero.");
                }

                document.getElementById('cfg-hero-image').value = publicUrlData.publicUrl;

                btnText.textContent = "Sucesso!";
                setTimeout(() => {
                    btnText.textContent = originalText;
                }, 2000);
            } catch (err) {
                console.error("Erro no upload da imagem do hero:", err);
                alert("Erro ao enviar imagem: " + err.message + "\n\nCertifique-se de que você criou um bucket público chamado 'images' no painel do Supabase Storage com políticas de escrita para usuários anônimos (anon).");
                btnText.textContent = "Erro";
                setTimeout(() => {
                    btnText.textContent = originalText;
                }, 2000);
            } finally {
                label.style.opacity = "1";
                label.style.pointerEvents = "auto";
            }
        });
    }

    // Export button
    const btnExport = document.getElementById('btn-export-leads');
    if (btnExport) {
        btnExport.addEventListener('click', exportLeadsToCSV);
    }

    // Mask config whatsapp input
    const cfgWhatsappInput = document.getElementById('cfg-whatsapp');
    if (cfgWhatsappInput) {
        cfgWhatsappInput.addEventListener('input', (e) => {
            e.target.value = maskPhone(e.target.value);
        });
    }
}

// Tab navigation in Admin
function initAdminTabs() {
    const tabs = document.querySelectorAll('.sidebar-link');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const targetTab = tab.getAttribute('data-tab');
            document.querySelectorAll('.admin-tab').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`tab-${targetTab}`).classList.add('active');
        });
    });
}

// Stats counter
async function renderStats() {
    const leads = await getLeadsAsync();
    const totalLeads = leads.length;
    const pendingLeads = leads.filter(l => l.status === 'Pendente').length;
    const contactLeads = leads.filter(l => l.status === 'Em Atendimento').length;
    const enrolledLeads = leads.filter(l => l.status === 'Matriculado').length;
    
    document.getElementById('stat-total').textContent = totalLeads;
    document.getElementById('stat-pending').textContent = pendingLeads;
    document.getElementById('stat-contact').textContent = contactLeads;
    document.getElementById('stat-enrolled').textContent = enrolledLeads;
}

// Render leads list
async function renderLeadsTable() {
    const leads = await getLeadsAsync();
    const filterStatus = document.getElementById('filter-status').value;
    const filterModality = document.getElementById('filter-modality').value;
    const tbody = document.getElementById('leads-tbody');
    
    if (!tbody) return;
    tbody.innerHTML = '';
    
    // Dynamic loading of modalities options in filters if not loaded
    const modalFilter = document.getElementById('filter-modality');
    if (modalFilter && modalFilter.options.length <= 1) {
        const config = await getAppConfigAsync();
        config.modalities.forEach(mod => {
            const opt = document.createElement('option');
            opt.value = mod.name;
            opt.textContent = mod.name;
            modalFilter.appendChild(opt);
        });
    }

    const filtered = leads.filter(lead => {
        const matchStatus = !filterStatus || lead.status === filterStatus;
        const matchModality = !filterModality || lead.modality === filterModality;
        return matchStatus && matchModality;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 32px;">Nenhum lead encontrado.</td></tr>`;
        return;
    }

    filtered.forEach(lead => {
        const tr = document.createElement('tr');
        const formattedDate = new Date(lead.date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        tr.innerHTML = `
            <td><strong>${lead.name}</strong></td>
            <td><a href="https://wa.me/${lead.whatsapp.replace(/\D/g, '')}" target="_blank" style="color: var(--primary); font-weight:600;">${lead.whatsapp}</a></td>
            <td>${lead.email}</td>
            <td>${lead.modality}</td>
            <td>${formattedDate}</td>
            <td>
                <select class="status-select ${getStatusClass(lead.status)}" data-id="${lead.id}">
                    <option value="Pendente" ${lead.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
                    <option value="Em Atendimento" ${lead.status === 'Em Atendimento' ? 'selected' : ''}>Em Atendimento</option>
                    <option value="Matriculado" ${lead.status === 'Matriculado' ? 'selected' : ''}>Matriculado</option>
                    <option value="Sem Interesse" ${lead.status === 'Sem Interesse' ? 'selected' : ''}>Sem Interesse</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Listeners for status changes
    tbody.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            const leadId = e.target.getAttribute('data-id');
            const newStatus = e.target.value;
            
            // Update class
            e.target.className = `status-select ${getStatusClass(newStatus)}`;
            
            // Save
            await updateLeadStatusAsync(leadId, newStatus);
            
            await renderStats();
            showToast('Status do lead atualizado!');
        });
    });
}

function getStatusClass(status) {
    switch (status) {
        case 'Pendente': return 'badge-pending';
        case 'Em Atendimento': return 'badge-contact';
        case 'Matriculado': return 'badge-enrolled';
        case 'Sem Interesse': return 'badge-nointerest';
        default: return '';
    }
}

// Load config form inputs in Admin
async function loadConfigForm() {
    const config = await getAppConfigAsync();
    
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
    };

    setVal('cfg-whatsapp', config.whatsapp || '');
    setVal('cfg-address', config.address || '');
    setVal('cfg-maps', config.mapsLink || '');
    setVal('cfg-instagram', config.instagram || '');
    setVal('cfg-facebook', config.facebook || '');
    setVal('cfg-youtube', config.youtube || '');
    setVal('cfg-linkedin', config.linkedin || '');
    setVal('cfg-password', '');
    
    // Carregar novos campos de customização com segurança
    setVal('cfg-logo-text', config.logoText || '');
    setVal('cfg-logo-image', config.logoImage || '');
    setVal('cfg-logo-size', config.logoSize || 40);
    setVal('cfg-btn-bg', config.btnBgColor || '#0073F7');
    setVal('cfg-btn-text', config.btnTextColor || '#FFFFFF');
    setVal('cfg-btn-hover-bg', config.btnHoverBgColor || '#0A43C3');
    setVal('cfg-btn-hover-text', config.btnHoverTextColor || '#FFFFFF');
    setVal('cfg-contact-info', config.contactInfo || '');
    setVal('cfg-hero-image', config.heroImage || '');
    setVal('cfg-hero-title', config.heroTitle || '');
    setVal('cfg-hero-subtitle', config.heroSubtitle || '');
    setVal('cfg-intro-title', config.introTitle || '');
    setVal('cfg-intro-text', config.introText || '');
    setVal('cfg-intro-footer', config.introFooter || '');
}

// Modalities management in Admin tab
async function renderModalitiesList() {
    const config = await getAppConfigAsync();
    const listDiv = document.getElementById('admin-modalities-list');
    if (!listDiv) return;
    
    listDiv.innerHTML = '';
    config.modalities.forEach(mod => {
        const div = document.createElement('div');
        div.className = 'admin-modality-item';
        div.innerHTML = `
            <div class="admin-modality-header">
                <span class="admin-modality-name" id="modality-title-text-${mod.id}">${mod.name}</span>
                <label class="checkbox-label">
                    <input type="checkbox" class="checkbox-control modality-toggle" data-id="${mod.id}" ${mod.active ? 'checked' : ''}>
                    Ativa na LP
                </label>
            </div>
            <div class="admin-form-group">
                <label class="admin-label">Nome da Modalidade</label>
                <input type="text" class="admin-control modality-name-input" data-id="${mod.id}" value="${mod.name}">
            </div>
            <div class="admin-form-group" style="margin-bottom: 0;">
                <label class="admin-label">Imagem de Fundo</label>
                <div style="display: flex; gap: 10px; align-items: center; margin-top: 4px;">
                    <input type="text" class="admin-control modality-image-input" data-id="${mod.id}" value="${mod.image}" style="flex: 1;">
                    <label class="btn" id="upload-label-${mod.id}" style="border-radius: 10px; padding: 12px 20px; font-size: 0.85rem; background-color: #f1f5f9; color: #475569; border: 1px solid var(--border); cursor: pointer; display: flex; align-items: center; gap: 6px; white-space: nowrap; margin-bottom: 0;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                        </svg>
                        <span class="upload-btn-text">Upload</span>
                        <input type="file" class="modality-file-input" data-id="${mod.id}" accept="image/*" style="display: none;">
                    </label>
                </div>
            </div>
        `;
        listDiv.appendChild(div);

        // Sincronizar título ao digitar nome
        const nameInput = div.querySelector('.modality-name-input');
        if (nameInput) {
            nameInput.addEventListener('input', (e) => {
                const titleSpan = document.getElementById(`modality-title-text-${mod.id}`);
                if (titleSpan) {
                    titleSpan.textContent = e.target.value || mod.id;
                }
            });
        }
    });

    // Registrar ouvintes para os inputs de arquivo
    listDiv.querySelectorAll('.modality-file-input').forEach(fileInput => {
        fileInput.addEventListener('change', async (e) => {
            const modId = e.target.getAttribute('data-id');
            const file = e.target.files[0];
            if (!file) return;

            const label = document.getElementById(`upload-label-${modId}`);
            const btnText = label.querySelector('.upload-btn-text');
            const originalText = btnText.textContent;
            
            // Estado de carregamento
            btnText.textContent = "Enviando...";
            label.style.opacity = "0.7";
            label.style.pointerEvents = "none";

            try {
                if (!supabaseClient) {
                    throw new Error("Supabase não inicializado. Verifique a conexão.");
                }

                const fileExt = file.name.split('.').pop();
                const fileName = `${modId}_${Date.now()}.${fileExt}`;
                const filePath = `modalities/${fileName}`;

                // Enviar para o bucket 'images'
                const { data, error } = await supabaseClient.storage
                    .from('images')
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: true
                    });

                if (error) throw error;

                // Obter URL pública
                const { data: publicUrlData } = supabaseClient.storage
                    .from('images')
                    .getPublicUrl(filePath);

                if (!publicUrlData || !publicUrlData.publicUrl) {
                    throw new Error("Não foi possível gerar a URL pública da imagem.");
                }

                // Atualizar o input correspondente com a nova URL pública
                const urlInput = listDiv.querySelector(`.modality-image-input[data-id="${modId}"]`);
                if (urlInput) {
                    urlInput.value = publicUrlData.publicUrl;
                }

                btnText.textContent = "Sucesso!";
                setTimeout(() => {
                    btnText.textContent = originalText;
                }, 2000);
            } catch (err) {
                console.error("Erro no upload da imagem:", err);
                alert("Erro ao enviar imagem: " + err.message + "\n\nCertifique-se de que você criou um bucket público chamado 'images' no painel do Supabase Storage com políticas de escrita para usuários anônimos (anon).");
                btnText.textContent = "Erro";
                setTimeout(() => {
                    btnText.textContent = originalText;
                }, 2000);
            } finally {
                label.style.opacity = "1";
                label.style.pointerEvents = "auto";
            }
        });
    });

    // Save modalities configs
    const btnSaveModalities = document.getElementById('btn-save-modalities');
    if (btnSaveModalities) {
        btnSaveModalities.addEventListener('click', async () => {
            const config = await getAppConfigAsync();
            
            // Loop inputs to read state
            config.modalities = config.modalities.map(mod => {
                const toggle = listDiv.querySelector(`.modality-toggle[data-id="${mod.id}"]`);
                const imgInput = listDiv.querySelector(`.modality-image-input[data-id="${mod.id}"]`);
                const nameInput = listDiv.querySelector(`.modality-name-input[data-id="${mod.id}"]`);
                
                return {
                    ...mod,
                    name: nameInput ? nameInput.value.trim() : mod.name,
                    active: toggle ? toggle.checked : mod.active,
                    image: imgInput ? imgInput.value.trim() : mod.image
                };
            });
            
            await saveAppConfigAsync(config);
            showToast('Modalidades atualizadas com sucesso!');
        });
    }
}

// Spaces management in Admin tab
async function renderSpacesList() {
    const config = await getAppConfigAsync();
    const listDiv = document.getElementById('admin-spaces-list');
    if (!listDiv) return;
    
    listDiv.innerHTML = '';
    config.spaces.forEach(space => {
        const div = document.createElement('div');
        div.className = 'admin-modality-item';
        div.innerHTML = `
            <div class="admin-modality-header">
                <span class="admin-modality-name" id="space-title-text-${space.id}">${space.name}</span>
            </div>
            <div class="admin-form-group">
                <label class="admin-label">Nome do Espaço</label>
                <input type="text" class="admin-control space-name-input" data-id="${space.id}" value="${space.name}">
            </div>
            <div class="admin-form-group" style="margin-bottom: 0;">
                <label class="admin-label">Imagem do Espaço</label>
                <div style="display: flex; gap: 10px; align-items: center; margin-top: 4px;">
                    <input type="text" class="admin-control space-image-input" data-id="${space.id}" value="${space.image}" style="flex: 1;">
                    <label class="btn" id="upload-label-space-${space.id}" style="border-radius: 10px; padding: 12px 20px; font-size: 0.85rem; background-color: #f1f5f9; color: #475569; border: 1px solid var(--border); cursor: pointer; display: flex; align-items: center; gap: 6px; white-space: nowrap; margin-bottom: 0;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                        </svg>
                        <span class="upload-btn-text">Upload</span>
                        <input type="file" class="space-file-input" data-id="${space.id}" accept="image/*" style="display: none;">
                    </label>
                </div>
            </div>
        `;
        listDiv.appendChild(div);
        
        // Sincronizar título ao digitar nome
        const nameInput = div.querySelector('.space-name-input');
        nameInput.addEventListener('input', (e) => {
            const titleSpan = document.getElementById(`space-title-text-${space.id}`);
            if (titleSpan) {
                titleSpan.textContent = e.target.value || space.id;
            }
        });
    });

    // Registrar ouvintes para os inputs de arquivo
    listDiv.querySelectorAll('.space-file-input').forEach(fileInput => {
        fileInput.addEventListener('change', async (e) => {
            const spaceId = e.target.getAttribute('data-id');
            const file = e.target.files[0];
            if (!file) return;

            const label = document.getElementById(`upload-label-space-${spaceId}`);
            const btnText = label.querySelector('.upload-btn-text');
            const originalText = btnText.textContent;
            
            // Estado de carregamento
            btnText.textContent = "Enviando...";
            label.style.opacity = "0.7";
            label.style.pointerEvents = "none";

            try {
                if (!supabaseClient) {
                    throw new Error("Supabase não inicializado. Verifique a conexão.");
                }

                const fileExt = file.name.split('.').pop();
                const fileName = `${spaceId}_${Date.now()}.${fileExt}`;
                const filePath = `spaces/${fileName}`;

                // Enviar para o bucket 'images'
                const { data, error } = await supabaseClient.storage
                    .from('images')
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: true
                    });

                if (error) throw error;

                // Obter URL pública
                const { data: publicUrlData } = supabaseClient.storage
                    .from('images')
                    .getPublicUrl(filePath);

                if (!publicUrlData || !publicUrlData.publicUrl) {
                    throw new Error("Não foi possível gerar a URL pública da imagem.");
                }

                // Atualizar o input correspondente com a nova URL pública
                const urlInput = listDiv.querySelector(`.space-image-input[data-id="${spaceId}"]`);
                if (urlInput) {
                    urlInput.value = publicUrlData.publicUrl;
                }

                btnText.textContent = "Sucesso!";
                setTimeout(() => {
                    btnText.textContent = originalText;
                }, 2000);
            } catch (err) {
                console.error("Erro no upload da imagem do espaço:", err);
                alert("Erro ao enviar imagem: " + err.message + "\n\nCertifique-se de que você criou um bucket público chamado 'images' no painel do Supabase Storage com políticas de escrita para usuários anônimos (anon).");
                btnText.textContent = "Erro";
                setTimeout(() => {
                    btnText.textContent = originalText;
                }, 2000);
            } finally {
                label.style.opacity = "1";
                label.style.pointerEvents = "auto";
            }
        });
    });

    // Save spaces configs
    const btnSaveSpaces = document.getElementById('btn-save-spaces');
    if (btnSaveSpaces) {
        btnSaveSpaces.addEventListener('click', async () => {
            const config = await getAppConfigAsync();
            
            // Loop inputs to read state
            config.spaces = config.spaces.map(space => {
                const nameInput = listDiv.querySelector(`.space-name-input[data-id="${space.id}"]`);
                const imgInput = listDiv.querySelector(`.space-image-input[data-id="${space.id}"]`);
                
                return {
                    ...space,
                    name: nameInput ? nameInput.value.trim() : space.name,
                    image: imgInput ? imgInput.value.trim() : space.image
                };
            });
            
            await saveAppConfigAsync(config);
            showToast('Fotos do espaço atualizadas com sucesso!');
        });
    }
}

// Export captured leads data to CSV
async function exportLeadsToCSV() {
    const leads = await getLeadsAsync();
    if (leads.length === 0) {
        showToast('Não há leads para exportar.');
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Include BOM for proper Excel display (Portuguese characters)
    csvContent += "Nome,WhatsApp,Email,Modalidade de Interesse,Data de Cadastro,Status\n";

    leads.forEach(lead => {
        const formattedDate = new Date(lead.date).toLocaleString('pt-BR');
        // Clean text values from commas/quotes
        const row = [
            `"${lead.name.replace(/"/g, '""')}"`,
            `"${lead.whatsapp}"`,
            `"${lead.email}"`,
            `"${lead.modality}"`,
            `"${formattedDate}"`,
            `"${lead.status}"`
        ].join(",");
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_fluir_conquista_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Detect page type
        if (document.getElementById('vip-form') || document.getElementById('modalities-grid')) {
            await initLandingPage();
        }
        
        if (document.getElementById('login-overlay')) {
            await checkAdminAuth();
            
            // Wire logout button
            const logoutBtn = document.getElementById('admin-logout');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', handleLogout);
            }

            // Table filters
            const statusFilter = document.getElementById('filter-status');
            const modalityFilter = document.getElementById('filter-modality');
            
            if (statusFilter) statusFilter.addEventListener('change', renderLeadsTable);
            if (modalityFilter) modalityFilter.addEventListener('change', renderLeadsTable);
        }
    } catch (domErr) {
        console.error("Erro na inicialização da página:", domErr);
        alert("Erro ao inicializar página: " + domErr.message);
    } finally {
        // Remover o loader com transição suave
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 500);
        }
    }
});
