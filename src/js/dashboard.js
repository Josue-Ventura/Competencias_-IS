/**
 * dashboard.js — Repositorio de Datos Centralizado y Lógica de Integración
 * ──────────────────────────────────────────────────────────────────────
 * Este archivo actúa como el "backend" simulado y controlador principal.
 * Implementa HU-23, HU-11 y HU-12.
 */

// =============================================================================
// 1. REPOSITORIO DE DATOS (Simulación de Base de Datos)
// =============================================================================
const RepositorioDatos = {
    key: 'eduSystem_data',

    // Datos iniciales (si no hay nada en localStorage)
    defaults: {
        estudiantes: [
            { id: 1, nombre: 'Ana García', xp: 720, nivel: 5, nivelNombre: 'Explorador', iniciales: 'AG' },
            { id: 2, nombre: 'Juan Pérez', xp: 450, nivel: 3, nivelNombre: 'Iniciado', iniciales: 'JP' }
        ],
        grupos: [
            { id: 1, nombre: 'Matemáticas Avanzadas', profesor: 'Prof. Ramírez', alumnos: 28, color: 'purple', progreso: 78 },
            { id: 2, nombre: 'Física General II', profesor: 'Prof. Torres', alumnos: 32, color: 'teal', progreso: 57 }
        ],
        desafios: [
            { id: 'd1', titulo: 'Derivadas e integrales', materia: 'Matemáticas Avanzadas', puntos: 150, vencimiento: 'Mañana', prioridad: 'high', estado: 'pendiente' },
            { id: 'd2', titulo: 'Leyes de Newton', materia: 'Física General II', puntos: 200, vencimiento: 'En 3 días', prioridad: 'medium', estado: 'pendiente' },
            { id: 'd3', titulo: 'Álgebra lineal: matrices', materia: 'Matemáticas Avanzadas', puntos: 120, vencimiento: 'En 7 días', prioridad: 'low', estado: 'pendiente' },
            { id: 'd4', titulo: 'Cinemática básica', materia: 'Física General II', puntos: 100, vencimiento: 'Hace 2 días', prioridad: 'low', estado: 'completado', calificacion: 95 }
        ],
        entregas: [
            { id: 101, desafioId: 'd1', estudianteId: 1, nombreEstudiante: 'Ana García', iniciales: 'AG', estado: 'entregado', fecha: '2026-05-26', codigo: 'public class Derivadas {\n    public static void main(String[] args) {\n        // Solución calculada\n        System.out.println("Derivada de x^2 es 2x");\n    }\n}', calificacion: null },
            { id: 102, desafioId: 'd1', estudianteId: 2, nombreEstudiante: 'Juan Pérez', iniciales: 'JP', estado: 'pendiente', fecha: null, codigo: null, calificacion: null }
        ]
    },

    // Obtener datos actuales
    getData() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : this.defaults;
    },

    // Guardar cambios
    saveData(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    },

    // Calificar una entrega (HU-12)
    calificarEntrega(entregaId, calificacion, feedback) {
        const data = this.getData();
        const entrega = data.entregas.find(e => e.id === entregaId);
        if (entrega) {
            entrega.calificacion = parseInt(calificacion);
            entrega.estado = 'calificado';
            entrega.feedback = feedback;
            
            // Si es la entrega de Ana (id: 1), actualizamos su progreso global (HU-11)
            if (entrega.estudianteId === 1) {
                const ana = data.estudiantes.find(e => e.id === 1);
                ana.xp += 50; // Aumento simulado de XP por entrega calificada
                
                // Actualizar estado del desafío en la lista general de desafíos
                const desafio = data.desafios.find(d => d.id === entrega.desafioId);
                if (desafio) {
                    desafio.estado = 'completado';
                    desafio.calificacion = calificacion;
                }
            }
            
            this.saveData(data);
            return true;
        }
        return false;
    }
};


// =============================================================================
// 2. LÓGICA COMÚN (Sidebar, UI, Utilidades)
// =============================================================================
function initCommonUI() {
    // Fecha dinámica
    const dateEl = document.getElementById('currentDate');
    if (dateEl) {
        const now = new Date();
        dateEl.textContent = now.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const toggleBtn = document.getElementById('menuToggle');

    if (sidebar && overlay && toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('is-open');
            overlay.classList.toggle('is-visible');
        });
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('is-open');
            overlay.classList.remove('is-visible');
        });
    }
}


// =============================================================================
// 3. HU-23: DASHBOARD ESTUDIANTE (index.html)
// =============================================================================
function initStudentDashboard() {
    const data = RepositorioDatos.getData();
    const ana = data.estudiantes.find(e => e.id === 1);
    
    // Actualizar métricas (KPIs)
    const pendingCount = data.desafios.filter(d => d.estado === 'pendiente').length;
    document.querySelectorAll('.metric-card--challenges .metric-card__value').forEach(el => el.textContent = pendingCount);
    document.querySelectorAll('.metric-card--score .metric-card__value').forEach(el => el.textContent = ana.xp.toLocaleString());
    
    // Poblar lista de desafíos pendientes
    const list = document.querySelector('.challenge-list');
    if (list) {
        list.innerHTML = data.desafios.filter(d => d.estado === 'pendiente').map(d => `
            <li class="challenge-item">
                <div class="challenge-item__left">
                    <span class="priority-dot priority-dot--${d.prioridad}"></span>
                    <div class="challenge-item__info">
                        <p class="challenge-item__name">${d.titulo}</p>
                        <p class="challenge-item__meta">
                            <i class="ti ti-clock"></i> ${d.vencimiento} &nbsp;·&nbsp; ${d.puntos} pts
                        </p>
                    </div>
                </div>
                <button class="btn btn--primary btn--sm">Iniciar</button>
            </li>
        `).join('');
    }
}


// =============================================================================
// 4. HU-11: PROGRESO DE NIVEL (estudiante-progreso.html)
// =============================================================================
function initStudentProgress() {
    const data = RepositorioDatos.getData();
    const ana = data.estudiantes.find(e => e.id === 1);
    const xpNext = 1000;
    const pct = Math.round((ana.xp / xpNext) * 100);

    // Update Hero
    const levelNumber = document.getElementById('levelNumber');
    if (levelNumber) levelNumber.textContent = ana.nivel;
    
    const xpBarFill = document.getElementById('xpBarFill');
    if (xpBarFill) xpBarFill.style.width = `${pct}%`;
    
    const xpPct = document.getElementById('xpPct');
    if (xpPct) xpPct.textContent = `${pct}%`;

    // Populate challenges table
    const tableBody = document.getElementById('challengesTableBody');
    if (tableBody) {
        tableBody.innerHTML = data.desafios.map(d => `
            <tr>
                <td><strong>${d.titulo}</strong></td>
                <td>${d.materia}</td>
                <td>${d.vencimiento}</td>
                <td>${d.puntos} pts</td>
                <td>
                    <span class="status-pill status-pill--${d.estado === 'completado' ? 'success' : 'warning'}">
                        ${d.estado === 'completado' ? 'Completado' : 'Pendiente'}
                    </span>
                </td>
            </tr>
        `).join('');
    }
}


// =============================================================================
// 5. HU-12: CONSULTA DE DESAFÍOS / PROFESOR (profesor-desafio.html)
// =============================================================================
function initTeacherView() {
    const data = RepositorioDatos.getData();
    const challengeList = document.getElementById('challengeList');
    const submissionList = document.getElementById('submissionList');
    const emptyState = document.getElementById('emptyState');
    const graderContent = document.getElementById('graderContent');
    const graderEmpty = document.getElementById('graderEmpty');

    if (!challengeList) return;

    // Poblar lista de desafíos
    challengeList.innerHTML = data.desafios.map(d => `
        <li class="challenge-card" data-id="${d.id}">
            <div class="challenge-card__info">
                <h4>${d.titulo}</h4>
                <p>${d.materia}</p>
            </div>
            <i class="ti ti-chevron-right"></i>
        </li>
    `).join('');

    // Evento clic en desafío
    challengeList.querySelectorAll('.challenge-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const d = data.desafios.find(x => x.id === id);
            
            challengeList.querySelectorAll('.challenge-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            document.getElementById('submissionsPanelTitle').textContent = d.titulo;
            emptyState.style.display = 'none';
            submissionList.style.display = 'block';

            // Filtrar entregas para este desafío
            const entregas = data.entregas.filter(e => e.desafioId === id);
            submissionList.innerHTML = entregas.map(e => `
                <li class="submission-item" data-id="${e.id}">
                    <div class="submission-item__avatar">${e.iniciales}</div>
                    <div class="submission-item__info">
                        <p class="submission-item__name">${e.nombreEstudiante}</p>
                        <p class="submission-item__status">${e.estado === 'calificado' ? 'Nota: ' + e.calificacion : 'Pendiente'}</p>
                    </div>
                </li>
            `).join('');

            // Evento clic en entrega
            submissionList.querySelectorAll('.submission-item').forEach(sItem => {
                sItem.addEventListener('click', () => {
                    const eId = parseInt(sItem.dataset.id);
                    const entrega = data.entregas.find(x => x.id === eId);
                    
                    submissionList.querySelectorAll('.submission-item').forEach(i => i.classList.remove('active'));
                    sItem.classList.add('active');

                    graderEmpty.style.display = 'none';
                    graderContent.style.display = 'block';

                    document.getElementById('graderStudentName').textContent = entrega.nombreEstudiante;
                    document.getElementById('graderAvatar').textContent = entrega.iniciales;
                    document.getElementById('codeContent').textContent = entrega.codigo || '// No hay contenido';
                    document.getElementById('gradeInput').value = entrega.calificacion || '';
                    document.getElementById('feedbackInput').value = entrega.feedback || '';

                    // Guardar calificación
                    const saveBtn = document.getElementById('saveGradeBtn');
                    saveBtn.onclick = () => {
                        const grade = document.getElementById('gradeInput').value;
                        const feedback = document.getElementById('feedbackInput').value;
                        if (grade === '') return alert('Ingresa una nota');
                        
                        RepositorioDatos.calificarEntrega(eId, grade, feedback);
                        
                        // Feedback visual
                        const toast = document.getElementById('gradeToast');
                        toast.style.display = 'flex';
                        setTimeout(() => { toast.style.display = 'none'; }, 3000);
                        
                        // Refrescar vista
                        initTeacherView();
                    };
                });
            });
        });
    });
}


// =============================================================================
// INICIALIZACIÓN GLOBAL
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
    initCommonUI();
    
    // Identificar qué página estamos cargando por su URL o elementos únicos
    const path = window.location.pathname;
    
    if (document.querySelector('.dashboard')) {
        initStudentDashboard();
    } 
    
    if (document.querySelector('.hu11-layout')) {
        initStudentProgress();
    }
    
    if (document.querySelector('.hu12-layout')) {
        initTeacherView();
    }
});
