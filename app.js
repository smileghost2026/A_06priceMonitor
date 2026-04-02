/* ============================================
   PriceMonitor - App Logic
   ============================================ */

(function () {
    'use strict';

    // ── Helpers ──
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);
    const fmt = (n) => '₩' + Number(n).toLocaleString('ko-KR');
    const pct = (cur, prev) => prev === 0 ? 0 : (((cur - prev) / prev) * 100).toFixed(1);
    const randBetween = (a, b) => Math.round(a + Math.random() * (b - a));
    const DAY = 86400000;

    // ── Generate 30-day price history ──
    function generateHistory(base, volatility, trend) {
        const points = [];
        let price = base;
        const now = Date.now();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now - i * DAY);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
            const change = (Math.random() - 0.5 + trend) * volatility;
            price = Math.max(base * 0.8, Math.round(price + change));
            points.push({ date: dateStr, price });
        }
        return points;
    }

    // ── Sample Data ──
    function createSampleData() {
        return [
            {
                id: 'p1', name: 'iPhone 15 Pro 256GB', category: 'Electronics',
                url: 'https://coupang.com/products/iphone15pro', competitor: 'Coupang',
                targetPrice: 1400000,
                history: generateHistory(1550000, 15000, -0.1)
            },
            {
                id: 'p2', name: 'iPhone 15 Pro 256GB', category: 'Electronics',
                url: 'https://shopping.naver.com/iphone15pro', competitor: 'Naver Shopping',
                targetPrice: 1400000,
                history: generateHistory(1580000, 12000, -0.05)
            },
            {
                id: 'p3', name: 'iPhone 15 Pro 256GB', category: 'Electronics',
                url: 'https://11st.co.kr/iphone15pro', competitor: '11번가',
                targetPrice: 1400000,
                history: generateHistory(1520000, 18000, -0.15)
            },
            {
                id: 'p4', name: 'Nike Air Max 90', category: 'Fashion',
                url: 'https://musinsa.com/nike-airmax90', competitor: 'Musinsa',
                targetPrice: 130000,
                history: generateHistory(159000, 3000, -0.05)
            },
            {
                id: 'p5', name: 'Nike Air Max 90', category: 'Fashion',
                url: 'https://zigzag.kr/nike-airmax90', competitor: 'Zigzag',
                targetPrice: 130000,
                history: generateHistory(165000, 4000, 0.02)
            },
            {
                id: 'p6', name: 'Nike Air Max 90', category: 'Fashion',
                url: 'https://coupang.com/nike-airmax90', competitor: 'Coupang',
                targetPrice: 130000,
                history: generateHistory(155000, 2500, -0.08)
            },
            {
                id: 'p7', name: 'Samsung QLED 65" TV', category: 'Electronics',
                url: 'https://lotteon.com/samsung-qled65', competitor: 'Lotte ON',
                targetPrice: 1600000,
                history: generateHistory(1890000, 20000, -0.1)
            },
            {
                id: 'p8', name: 'Samsung QLED 65" TV', category: 'Electronics',
                url: 'https://himart.co.kr/samsung-qled65', competitor: 'Himart',
                targetPrice: 1600000,
                history: generateHistory(1850000, 15000, -0.05)
            },
            {
                id: 'p9', name: 'Samsung QLED 65" TV', category: 'Electronics',
                url: 'https://coupang.com/samsung-qled65', competitor: 'Coupang',
                targetPrice: 1600000,
                history: generateHistory(1820000, 25000, -0.2)
            },
            {
                id: 'p10', name: 'Dyson V15 Detect', category: 'Home & Living',
                url: 'https://coupang.com/dyson-v15', competitor: 'Coupang',
                targetPrice: 750000,
                history: generateHistory(899000, 10000, -0.05)
            },
            {
                id: 'p11', name: 'Sulwhasoo First Care Serum', category: 'Cosmetics',
                url: 'https://oliveyoung.co.kr/sulwhasoo', competitor: 'Olive Young',
                targetPrice: 85000,
                history: generateHistory(120000, 3000, -0.02)
            },
            {
                id: 'p12', name: 'Sulwhasoo First Care Serum', category: 'Cosmetics',
                url: 'https://coupang.com/sulwhasoo', competitor: 'Coupang',
                targetPrice: 85000,
                history: generateHistory(115000, 4000, -0.1)
            },
            {
                id: 'p13', name: 'Instant Pot Duo 7-in-1', category: 'Home & Living',
                url: 'https://coupang.com/instantpot', competitor: 'Coupang',
                targetPrice: 95000,
                history: generateHistory(129000, 3000, -0.03)
            },
            {
                id: 'p14', name: 'Korean Beef Gift Set (1kg)', category: 'Food',
                url: 'https://marketkurly.com/hanwoo-set', competitor: 'Market Kurly',
                targetPrice: 80000,
                history: generateHistory(110000, 5000, 0.05)
            },
            {
                id: 'p15', name: 'New Balance 993', category: 'Fashion',
                url: 'https://musinsa.com/nb993', competitor: 'Musinsa',
                targetPrice: 230000,
                history: generateHistory(259000, 5000, -0.02)
            }
        ];
    }

    // ── State ──
    let products = [];
    let charts = {};

    function loadData() {
        const stored = localStorage.getItem('priceMonitorProducts');
        if (stored) {
            try { products = JSON.parse(stored); } catch { products = createSampleData(); }
        } else {
            products = createSampleData();
        }
        saveData();
    }

    function saveData() {
        localStorage.setItem('priceMonitorProducts', JSON.stringify(products));
    }

    // ── Derived Data ──
    function currentPrice(p) { return p.history[p.history.length - 1].price; }
    function prevPrice(p) { return p.history[p.history.length - 2].price; }
    function priceChange(p) { return currentPrice(p) - prevPrice(p); }
    function priceChangePct(p) { return pct(currentPrice(p), prevPrice(p)); }

    function uniqueProductNames() {
        return [...new Set(products.map(p => p.name))];
    }

    function uniqueCategories() {
        return [...new Set(products.map(p => p.category))];
    }

    function uniqueCompetitors() {
        return [...new Set(products.map(p => p.competitor))];
    }

    function generateAlerts() {
        const alerts = [];
        products.forEach(p => {
            const cur = currentPrice(p);
            const change = priceChange(p);
            const changePctVal = parseFloat(priceChangePct(p));

            if (cur <= p.targetPrice) {
                alerts.push({
                    type: 'target',
                    icon: '🎯',
                    title: `Target price reached! — ${p.name}`,
                    desc: `${p.competitor}: ${fmt(cur)} (target: ${fmt(p.targetPrice)})`,
                    time: 'Now'
                });
            }
            if (changePctVal <= -2) {
                alerts.push({
                    type: 'drop',
                    icon: '📉',
                    title: `Price dropped ${changePctVal}% — ${p.name}`,
                    desc: `${p.competitor}: ${fmt(prevPrice(p))} → ${fmt(cur)}`,
                    time: 'Today'
                });
            }
            if (changePctVal >= 3) {
                alerts.push({
                    type: 'rise',
                    icon: '📈',
                    title: `Price jumped +${changePctVal}% — ${p.name}`,
                    desc: `${p.competitor}: ${fmt(prevPrice(p))} → ${fmt(cur)}`,
                    time: 'Today'
                });
            }
        });
        return alerts;
    }

    // ── Animated Counter ──
    function animateValue(el, start, end, duration) {
        const startTime = performance.now();
        const diff = end - start;
        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(start + diff * eased);
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    // ── Sparkline ──
    function drawSparkline(canvas, data, isPositive) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width = 100;
        const h = canvas.height = 32;
        ctx.clearRect(0, 0, w, h);

        const prices = data.map(d => d.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const range = max - min || 1;

        ctx.beginPath();
        ctx.strokeStyle = isPositive ? '#f85149' : '#3fb950';
        ctx.lineWidth = 1.5;

        prices.forEach((p, i) => {
            const x = (i / (prices.length - 1)) * w;
            const y = h - ((p - min) / range) * (h - 4) - 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Fill gradient
        const lastX = w;
        const lastY = h - ((prices[prices.length - 1] - min) / range) * (h - 4) - 2;
        ctx.lineTo(lastX, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        if (isPositive) {
            grad.addColorStop(0, 'rgba(248,81,73,0.15)');
            grad.addColorStop(1, 'rgba(248,81,73,0)');
        } else {
            grad.addColorStop(0, 'rgba(63,185,80,0.15)');
            grad.addColorStop(1, 'rgba(63,185,80,0)');
        }
        ctx.fillStyle = grad;
        ctx.fill();
    }

    // ── Chart.js defaults ──
    Chart.defaults.color = '#8b949e';
    Chart.defaults.borderColor = '#30363d';
    Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    Chart.defaults.font.size = 11;

    const chartColors = [
        '#58a6ff', '#3fb950', '#f85149', '#d29922',
        '#bc8cff', '#f778ba', '#79c0ff', '#56d4dd'
    ];

    function createLineChart(canvasId, labels, datasets) {
        if (charts[canvasId]) charts[canvasId].destroy();
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', padding: 16 } },
                    tooltip: {
                        backgroundColor: '#1c2128',
                        borderColor: '#30363d',
                        borderWidth: 1,
                        padding: 10,
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: ${fmt(ctx.parsed.y)}`
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: {
                        grid: { color: 'rgba(48,54,61,0.5)' },
                        ticks: { callback: (v) => '₩' + (v >= 1000000 ? (v / 1000000).toFixed(1) + 'M' : (v / 1000).toFixed(0) + 'K') }
                    }
                },
                elements: {
                    point: { radius: 1, hoverRadius: 4 },
                    line: { tension: 0.3, borderWidth: 2 }
                }
            }
        });
        return charts[canvasId];
    }

    // ── Render: Dashboard ──
    function renderDashboard() {
        const drops = products.filter(p => priceChange(p) < 0).length;
        const increases = products.filter(p => priceChange(p) > 0).length;
        const alerts = generateAlerts();

        animateValue($('#statProducts'), 0, products.length, 600);
        animateValue($('#statDrops'), 0, drops, 600);
        animateValue($('#statIncreases'), 0, increases, 600);
        animateValue($('#statAlerts'), 0, alerts.length, 600);
        $('#alertBadge').textContent = alerts.length;

        // Dashboard chart selector
        const sel = $('#dashboardChartProduct');
        const names = uniqueProductNames();
        sel.innerHTML = names.map((n, i) => `<option value="${n}" ${i === 0 ? 'selected' : ''}>${n}</option>`).join('');
        sel.onchange = () => renderDashboardChart(sel.value);
        renderDashboardChart(names[0]);

        // Recent alerts (top 5)
        const container = $('#recentAlerts');
        container.innerHTML = alerts.slice(0, 5).map(a =>
            `<div class="alert-item alert-${a.type}">
                <span class="alert-icon">${a.icon}</span>
                <div class="alert-content">
                    <div class="alert-title">${a.title}</div>
                    <div class="alert-desc">${a.desc}</div>
                </div>
                <span class="alert-time">${a.time}</span>
            </div>`
        ).join('') || '<p style="color:var(--text-muted);font-size:0.85rem;">No alerts at this time.</p>';

        // Top changes
        const sorted = [...products].sort((a, b) => Math.abs(parseFloat(priceChangePct(b))) - Math.abs(parseFloat(priceChangePct(a))));
        const topContainer = $('#topChanges');
        topContainer.innerHTML = sorted.slice(0, 6).map(p => {
            const ch = parseFloat(priceChangePct(p));
            const cls = ch > 0 ? 'change-positive' : ch < 0 ? 'change-negative' : 'change-zero';
            const sign = ch > 0 ? '+' : '';
            return `<div class="change-item">
                <div>
                    <div class="change-product">${p.name}</div>
                    <div class="change-competitor">${p.competitor}</div>
                </div>
                <span class="${cls}">${sign}${ch}%</span>
            </div>`;
        }).join('');
    }

    function renderDashboardChart(productName) {
        const items = products.filter(p => p.name === productName);
        if (!items.length) return;
        const labels = items[0].history.map(h => h.date);
        const datasets = items.map((p, i) => ({
            label: p.competitor,
            data: p.history.map(h => h.price),
            borderColor: chartColors[i % chartColors.length],
            backgroundColor: chartColors[i % chartColors.length] + '20',
            fill: false
        }));
        createLineChart('dashboardChart', labels, datasets);
    }

    // ── Render: Products ──
    function renderProducts(filter) {
        const catFilter = $('#filterCategory').value;
        const compFilter = $('#filterCompetitor').value;
        const search = ($('#globalSearch').value || '').toLowerCase();

        let filtered = products;
        if (catFilter !== 'all') filtered = filtered.filter(p => p.category === catFilter);
        if (compFilter !== 'all') filtered = filtered.filter(p => p.competitor === compFilter);
        if (search) filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(search) ||
            p.competitor.toLowerCase().includes(search) ||
            p.category.toLowerCase().includes(search)
        );

        const tbody = $('#productsBody');
        tbody.innerHTML = filtered.map(p => {
            const cur = currentPrice(p);
            const ch = priceChange(p);
            const chPct = priceChangePct(p);
            const isUp = ch > 0;
            const changeClass = ch > 0 ? 'change-positive' : ch < 0 ? 'change-negative' : 'change-zero';
            const sign = ch > 0 ? '+' : '';
            const belowTarget = cur <= p.targetPrice;

            let badge = '';
            if (belowTarget) badge = '<span class="badge badge-green">🎯 Target Hit!</span>';
            else if (parseFloat(chPct) <= -3) badge = '<span class="badge badge-green">New Low!</span>';
            else if (parseFloat(chPct) >= 3) badge = `<span class="badge badge-red">+${chPct}% Today</span>`;
            else badge = '<span class="badge badge-neutral">Tracking</span>';

            return `<tr>
                <td>
                    <span class="product-name">${p.name}</span>
                    <span class="product-url">${p.url}</span>
                </td>
                <td>${p.category}</td>
                <td>${p.competitor}</td>
                <td class="price">${fmt(cur)}</td>
                <td class="${changeClass}">${sign}${fmt(ch)} (${sign}${chPct}%)</td>
                <td style="color:var(--text-muted)">${fmt(p.targetPrice)}</td>
                <td class="sparkline-cell"><canvas data-sparkline="${p.id}"></canvas></td>
                <td>${badge}</td>
                <td>
                    <button class="btn btn-sm btn-ghost" onclick="app.showDetail('${p.id}')">📊</button>
                    <button class="btn btn-sm btn-danger" onclick="app.deleteProduct('${p.id}')">✕</button>
                </td>
            </tr>`;
        }).join('');

        // Draw sparklines
        requestAnimationFrame(() => {
            filtered.forEach(p => {
                const canvas = document.querySelector(`canvas[data-sparkline="${p.id}"]`);
                if (canvas) drawSparkline(canvas, p.history.slice(-14), priceChange(p) > 0);
            });
        });

        // Populate filter dropdowns
        const catSel = $('#filterCategory');
        const cats = uniqueCategories();
        if (catSel.options.length <= 1) {
            cats.forEach(c => { const o = new Option(c, c); catSel.add(o); });
        }
        const compSel = $('#filterCompetitor');
        const comps = uniqueCompetitors();
        if (compSel.options.length <= 1) {
            comps.forEach(c => { const o = new Option(c, c); compSel.add(o); });
        }
    }

    // ── Render: Alerts ──
    function renderAlerts() {
        const alerts = generateAlerts();
        const container = $('#alertsList');
        if (!alerts.length) {
            container.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--text-muted);">No active alerts. All prices are stable.</div>';
            return;
        }
        container.innerHTML = alerts.map(a =>
            `<div class="alert-item alert-${a.type}">
                <span class="alert-icon">${a.icon}</span>
                <div class="alert-content">
                    <div class="alert-title">${a.title}</div>
                    <div class="alert-desc">${a.desc}</div>
                </div>
                <span class="alert-time">${a.time}</span>
            </div>`
        ).join('');
    }

    // ── Render: Compare ──
    function renderCompare() {
        const sel = $('#compareProduct');
        const names = uniqueProductNames();
        sel.innerHTML = names.map((n, i) => `<option value="${n}" ${i === 0 ? 'selected' : ''}>${n}</option>`).join('');
        sel.onchange = () => renderCompareView(sel.value);
        renderCompareView(names[0]);
    }

    function renderCompareView(productName) {
        const items = products.filter(p => p.name === productName);
        if (!items.length) return;

        const prices = items.map(p => ({ competitor: p.competitor, price: currentPrice(p), change: priceChange(p), changePct: priceChangePct(p) }));
        const minPrice = Math.min(...prices.map(p => p.price));

        const container = $('#compareContainer');
        container.innerHTML = prices.map(p => {
            const isBest = p.price === minPrice;
            const cls = p.change > 0 ? 'change-positive' : p.change < 0 ? 'change-negative' : 'change-zero';
            const sign = p.change > 0 ? '+' : '';
            return `<div class="compare-card ${isBest ? 'best-price' : ''}">
                <div class="compare-competitor">${p.competitor}</div>
                <div class="compare-price">${fmt(p.price)}</div>
                <div class="compare-change ${cls}">${sign}${p.changePct}% vs yesterday</div>
            </div>`;
        }).join('');

        // Chart
        const labels = items[0].history.map(h => h.date);
        const datasets = items.map((p, i) => ({
            label: p.competitor,
            data: p.history.map(h => h.price),
            borderColor: chartColors[i % chartColors.length],
            backgroundColor: chartColors[i % chartColors.length] + '20',
            fill: false
        }));
        createLineChart('compareChart', labels, datasets);
    }

    // ── Render: Categories ──
    function renderCategories() {
        const cats = uniqueCategories();
        const catIcons = { Electronics: '💻', Fashion: '👟', Food: '🥩', Cosmetics: '💄', 'Home & Living': '🏠', Sports: '⚽', Books: '📚' };
        const container = $('#categoriesGrid');
        container.innerHTML = cats.map(cat => {
            const items = products.filter(p => p.category === cat);
            const drops = items.filter(p => priceChange(p) < 0).length;
            const rises = items.filter(p => priceChange(p) > 0).length;
            const avgChange = items.length ? (items.reduce((s, p) => s + parseFloat(priceChangePct(p)), 0) / items.length).toFixed(1) : 0;
            const sign = avgChange > 0 ? '+' : '';
            const cls = avgChange > 0 ? 'stat-red' : avgChange < 0 ? 'stat-green' : '';
            return `<div class="category-card" onclick="app.filterByCategory('${cat}')">
                <div class="category-header">
                    <span class="category-name">${catIcons[cat] || '📦'} ${cat}</span>
                    <span class="category-count">${items.length} products</span>
                </div>
                <div class="category-stats">
                    <div class="category-stat-item"><span class="stat-green">▼ ${drops}</span> drops</div>
                    <div class="category-stat-item"><span class="stat-red">▲ ${rises}</span> rises</div>
                    <div class="category-stat-item ${cls}">Avg: ${sign}${avgChange}%</div>
                </div>
            </div>`;
        }).join('');
    }

    // ── Product Detail Modal ──
    function showDetail(id) {
        const p = products.find(x => x.id === id);
        if (!p) return;

        $('#detailTitle').textContent = `${p.name} — ${p.competitor}`;
        const cur = currentPrice(p);
        const prices = p.history.map(h => h.price);
        const min30 = Math.min(...prices);
        const max30 = Math.max(...prices);

        $('#detailStats').innerHTML = `
            <div class="detail-stat">
                <div class="detail-stat-label">Current</div>
                <div class="detail-stat-value">${fmt(cur)}</div>
            </div>
            <div class="detail-stat">
                <div class="detail-stat-label">30d Low</div>
                <div class="detail-stat-value stat-green">${fmt(min30)}</div>
            </div>
            <div class="detail-stat">
                <div class="detail-stat-label">30d High</div>
                <div class="detail-stat-value stat-red">${fmt(max30)}</div>
            </div>
            <div class="detail-stat">
                <div class="detail-stat-label">Target</div>
                <div class="detail-stat-value" style="color:var(--yellow)">${fmt(p.targetPrice)}</div>
            </div>
        `;

        const labels = p.history.map(h => h.date);
        const datasets = [
            {
                label: 'Price',
                data: prices,
                borderColor: '#58a6ff',
                backgroundColor: 'rgba(88,166,255,0.1)',
                fill: true
            },
            {
                label: 'Target',
                data: Array(30).fill(p.targetPrice),
                borderColor: '#d29922',
                borderDash: [5, 5],
                borderWidth: 1,
                pointRadius: 0,
                fill: false
            }
        ];
        createLineChart('detailChart', labels, datasets);
        $('#detailOverlay').classList.add('active');
    }

    // ── Add Product ──
    function addProduct(e) {
        e.preventDefault();
        const name = $('#formName').value.trim();
        const url = $('#formUrl').value.trim();
        const competitor = $('#formCompetitor').value.trim();
        const price = parseInt($('#formPrice').value);
        const target = parseInt($('#formTarget').value);
        const category = $('#formCategory').value;

        if (!name || !competitor || !price || !target || !category) return;

        const newProduct = {
            id: 'p' + Date.now(),
            name, url, competitor, category,
            targetPrice: target,
            history: generateHistory(price, price * 0.01, 0)
        };

        products.push(newProduct);
        saveData();
        closeModal();
        renderAll();
    }

    function deleteProduct(id) {
        products = products.filter(p => p.id !== id);
        saveData();
        renderAll();
    }

    // ── Navigation ──
    function navigate(view) {
        $$('.nav-item').forEach(n => n.classList.remove('active'));
        $(`.nav-item[data-view="${view}"]`).classList.add('active');
        $$('.view').forEach(v => v.classList.remove('active'));
        $(`#view-${view}`).classList.add('active');

        if (view === 'dashboard') renderDashboard();
        if (view === 'products') renderProducts();
        if (view === 'alerts') renderAlerts();
        if (view === 'compare') renderCompare();
        if (view === 'categories') renderCategories();
    }

    // ── Modal ──
    function openModal() { $('#modalOverlay').classList.add('active'); }
    function closeModal() {
        $('#modalOverlay').classList.remove('active');
        $('#addProductForm').reset();
    }

    // ── Render All ──
    function renderAll() {
        renderDashboard();
        renderProducts();
    }

    // ── Filter by category from categories view ──
    function filterByCategory(cat) {
        navigate('products');
        $('#filterCategory').value = cat;
        renderProducts();
    }

    // ── Init ──
    function init() {
        loadData();

        // Nav
        $$('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                navigate(item.dataset.view);
            });
        });

        // Mobile menu
        $('#menuToggle').addEventListener('click', () => {
            $('#sidebar').classList.toggle('open');
        });

        // Modal
        $('#addProductBtn').addEventListener('click', openModal);
        $('#modalClose').addEventListener('click', closeModal);
        $('#formCancel').addEventListener('click', closeModal);
        $('#modalOverlay').addEventListener('click', (e) => { if (e.target === e.currentTarget) closeModal(); });
        $('#detailClose').addEventListener('click', () => $('#detailOverlay').classList.remove('active'));
        $('#detailOverlay').addEventListener('click', (e) => { if (e.target === e.currentTarget) e.currentTarget.classList.remove('active'); });

        // Form
        $('#addProductForm').addEventListener('submit', addProduct);

        // Filters
        $('#filterCategory').addEventListener('change', renderProducts);
        $('#filterCompetitor').addEventListener('change', renderProducts);
        $('#globalSearch').addEventListener('input', renderProducts);

        // Refresh
        $('#refreshBtn').addEventListener('click', () => {
            // Simulate price update
            products.forEach(p => {
                const last = currentPrice(p);
                const change = (Math.random() - 0.5) * last * 0.02;
                const newPrice = Math.round(last + change);
                p.history.push({
                    date: `${new Date().getMonth() + 1}/${new Date().getDate()}`,
                    price: newPrice
                });
                if (p.history.length > 30) p.history.shift();
            });
            saveData();
            renderAll();
            $('#lastSync').textContent = 'just now';
        });

        // Initial render
        renderAll();
    }

    // Expose needed functions globally
    window.app = { showDetail, deleteProduct, filterByCategory };

    // Boot
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
