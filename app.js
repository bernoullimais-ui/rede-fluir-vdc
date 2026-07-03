// Configurações Padrão
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

// --- INITIALIZATION ---
function getAppConfig() {
    let config = localStorage.getItem('fluir_config');
    if (!config) {
        localStorage.setItem('fluir_config', JSON.stringify(DEFAULT_CONFIG));
        return DEFAULT_CONFIG;
    }
    // Deep merge to ensure newly added properties (like spaces) exist
    const parsed = JSON.parse(config);
    return { ...DEFAULT_CONFIG, ...parsed };
}

function saveAppConfig(config) {
    localStorage.setItem('fluir_config', JSON.stringify(config));
}

function getLeads() {
    let leads = localStorage.getItem('fluir_leads');
    return leads ? JSON.parse(leads) : [];
}

function saveLeads(leads) {
    localStorage.setItem('fluir_leads', JSON.stringify(leads));
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
function initLandingPage() {
    const config = getAppConfig();
    
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
        vipForm.addEventListener('submit', (e) => {
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

            const leads = getLeads();
            leads.unshift(newLead); // Add to the top
            saveLeads(leads);

            // Clear form
            vipForm.reset();

            // Display Toast
            showToast('Cadastro VIP realizado com sucesso!');
        });
    }
}

// --- ADMIN PANEL LOGIC ---
let authenticated = false;

function checkAdminAuth() {
    const config = getAppConfig();
    const sessionAuth = sessionStorage.getItem('fluir_auth');
    
    if (sessionAuth === 'true') {
        authenticated = true;
        document.getElementById('login-overlay').style.display = 'none';
        loadAdminDashboard();
    } else {
        document.getElementById('login-overlay').style.display = 'flex';
        
        // Listen to password submit
        const loginForm = document.getElementById('login-form');
        const loginError = document.getElementById('login-error');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const passInput = document.getElementById('login-password').value;
                
                if (passInput === config.adminPassword) {
                    sessionStorage.setItem('fluir_auth', 'true');
                    authenticated = true;
                    document.getElementById('login-overlay').style.display = 'none';
                    loadAdminDashboard();
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

function loadAdminDashboard() {
    if (!authenticated) return;
    
    initAdminTabs();
    renderStats();
    renderLeadsTable();
    loadConfigForm();
    renderModalitiesList();
    
    // Register general save listeners
    const configForm = document.getElementById('admin-config-form');
    if (configForm) {
        configForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const config = getAppConfig();
            
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
            
            saveAppConfig(config);
            showToast('Configurações salvas com sucesso!');
            renderStats();
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
function renderStats() {
    const leads = getLeads();
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
function renderLeadsTable() {
    const leads = getLeads();
    const filterStatus = document.getElementById('filter-status').value;
    const filterModality = document.getElementById('filter-modality').value;
    const tbody = document.getElementById('leads-tbody');
    
    if (!tbody) return;
    tbody.innerHTML = '';
    
    // Dynamic loading of modalities options in filters if not loaded
    const modalFilter = document.getElementById('filter-modality');
    if (modalFilter && modalFilter.options.length <= 1) {
        const config = getAppConfig();
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
        select.addEventListener('change', (e) => {
            const leadId = e.target.getAttribute('data-id');
            const newStatus = e.target.value;
            
            // Update class
            e.target.className = `status-select ${getStatusClass(newStatus)}`;
            
            // Save
            let leads = getLeads();
            leads = leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l);
            saveLeads(leads);
            
            renderStats();
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
function loadConfigForm() {
    const config = getAppConfig();
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
function renderModalitiesList() {
    const config = getAppConfig();
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
        btnSaveModalities.addEventListener('click', () => {
            const config = getAppConfig();
            
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
            
            saveAppConfig(config);
            showToast('Modalidades atualizadas com sucesso!');
        });
    }
}

// Export captured leads data to CSV
function exportLeadsToCSV() {
    const leads = getLeads();
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
document.addEventListener('DOMContentLoaded', () => {
    // Detect page type
    if (document.getElementById('vip-form') || document.getElementById('modalities-grid')) {
        initLandingPage();
    }
    
    if (document.getElementById('login-overlay')) {
        checkAdminAuth();
        
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
