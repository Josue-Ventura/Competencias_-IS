/* ================================================================
   progresoController.js — Controlador HU-11: Progreso de Nivel
   Criterios:
     CA-1  El sistema muestra porcentaje completado
     CA-2  Se muestra nivel actual del usuario (renderizado en HTML)
     CA-3  Se muestra si está completo o pendiente
   ================================================================ */

(function ProgresoController() {
    'use strict';

    /* ── Config de niveles ─────────────────────────────────────── */
    const NIVELES = [
        { nivel:1, nombre:'Novato',      xpMin:0,    xpMax:200  },
        { nivel:2, nombre:'Aprendiz',    xpMin:200,  xpMax:400  },
        { nivel:3, nombre:'Iniciado',    xpMin:400,  xpMax:650  },
        { nivel:4, nombre:'Avanzado',    xpMin:650,  xpMax:1000 },
        { nivel:5, nombre:'Explorador',  xpMin:1000, xpMax:1400 },
        { nivel:6, nombre:'Experto',     xpMin:1400, xpMax:1900 },
        { nivel:7, nombre:'Maestro',     xpMin:1900, xpMax:2500 },
    ];

    /* Simula XP del estudiante actual (en producción: viene del API) */
    const STUDENT_XP = 1240;

    /* ── Calcular nivel a partir del XP ───────────────────────── */
    function calcularNivel(xp) {
        for (let i = NIVELES.length - 1; i >= 0; i--) {
            if (xp >= NIVELES[i].xpMin) return NIVELES[i];
        }
        return NIVELES[0];
    }

    /* ── CA-1: Renderizar porcentaje de XP hacia siguiente nivel ─ */
    function renderXPBar(xp) {
        const nivelActual   = calcularNivel(xp);
        const xpEnNivel     = xp - nivelActual.xpMin;
        const rangoNivel    = nivelActual.xpMax - nivelActual.xpMin;
        const porcentaje    = Math.round((xpEnNivel / rangoNivel) * 100);
        const siguienteNivel = NIVELES[nivelActual.nivel] || nivelActual;

        // Actualizar DOM
        const elNum  = document.getElementById('levelNumber');
        const elName = document.getElementById('levelNameText');
        const elCurXP= document.getElementById('currentXP');
        const elNxtXP= document.getElementById('nextLevelXP');
        const elBar  = document.getElementById('xpBarFill');
        const elPct  = document.querySelector('.xp-bar__pct');
        const elCompleted = document.getElementById('totalCompleted');
        const elPending   = document.getElementById('totalPending');
        const elScore     = document.getElementById('totalScore');

        if (elNum)  elNum.textContent  = nivelActual.nivel;
        if (elName) elName.textContent = nivelActual.nombre;
        if (elCurXP)elCurXP.textContent= xp.toLocaleString('es-MX');
        if (elNxtXP)elNxtXP.textContent= nivelActual.xpMax.toLocaleString('es-MX');
        if (elBar)  { elBar.style.width = porcentaje + '%'; }
        if (elPct)  elPct.textContent   = porcentaje + '%';

        // Actualizar atributo ARIA
        const track = document.querySelector('.xp-bar__track');
        if (track) track.setAttribute('aria-valuenow', porcentaje);

        // Stats
        const completados = AppDB.desafiosEstudiante.filter(d => d.estado === 'complete').length;
        const pendientes  = AppDB.desafiosEstudiante.filter(d => d.estado === 'pending' || d.estado === 'overdue').length;

        if (elCompleted) elCompleted.textContent = completados;
        if (elPending)   elPending.textContent   = pendientes;
        if (elScore)     elScore.textContent     = xp.toLocaleString('es-MX');

        // Animar el anillo SVG del nivel según porcentaje
        const ring = document.getElementById('levelRingProgress') || document.querySelector('.level-ring-anim');
        if (ring) {
            const circunferencia = 2 * Math.PI * 58; // r=58 → ≈ 364
            const dash = (porcentaje / 100) * circunferencia;
            const gap  = circunferencia - dash;
            // Se actualiza el dasharray vía CSS animation (ya declarado en CSS)
            ring.style.setProperty('--target-dash', `${dash} ${gap}`);
        }
    }

    /* ── CA-1: Renderizar tarjetas de progreso por materia ──────── */
    function renderSubjectProgress() {
        const grid = document.getElementById('subjectProgressGrid');
        if (!grid) return;

        grid.innerHTML = AppDB.materias.map(mat => {
            const pct = mat.progreso;
            const colorClass = pct >= 75 ? 'bar-high' : pct >= 50 ? 'bar-mid' : 'bar-low';
            const fillColor  = pct >= 75 ? 'var(--ipn-600)' : pct >= 50 ? 'var(--amber-400)' : 'var(--red-600)';

            return `
        <article class="subject-progress-card">
          <div class="subject-progress-card__header">
            <div>
              <p class="subject-progress-card__name">${mat.nombre}</p>
              <p class="subject-progress-card__teacher">${mat.profesor}</p>
            </div>
            <div class="subject-progress-card__pct-circle" aria-label="${pct}% completado">
              ${pct}%
            </div>
          </div>

          <!-- CA-1: Barra de porcentaje completado -->
          <div class="subject-bar-track"
               role="progressbar"
               aria-valuenow="${pct}"
               aria-valuemin="0"
               aria-valuemax="100"
               aria-label="${mat.nombre}: ${pct}% completado">
            <div class="subject-bar-fill" style="width:${pct}%; background:${fillColor};"></div>
          </div>

          <div class="subject-progress-card__stats">
            <span><i class="ti ti-circle-check"></i> ${mat.completados} completados</span>
            <span><i class="ti ti-books"></i> ${mat.total} total</span>
          </div>
        </article>
      `;
        }).join('');
    }

    /* ── CA-3: Renderizar tabla de desafíos con estado ──────────── */
    let filtroActual = 'all';

    function renderChallengesTable(filtro = 'all') {
        const tbody = document.getElementById('challengesTableBody');
        if (!tbody) return;

        let datos = [...AppDB.desafiosEstudiante];

        // Aplicar filtro
        if (filtro === 'complete') datos = datos.filter(d => d.estado === 'complete');
        if (filtro === 'pending')  datos = datos.filter(d => d.estado === 'pending' || d.estado === 'overdue');

        if (datos.length === 0) {
            tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;padding:var(--space-xl);color:var(--color-text-muted);font-size:13px;">
            <i class="ti ti-inbox" style="font-size:28px;display:block;margin-bottom:8px;opacity:0.4;"></i>
            No hay desafíos para mostrar con este filtro.
          </td>
        </tr>`;
            return;
        }

        tbody.innerHTML = datos.map(d => {
            // Estado visual (CA-3)
            let estadoBadge = '';
            if (d.estado === 'complete') {
                estadoBadge = `<span class="state-badge state-badge--complete"><i class="ti ti-circle-check"></i> Completo</span>`;
            } else if (d.estado === 'overdue') {
                estadoBadge = `<span class="state-badge state-badge--overdue"><i class="ti ti-alert-triangle"></i> Vencido</span>`;
            } else {
                const dias = d.diasRestantes;
                const label = dias === 1 ? 'Vence mañana' : `${dias} días restantes`;
                estadoBadge = `<span class="state-badge state-badge--pending"><i class="ti ti-clock"></i> Pendiente</span>`;
            }

            // Puntaje
            const scoreHtml = d.puntaje !== null
                ? `<span class="ct-score">${d.puntaje} pts</span>`
                : `<span class="ct-score--pending">—</span>`;

            // Fecha vencida
            const dateClass = d.estado === 'overdue' ? 'ct-date ct-date--overdue' : 'ct-date';

            return `
        <tr data-estado="${d.estado}">
          <td>
            <p class="ct-challenge-name">${d.titulo}</p>
          </td>
          <td>
            <span class="badge badge--ipn">${d.materia}</span>
          </td>
          <td>
            <span class="${dateClass}">${AppDB.formatDate(d.fechaLimite)}</span>
          </td>
          <td>${scoreHtml}</td>
          <td>${estadoBadge}</td>
        </tr>
      `;
        }).join('');
    }

    /* ── Filtros de la tabla ─────────────────────────────────────── */
    function initFiltros() {
        const tabs = document.querySelectorAll('.filter-tab[data-filter]');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('filter-tab--active'));
                tab.classList.add('filter-tab--active');
                filtroActual = tab.dataset.filter;
                renderChallengesTable(filtroActual);
            });
        });
    }

    /* ── INIT ──────────────────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', () => {
        renderXPBar(STUDENT_XP);          // CA-1 + CA-2
        renderSubjectProgress();           // CA-1
        renderChallengesTable('all');      // CA-3
        initFiltros();
        console.info('[HU-11] ProgresoController iniciado correctamente.');
    });

})();