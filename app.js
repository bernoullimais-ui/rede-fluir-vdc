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
let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("Supabase inicializado com sucesso!");
    } catch (e) {
        console.error("Erro ao carregar o cliente do Supabase:", e);
    }
} else {
    console.warn("Supabase URL ou Anon Key não configuradas. Usando LocalStorage.");
}

// --- ASYNC DATA STORAGE HELPERS ---

// Obter Configurações
async function getAppConfigAsync() {
    if (supabase) {
        try {
            // 1. Buscar configuração geral
            const { data: configData, error: configError } = await supabase
                .from('config')
                .select('*')
                .eq('id', 1)
                .maybeSingle();

            if (configError) throw configError;

            // 2. Buscar modalidades
            const { data: modData, error: modError } = await supabase
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
            } else {
                // Inicializar com dados padrão se a tabela estiver vazia
                await supabase.from('config').insert({
                    id: 1,
                    whatsapp: DEFAULT_CONFIG.whatsapp,
                    address: DEFAULT_CONFIG.address,
                    maps_link: DEFAULT_CONFIG.mapsLink,
                    instagram: DEFAULT_CONFIG.instagram,
                    facebook: DEFAULT_CONFIG.facebook,
                    youtube: DEFAULT_CONFIG.youtube,
                    linkedin: DEFAULT_CONFIG.linkedin,
                    admin_password: DEFAULT_CONFIG.adminPassword
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
                    await supabase.from('modalities').insert({
                        id: mod.id,
                        name: mod.name,
                        active: mod.active,
                        image: mod.image
                    });
                }
            }

            return finalConfig;
        } catch (e) {
            console.warn("Supabase indisponível, usando dados locais de LocalStorage:", e);
        }
    }
    
    // Fallback: LocalStorage
    let config = localStorage.getItem('fluir_config');
    if (!config) {
        localStorage.setItem('fluir_config', JSON.stringify(DEFAULT_CONFIG));
        return DEFAULT_CONFIG;
    }
    const parsed = JSON.parse(config);
    return { ...DEFAULT_CONFIG, ...parsed };
}

// Salvar Configurações
async function saveAppConfigAsync(config) {
    // Salvar localmente como backup
    localStorage.setItem('fluir_config', JSON.stringify(config));

    if (supabase) {
        try {
            // Salvar Config Geral
            const { error: configError } = await supabase
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
                    admin_password: config.adminPassword
                });

            if (configError) throw configError;

            // Salvar Modalidades
            for (const mod of config.modalities) {
                const { error: modError } = await supabase
                    .from('modalities')
                    .upsert({
                        id: mod.id,
                        name: mod.name,
                        active: mod.active,
                        image: mod.image
                    });
                if (modError) throw modError;
            }
        } catch (e) {
            console.error("Falha ao sincronizar com o Supabase:", e);
            alert("Erro ao sincronizar com o Supabase. Salvo localmente no navegador.");
        }
    }
}

// Obter Leads
async function getLeadsAsync() {
    if (supabase) {
        try {
            const { data, error } = await supabase
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

    if (supabase) {
        try {
            const { error } = await supabase
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

    if (supabase && isUUID(leadId)) {
        try {
            const { error } = await supabase
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
    
    // 1. Update Contact Links and Info
    const whatsappLink = `https://wa.me/${config.whatsapp.replace(/\D/g, '')}`;
    
    document.querySelectorAll('.whatsapp-url').forEach(el => {
        el.href = whatsappLink;
    });
    
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
    const config = await getAppConfigAsync();
    const sessionAuth = sessionStorage.getItem('fluir_auth');
    
    if (sessionAuth === 'true') {
        authenticated = true;
        document.getElementById('login-overlay').style.display = 'none';
        await loadAdminDashboard();
    } else {
        document.getElementById('login-overlay').style.display = 'flex';
        
        // Listen to password submit
        const loginForm = document.getElementById('login-form');
        const loginError = document.getElementById('login-error');
        
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const passInput = document.getElementById('login-password').value;
                
                if (passInput === config.adminPassword) {
                    sessionStorage.setItem('fluir_auth', 'true');
                    authenticated = true;
                    document.getElementById('login-overlay').style.display = 'none';
                    await loadAdminDashboard();
                } else {
                    loginError.textContent = 'Senha incorreta. Tente novamente.';
                    loginError.style.display = 'block';
                }
            });
        }
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
    
    // Register general save listeners
    const configForm = document.getElementById('admin-config-form');
    if (configForm) {
        configForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const config = await getAppConfigAsync();
            
            config.whatsapp = document.getElementById('cfg-whatsapp').value.trim();
            config.address = document.getElementById('cfg-address').value.trim();
            config.mapsLink = document.getElementById('cfg-maps').value.trim();
            config.instagram = document.getElementById('cfg-instagram').value.trim();
            config.facebook = document.getElementById('cfg-facebook').value.trim();
            config.youtube = document.getElementById('cfg-youtube').value.trim();
            config.linkedin = document.getElementById('cfg-linkedin').value.trim();
            
            const newPass = document.getElementById('cfg-password').value.trim();
            if (newPass) {
                config.adminPassword = newPass;
            }
            
            await saveAppConfigAsync(config);
            showToast('Configurações salvas com sucesso!');
            await renderStats();
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
    document.getElementById('cfg-whatsapp').value = config.whatsapp;
    document.getElementById('cfg-address').value = config.address;
    document.getElementById('cfg-maps').value = config.mapsLink;
    document.getElementById('cfg-instagram').value = config.instagram;
    document.getElementById('cfg-facebook').value = config.facebook;
    document.getElementById('cfg-youtube').value = config.youtube;
    document.getElementById('cfg-linkedin').value = config.linkedin;
    document.getElementById('cfg-password').value = ''; // Leave password empty for security, only overwrite if typed
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
                <span class="admin-modality-name">${mod.name}</span>
                <label class="checkbox-label">
                    <input type="checkbox" class="checkbox-control modality-toggle" data-id="${mod.id}" ${mod.active ? 'checked' : ''}>
                    Ativa na LP
                </label>
            </div>
            <div class="admin-form-group" style="margin-bottom: 0;">
                <label class="admin-label">Caminho da Imagem de Fundo</label>
                <input type="text" class="admin-control modality-image-input" data-id="${mod.id}" value="${mod.image}">
            </div>
        `;
        listDiv.appendChild(div);
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
                
                return {
                    ...mod,
                    active: toggle ? toggle.checked : mod.active,
                    image: imgInput ? imgInput.value.trim() : mod.image
                };
            });
            
            await saveAppConfigAsync(config);
            showToast('Modalidades atualizadas com sucesso!');
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
});
