const projectsUrl = '/projects.json';
const timelineUrl = '/timeline.json';

async function fetchJson(url){
  try{
    const res = await fetch(url + '?_=' + Date.now(), {cache: 'no-store'});
    if(!res.ok) throw new Error('Failed to load ' + url);
    return await res.json();
  }catch(e){
    console.error(e);
    return [];
  }
}

function fetchProjects(){
  return fetchJson(projectsUrl);
}

function renderTimeline(list){
  const container = document.getElementById('timeline-list');
  const tpl = document.getElementById('timeline-template');
  if(!container || !tpl) return;
  container.innerHTML = '';
  if(!list.length){
    container.textContent = 'No timeline entries found.';
    return;
  }
  list.forEach(item=>{
    const node = tpl.content.cloneNode(true);
    const el = node.querySelector('.timeline-item');
    el.classList.add('timeline-' + (item.type || 'other'));
    node.querySelector('.timeline-role').textContent = item.role;
    node.querySelector('.timeline-badge').textContent = item.type === 'education' ? 'Education' : 'Experience';
    node.querySelector('.timeline-org').textContent = item.org;
    node.querySelector('.timeline-dates').textContent = `${item.start} – ${item.end}`;
    const bullets = node.querySelector('.timeline-bullets');
    (item.bullets || []).forEach(b=>{
      const li = document.createElement('li');
      li.textContent = b;
      bullets.appendChild(li);
    });
    if(!(item.bullets || []).length) bullets.remove();
    container.appendChild(node);
  })
}

function renderProjects(list){
  const container = document.getElementById('projects-list');
  const tpl = document.getElementById('project-template');
  container.innerHTML = '';
  if(!list.length){
    container.textContent = 'No projects found.';
    return;
  }
  list.forEach(p=>{
    const node = tpl.content.cloneNode(true);
    node.querySelector('.project-title').textContent = p.title;
    node.querySelector('.project-desc').textContent = p.description;
    node.querySelector('.tags').textContent = (p.tags||[]).join(' • ');
    const stack = node.querySelector('.project-stack');
    if((p.stack||[]).length){
      stack.innerHTML = '';
      p.stack.forEach(t=>{
        const chip = document.createElement('span');
        chip.className = 'stack-chip';
        chip.textContent = t;
        stack.appendChild(chip);
      });
    }
    const live = node.querySelector('.live-link');
    const src = node.querySelector('.source-link');
    live.href = p.live || '#';
    src.href = p.source || '#';
    container.appendChild(node);
  })
}

function applySearchFilter(projects){
  const q = document.getElementById('search').value.toLowerCase().trim();
  const f = String(document.getElementById('filter').value || '').toLowerCase();
  return projects.filter(p=>{
    if(f !== 'all'){
      const tagsLower = (p.tags||[]).map(t=>String(t).toLowerCase());
      if(!tagsLower.includes(f)) return false;
    }
    if(!q) return true;
    return (p.title + ' ' + p.description + ' ' + (p.tags||[]).join(' ') + ' ' + (p.stack||[]).join(' ')).toLowerCase().includes(q);
  })
}

async function init(){
  const projects = await fetchProjects();
  fetchJson(timelineUrl).then(renderTimeline);
  const filter = document.getElementById('filter');
  const tags = new Set();
  projects.forEach(p=> (p.tags||[]).forEach(t=>tags.add(t)));
  // ensure option values are lowercase to avoid mismatches
  tags.forEach(t=>{
    const opt=document.createElement('option');
    opt.value = String(t).toLowerCase();
    opt.textContent = t;
    filter.appendChild(opt);
  });
  try{ filter.value = 'all'; }catch(e){}

  const search = document.getElementById('search');
  const render = ()=>{
    console.log('Render called. filter=', filter.value, 'search=', search.value);
    renderProjects(applySearchFilter(projects));
  };
  search.addEventListener('input', render);
  filter.addEventListener('change', render);

  document.getElementById('themeToggle').addEventListener('click', ()=>{
    document.documentElement.classList.toggle('light');
  })

  render();
}

init();
